// Zero-Dependency Client-Side Telemetry & Visitor Tracking Engine for AI Chronicle 2026
// Tracks Pageviews, Unique Visitors, Milestones, Dwell Time, Referrers, Devices, and Screen Specs
import { recordAffiliateInteraction, getCloudSyncConfig } from './monetizationConfig';

export interface VisitorLogEntry {
  id: string;
  visitorId: string;
  sessionId: string;
  timestamp: string;
  path: string;
  milestoneId?: string;
  milestoneTitle?: string;
  referrer: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  os: string;
  browser: string;
  screenResolution: string;
  language: string;
  dwellSeconds: number;
}

export interface TelemetryStats {
  totalPV: number;
  totalUV: number;
  avgDwellSeconds: number;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  referrerBreakdown: Record<string, number>;
  topMilestones: { title: string; count: number }[];
  recentVisitorsCount: number;
}

const VISITOR_ID_KEY = 'ai_chronicle_vid_v1';
const SESSION_ID_KEY = 'ai_chronicle_sid_v1';
const VISITOR_LOGS_KEY = 'ai_chronicle_visitor_logs_v1';
const DWELL_START_KEY = 'ai_chronicle_dwell_start_v1';

// Detect Device, OS & Browser from navigator
function getClientEnvironment() {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'Desktop' as const,
      os: 'Unknown',
      browser: 'Unknown',
      screenResolution: '1920x1080',
      language: 'zh-CN',
    };
  }

  const ua = navigator.userAgent;
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    deviceType = 'Mobile';
  }

  let os = 'Unknown OS';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = ua.includes('iPhone') || ua.includes('iPad') ? 'iOS' : 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';

  let browser = 'Unknown Browser';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  else if (ua.includes('Edge') || ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const language = navigator.language || 'zh-CN';

  return { deviceType, os, browser, screenResolution, language };
}

// Generate or retrieve persistent Visitor ID
export function getOrCreateVisitorId(): string {
  try {
    let vid = localStorage.getItem(VISITOR_ID_KEY);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).slice(-4);
      localStorage.setItem(VISITOR_ID_KEY, vid);
    }
    return vid;
  } catch {
    return 'v_anon_' + Math.random().toString(36).substring(2, 8);
  }
}

// Generate or retrieve session ID (expires with browser tab)
export function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = 's_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch {
    return 's_anon';
  }
}

// Format referrer nicely
function cleanReferrer(ref: string): string {
  if (!ref || ref.trim() === '') return 'Direct / Direct Traffic';
  try {
    const url = new URL(ref);
    if (url.hostname.includes('github.com')) return 'GitHub';
    if (url.hostname.includes('google.')) return 'Google Search';
    if (url.hostname.includes('twitter.com') || url.hostname.includes('x.com')) return 'X / Twitter';
    if (url.hostname.includes('news.ycombinator.com')) return 'Hacker News';
    if (url.hostname.includes('zhihu.com')) return '知乎 (Zhihu)';
    if (url.hostname.includes('v2ex.com')) return 'V2EX';
    if (url.hostname.includes('bilibili.com')) return 'Bilibili';
    if (url.hostname.includes('juejin.cn')) return '掘金 (Juejin)';
    return url.hostname;
  } catch {
    return ref.substring(0, 30);
  }
}

// Retrieve all authentic visitor logs (100% real, strictly zero simulated/mock data)
export function getVisitorLogs(): VisitorLogEntry[] {
  try {
    const raw = localStorage.getItem(VISITOR_LOGS_KEY);
    if (!raw) return [];
    const logs: VisitorLogEntry[] = JSON.parse(raw);
    // Strict purity filter: strip out any previous test or seed logs
    const realLogs = logs.filter(log => !log.id.startsWith('log_seed_'));
    if (realLogs.length !== logs.length) {
      localStorage.setItem(VISITOR_LOGS_KEY, JSON.stringify(realLogs));
    }
    return realLogs;
  } catch {
    return [];
  }
}

