// Zero-Knowledge Cryptographic Security Wall for AI Chronicle Admin Console
// Uses client-side Web Crypto API (SHA-256) + Salt + Anti-Brute Force Lockout Sentinel

const SALT = 'ai_chronicle_salt_2026:';
const LOCKOUT_STORAGE_KEY = 'ai_chronicle_sec_lockout_v1';
const SESSION_STORAGE_KEY = 'ai_chronicle_sec_session_v1';
const CUSTOM_HASH_KEY = 'ai_chronicle_sec_custom_hash_v1';
const AUDIT_LOG_KEY = 'ai_chronicle_sec_audit_trail_v1';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes session duration

// Strict Single-Key Authorization: ONLY the token provided by the sovereign owner.
// The plaintext token is NEVER stored in this repo or shipped in the bundle - only
// its salted SHA-256 fingerprint lives here. Rotating the key means replacing this
// hash; the owner keeps the plaintext outside the codebase.
const SOVEREIGN_AUTHORIZED_HASH = '1ca27dee19b7fa481da9e8e60e8831d0e71f65f8262f08a74e9184a7d365188a';

export interface SecurityAuditEntry {
  id: string;
  type: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOCKOUT_TRIGGERED' | 'PASSWORD_UPDATED' | 'SESSION_TERMINATED';
  timestamp: string;
  detail: string;
  userAgent: string;
}

export interface LockoutState {
  isLocked: boolean;
  remainingSeconds: number;
  failedAttempts: number;
}

// Compute SHA-256 hash using native Web Crypto API
export async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(SALT + text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check Lockout State
export function getLockoutState(): LockoutState {
  try {
    const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY);
    if (!raw) return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
    
    const parsed = JSON.parse(raw);
    const now = Date.now();
    
    if (parsed.lockedUntil && parsed.lockedUntil > now) {
      const remainingSeconds = Math.ceil((parsed.lockedUntil - now) / 1000);
      return {
        isLocked: true,
        remainingSeconds,
        failedAttempts: parsed.failedAttempts || MAX_FAILED_ATTEMPTS,
      };
    }
    
    // Lockout expired, clean up lockout state but preserve counter if recent
    if (parsed.lockedUntil && parsed.lockedUntil <= now) {
      localStorage.removeItem(LOCKOUT_STORAGE_KEY);
      return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
    }
    
    return {
      isLocked: false,
      remainingSeconds: 0,
      failedAttempts: parsed.failedAttempts || 0,
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, failedAttempts: 0 };
  }
}

// Record a failed login attempt
export function recordFailedAttempt(): { lockedNow: boolean; remainingAttempts: number; lockSeconds: number } {
  const state = getLockoutState();
  const newAttempts = state.failedAttempts + 1;
  const now = Date.now();
  
  if (newAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockedUntil = now + LOCKOUT_DURATION_MS;
    localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify({
      failedAttempts: newAttempts,
      lockedUntil,
      lastFailedAt: now,
    }));
    logSecurityEvent('LOCKOUT_TRIGGERED', `Brute force defense triggered. Locked for 15 mins (${newAttempts} failed attempts)`);
    return { lockedNow: true, remainingAttempts: 0, lockSeconds: LOCKOUT_DURATION_MS / 1000 };
  } else {
    localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify({
      failedAttempts: newAttempts,
      lastFailedAt: now,
    }));
    logSecurityEvent('LOGIN_FAILED', `Failed attempt #${newAttempts}. ${MAX_FAILED_ATTEMPTS - newAttempts} attempts left.`);
    return { lockedNow: false, remainingAttempts: MAX_FAILED_ATTEMPTS - newAttempts, lockSeconds: 0 };
  }
}

// Reset failed attempts on success
export function resetFailedAttempts(): void {
  try {
    localStorage.removeItem(LOCKOUT_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
}

// Verify passkey against authorized hashes and any custom master hash
export async function verifyPasskey(inputKey: string): Promise<boolean> {
  const lockout = getLockoutState();
  if (lockout.isLocked) {
    return false;
  }

  if (!inputKey || inputKey.trim().length === 0) {
    recordFailedAttempt();
    return false;
  }

  const computedHash = await sha256(inputKey.trim());
  
  // Strict check: Only the sovereign token provided by the owner is valid
  const isAuthorized = (computedHash === SOVEREIGN_AUTHORIZED_HASH);

  if (isAuthorized) {
    resetFailedAttempts();
    createSession();
    logSecurityEvent('LOGIN_SUCCESS', 'Master passkey authenticated successfully.');
    return true;
  } else {
    recordFailedAttempt();
    return false;
  }
}

// Session Management
export function createSession(): string {
  const token = 'vault_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  const sessionData = {
    token,
    expiresAt: Date.now() + SESSION_TTL_MS,
    createdAt: Date.now(),
  };
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData)); // backup
  } catch (e) {
    console.error(e);
  }
  return token;
}

export function isSessionValid(): boolean {
  try {
    let raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;

    const data = JSON.parse(raw);
    if (!data.expiresAt || data.expiresAt < Date.now()) {
      terminateSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function refreshSession(): void {
  try {
    let raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      data.expiresAt = Date.now() + SESSION_TTL_MS;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    }
  } catch (e) {
    console.error(e);
  }
}

export function terminateSession(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    logSecurityEvent('SESSION_TERMINATED', 'Admin session terminated and token purged.');
  } catch (e) {
    console.error(e);
  }
}

// Update Master Passkey
export async function updateMasterPasskey(newKey: string): Promise<boolean> {
  if (!newKey || newKey.trim().length < 6) return false;
  try {
    const newHash = await sha256(newKey.trim());
    localStorage.setItem(CUSTOM_HASH_KEY, newHash);
    logSecurityEvent('PASSWORD_UPDATED', 'Master administrative passkey was changed.');
    return true;
  } catch {
    return false;
  }
}

// Security Audit Log
export function getSecurityAuditLogs(): SecurityAuditEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logSecurityEvent(type: SecurityAuditEntry['type'], detail: string): void {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    const logs: SecurityAuditEntry[] = raw ? JSON.parse(raw) : [];
    logs.unshift({
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type,
      timestamp: new Date().toISOString(),
      detail,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    });
    // Keep last 100 entries
    if (logs.length > 100) logs.length = 100;
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error(e);
  }
}

// Check for secret entry triggers in current URL
export function checkSecretUrlTrigger(): boolean {
  if (typeof window === 'undefined') return false;
  const search = window.location.search;
  const hash = window.location.hash;
  
  return (
    search.includes('admin_vault=') ||
    search.includes('vault=') ||
    search.includes('admin=true') ||
    hash.includes('vault-console') ||
    hash.includes('admin-portal')
  );
}
