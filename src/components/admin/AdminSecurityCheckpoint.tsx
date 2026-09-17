import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, ShieldCheck, Lock, Key, AlertTriangle, Eye, EyeOff, X, Terminal } from 'lucide-react';
import { verifyPasskey, getLockoutState, LockoutState } from '../../utils/securityWall';

interface AdminSecurityCheckpointProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export const AdminSecurityCheckpoint: React.FC<AdminSecurityCheckpointProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutState, setLockoutState] = useState<LockoutState>({
    isLocked: false,
    remainingSeconds: 0,
    failedAttempts: 0,
  });

  // Sync lockout state every second if locked
  useEffect(() => {
    if (!isOpen) return;
    const updateState = () => {
      const current = getLockoutState();
      setLockoutState(current);
    };

    updateState();
    const interval = setInterval(updateState, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (lockoutState.isLocked) return;
    if (!passkey.trim()) {
      setErrorMessage('请输入主理人安全通行凭证');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      // Artificial subtle delay to resist side-channel timing attacks
      await new Promise((r) => setTimeout(r, 450));
      const ok = await verifyPasskey(passkey.trim());

      if (ok) {
        setPasskey('');
        onAuthenticated();
      } else {
        const state = getLockoutState();
        setLockoutState(state);
        if (state.isLocked) {
          setErrorMessage(`安全防线已触发：连续失败已达上限，控制台临时封锁 15 分钟`);
        } else {
          setErrorMessage(`凭证无效！剩余安全尝试机会：${5 - state.failedAttempts} 次`);
        }
      }
    } catch {
      setErrorMessage('校验过程发生异常，请稍后重试');
    } finally {
      setIsVerifying(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 select-none animate-fadeIn">
      {/* Deep Cyber Backdrop */}
      <div
        className="absolute inset-0 bg-[#0C0A09]/90 backdrop-blur-xl transition-opacity"
        onClick={onClose}
      />

      {/* Futuristic Glass Container */}
      <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-stone-900/95 to-black/95 border border-amber-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden text-stone-100">
        {/* Neon scanline accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          title="关闭验证门"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                SENTINEL GATEWAY v2.4
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-100 mt-1">
              AI 编年史 · 主理人安全通道
            </h2>
          </div>
        </div>

        {/* Security Warning & Explanation */}
        <div className="text-xs text-stone-400 mb-5 leading-relaxed bg-stone-950/60 p-3 rounded-lg border border-white/5 flex items-start space-x-2.5">
          <Terminal className="w-4 h-4 text-amber-400/80 flex-shrink-0 mt-0.5" />
          <span>
            受零知识加密协议保护。后台包含全局访客流量遥测与商业线索看板，仅允许主理人凭专属密钥通行。
          </span>
        </div>

        {/* Lockout Banner */}
        {lockoutState.isLocked && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 animate-bounce" />
            <div>
              <p className="font-semibold text-red-300">防暴力破解封锁机制已生效</p>
              <p className="text-stone-300 mt-0.5">
                请等待冷冻期解除：<span className="font-mono text-red-400 font-bold">{lockoutState.remainingSeconds}</span> 秒
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && !lockoutState.isLocked && (
          <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-stone-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>通行令牌或主控口令</span>
              </span>
              <span className="text-[10px] text-stone-500">SHA-256 + Salt</span>
            </label>

            <div className="relative">
              <input
                type={showPasskey ? 'text' : 'password'}
                value={passkey}
                disabled={lockoutState.isLocked || isVerifying}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="输入授权凭证 / 主控密钥..."
                autoFocus
                className="w-full bg-black/60 border border-stone-700/60 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono transition-all pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors p-1"
                title={showPasskey ? '隐藏凭证' : '显示凭证'}
              >
                {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              disabled={lockoutState.isLocked || isVerifying}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-xs tracking-wide transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>正在比对加密哈希...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>验证并解锁控制台</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white text-xs font-mono transition-all text-center"
            >
              退出
            </button>
          </div>
        </form>

        {/* Footer Sentinel Tag */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-stone-500">
          <span>SEC_WALL: ACTIVE</span>
          <span className="text-amber-400/60">SOVEREIGN ACCESS ONLY</span>
        </div>
      </div>
    </div>,
    document.body
  );
};