// Record a new visitor action or pageview
export function recordVisitorLog(entry: {
  path: string;
  milestoneId?: string;
  milestoneTitle?: string;
}): void {
  try {
    const vid = getOrCreateVisitorId();
    const sid = getOrCreateSessionId();
    const env = getClientEnvironment();
    const referrer = cleanReferrer(typeof document !== 'undefined' ? document.referrer : '');

    // Calculate dwell time since last action
    let dwellSeconds = 15;
    const lastStart = sessionStorage.getItem(DWELL_START_KEY);
    const now = Date.now();
    if (lastStart) {
      const elapsed = Math.round((now - parseInt(lastStart, 10)) / 1000);
      if (elapsed > 0 && elapsed < 3600) {
        dwellSeconds = elapsed;
      }
    }
    sessionStorage.setItem(DWELL_START_KEY, now.toString());

    const newLog: VisitorLogEntry = {
      id: `log_${now}_${Math.random().toString(36).substring(2, 6)}`,
      visitorId: vid,
      sessionId: sid,
      timestamp: new Date().toISOString(),
      path: entry.path,
      milestoneId: entry.milestoneId,
      milestoneTitle: entry.milestoneTitle,
      referrer,
      deviceType: env.deviceType,
      os: env.os,
      browser: env.browser,
      screenResolution: env.screenResolution,
      language: env.language,
      dwellSeconds,
    };

    const logs = getVisitorLogs();
    logs.unshift(newLog);
    // Keep last 500 logs to prevent localStorage overflow
    if (logs.length > 500) {
      logs.length = 500;
    }
    localStorage.setItem(VISITOR_LOGS_KEY, JSON.stringify(logs));

    // Optional asynchronous zero-dependency cloud synchronization (e.g. Supabase / Worker)
    const cloudCfg = getCloudSyncConfig();
    if (cloudCfg.enableCloudSync && cloudCfg.supabaseUrl && cloudCfg.supabaseAnonKey) {
      try {
        const endpoint = `${cloudCfg.supabaseUrl.replace(/\/$/, '')}/rest/v1/visitor_logs`;
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'apikey': cloudCfg.supabaseAnonKey,
            'Authorization': `Bearer ${cloudCfg.supabaseAnonKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(newLog),
        }).catch(() => {});
      } catch {
        // Non-blocking
      }
    }
  } catch (err) {
    console.error('Failed to record telemetry:', err);
  }
}

// Record 100% genuine affiliate link clicks and coupon copies
export function recordAffiliateAction(
  toolId: string,
  toolName: string,
  actionType: 'click' | 'promo_copy'
): void {
  recordAffiliateInteraction(toolId, toolName, actionType);
  recordVisitorLog({
    path: `/ecosystem/${toolId}`,
    milestoneTitle: actionType === 'click' ? `[商业转化] 点击直达 ${toolName}` : `[商业转化] 复制优惠码 ${toolName}`,
  });
}

// Optional: Fetch real logs from cloud if Supabase integration is active
export async function fetchCloudVisitorLogs(): Promise<VisitorLogEntry[] | null> {
  const cloudCfg = getCloudSyncConfig();
  if (!cloudCfg.enableCloudSync || !cloudCfg.supabaseUrl || !cloudCfg.supabaseAnonKey) {
    return null;
  }
  try {
    const endpoint = `${cloudCfg.supabaseUrl.replace(/\/$/, '')}/rest/v1/visitor_logs?select=*&order=timestamp.desc&limit=500`;
    const res = await fetch(endpoint, {
      headers: {
        'apikey': cloudCfg.supabaseAnonKey,
        'Authorization': `Bearer ${cloudCfg.supabaseAnonKey}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      return data as VisitorLogEntry[];
    }
    return null;
  } catch {
    return null;
  }
}

// Calculate aggregated statistics from visitor logs
export function getVisitorStats(): TelemetryStats {
  const logs = getVisitorLogs();
  const totalPV = logs.length;
  
  // Unique visitors
  const uniqueVids = new Set<string>();
  let totalDwell = 0;
  const deviceCounts = { mobile: 0, desktop: 0, tablet: 0 };
  const referrerMap: Record<string, number> = {};
  const milestoneMap: Record<string, number> = {};

  const recentCutoff = Date.now() - 30 * 60 * 1000; // active in last 30 min
  let recentVisitorsCount = 0;

  logs.forEach((l) => {
    uniqueVids.add(l.visitorId);
    totalDwell += l.dwellSeconds || 30;

    if (l.deviceType === 'Mobile') deviceCounts.mobile++;
    else if (l.deviceType === 'Tablet') deviceCounts.tablet++;
    else deviceCounts.desktop++;

    const ref = l.referrer || 'Direct / Direct Traffic';
    referrerMap[ref] = (referrerMap[ref] || 0) + 1;

    if (l.milestoneTitle) {
      milestoneMap[l.milestoneTitle] = (milestoneMap[l.milestoneTitle] || 0) + 1;
    }

    const logTime = new Date(l.timestamp).getTime();
    if (logTime >= recentCutoff) {
      recentVisitorsCount++;
    }
  });

  const totalUV = uniqueVids.size;
  const avgDwellSeconds = totalPV > 0 ? Math.round(totalDwell / totalPV) : 0;

  const topMilestones = Object.entries(milestoneMap)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalPV,
    totalUV,
    avgDwellSeconds,
    deviceBreakdown: deviceCounts,
    referrerBreakdown: referrerMap,
    topMilestones,
    recentVisitorsCount,
  };
}

// Export visitor logs to CSV
export function exportVisitorLogsToCSV(): void {
  const logs = getVisitorLogs();
  if (logs.length === 0) {
    alert('暂无访客访问记录！');
    return;
  }

  const headers = [
    'Log_ID',
    'Visitor_ID',
    'Session_ID',
    'Timestamp',
    'Path_Section',
    'Milestone_Viewed',
    'Referrer_Source',
    'Device_Type',
    'Operating_System',
    'Browser',
    'Resolution',
    'Language',
    'Dwell_Seconds',
  ].join(',');

  const rows = logs.map((l) => {
    const path = `"${(l.path || '').replace(/"/g, '""')}"`;
    const milestone = `"${(l.milestoneTitle || 'N/A').replace(/"/g, '""')}"`;
    const ref = `"${(l.referrer || '').replace(/"/g, '""')}"`;
    return [
      l.id,
      l.visitorId,
      l.sessionId,
      l.timestamp,
      path,
      milestone,
      ref,
      l.deviceType,
      l.os,
      l.browser,
      l.screenResolution,
      l.language,
      l.dwellSeconds,
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `AI_Chronicle_Visitor_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Clear logs (owner utility)
export function clearVisitorLogs(): void {
  try {
    localStorage.removeItem(VISITOR_LOGS_KEY);
  } catch (e) {
    console.error(e);
  }
}
