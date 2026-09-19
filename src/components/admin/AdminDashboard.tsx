import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Activity,
  Users,
  Clock,
  Globe,
  Shield,
  Key,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Smartphone,
  Laptop,
  Tablet,
  DollarSign,
  Mail,
  Zap,
  LogOut,
  ExternalLink,
  Lock,
  RotateCcw,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';
import {
  getVisitorLogs,
  getVisitorStats,
  exportVisitorLogsToCSV,
  clearVisitorLogs,
  VisitorLogEntry,
  TelemetryStats,
} from '../../utils/analyticsTracker';
import {
  getLeads,
  exportLeadsToCSV,
  LeadRecord
} from '../../utils/leadStorage';
import {
  getSecurityAuditLogs,
  terminateSession,
  getLockoutState,
  resetFailedAttempts,
  SecurityAuditEntry,
} from '../../utils/securityWall';
import { useAnimatedPresence } from '../../hooks/useAnimatedPresence';
import { soundFX } from '../../utils/audioEffects';
import { AdminMonetizationHub } from './AdminMonetizationHub';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'analytics' | 'crm' | 'monetization' | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { isMounted, isAnimatingOut } = useAnimatedPresence(isOpen, 220);
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [visitorLogs, setVisitorLogs] = useState<VisitorLogEntry[]>([]);
  const [stats, setStats] = useState<TelemetryStats | null>(null);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'All' | 'Desktop' | 'Mobile' | 'Tablet'>('All');
  const [leadFilter, setLeadFilter] = useState<string>('All');
  
  // Sovereign Token State
  const [tokenCopied, setTokenCopied] = useState(false);
  const SOVEREIGN_TOKEN = '4/0ATsMZqDbEqJWdiTVSo1cTG7kOIk3fhnr68dn0c-lJTpRNOL5gm7JiAQB95oemjosrVXSwQ';
  
  useEffect(() => {
    if (isOpen) {
      soundFX.playModalOpen();
    }
  }, [isOpen]);

  const handleClose = () => {
    soundFX.playModalClose();
    onClose();
  };
  
  const handleCopyToken = () => {
    try {
      navigator.clipboard.writeText(SOVEREIGN_TOKEN);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Auto-refresh timer for session & live stream
  const [sessionRemaining, setSessionRemaining] = useState<number>(30 * 60);

  const refreshAllData = () => {
    setVisitorLogs(getVisitorLogs());
    setStats(getVisitorStats());
    setLeads(getLeads());
    setAuditLogs(getSecurityAuditLogs());
  };

  useEffect(() => {
    if (!isOpen) return;
    refreshAllData();

    // Refresh every 5 seconds for live telemetry
    const dataTimer = setInterval(refreshAllData, 5000);
    // Session countdown
    const sessionTimer = setInterval(() => {
      setSessionRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(dataTimer);
      clearInterval(sessionTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmergencyLogout = () => {
    terminateSession();
    onClose();
  };

  const handleResetLockout = () => {
    resetFailedAttempts();
    setAuditLogs(getSecurityAuditLogs());
    alert('已成功重置安全防御矩阵与暴力破解计数器！');
  };

  // Filtered visitor logs
  const filteredVisitors = visitorLogs.filter((v) => {
    const matchesSearch =
      v.visitorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.milestoneTitle && v.milestoneTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      v.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.os.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.browser.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDevice = deviceFilter === 'All' || v.deviceType === deviceFilter;
    return matchesSearch && matchesDevice;
  });

  // Filtered CRM leads
  const filteredLeads = leads.filter((l) => {
    const matchesFilter = leadFilter === 'All' || l.source === leadFilter;
    const matchesSearch =
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.metadata && JSON.stringify(l.metadata).toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Estimated pipeline GMV
  const bundleCount = leads.filter((l) => l.source === 'bundle_download').length;
  const sponsorCount = leads.filter((l) => l.source === 'sponsor' || l.source === 'sponsor_inquiry').length;
  const estimatedRevenue = bundleCount * 299 + sponsorCount * 5000;

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isMounted) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[200] overflow-y-auto bg-[#0C0A09]/95 text-stone-100 backdrop-blur-2xl selection:bg-amber-500/30 selection:text-amber-200 ${
      isAnimatingOut ? 'animate-modal-backdrop-exit' : 'animate-modal-backdrop-enter'
    }`}>
      <div className={`min-h-screen flex flex-col ${
        isAnimatingOut ? 'animate-modal-box-exit' : 'animate-modal-box-enter'
      }`}>
        {/* Top Sovereign Navigation Header */}
        <header className="sticky top-0 z-50 border-b border-amber-500/20 bg-stone-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-black/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm font-serif font-bold text-stone-100 tracking-wide">
                  AI Chronicle 2026 // 主理人安全控制台
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>CLEARANCE: LEVEL 5</span>
                </span>
              </div>
              <p className="text-[10px] font-mono text-stone-400">
                SOVEREIGN MANAGEMENT VAULT · ZERO-KNOWLEDGE ARCHITECTURE
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="flex items-center rounded-xl bg-stone-900/90 p-1 border border-stone-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>实时访客遥测</span>
            </button>

            <button
              onClick={() => setActiveTab('crm')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'crm'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>商业潜客看板</span>
              {leads.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 font-bold text-[9px]">
                  {leads.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('monetization')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'monetization'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>商业变现与推广</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'security'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>安全防线密钥</span>
            </button>
          </div>

          {/* Right Session & Emergency Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-stone-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>会话剩余: {formatSessionTime(sessionRemaining)}</span>
            </div>

            <button
              onClick={handleEmergencyLogout}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-mono flex items-center space-x-1.5 transition-colors"
              title="销毁当前会话令牌并退出控制台"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">安全自毁并退出</span>
            </button>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg bg-stone-800/60 hover:bg-stone-700/60 text-stone-400 hover:text-white transition-colors"
              title="暂时返回前台网页"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
          {/* TAB 1: 实时访客遥测与流量监控 */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">全站总访问量 (PV)</span>
                    <Activity className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {stats?.totalPV || 0}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 mt-2 flex items-center space-x-1">
                    <span>↑ 累计实时记录</span>
                    <span className="text-stone-500">· 自动心跳</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">独立访客数 (UV)</span>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {stats?.totalUV || 0}
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 mt-2">
                    独占率 {stats && stats.totalPV > 0 ? Math.round((stats.totalUV / stats.totalPV) * 100) : 100}%
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">平均驻留时长</span>
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {Math.floor((stats?.avgDwellSeconds || 0) / 60)}分 {(stats?.avgDwellSeconds || 0) % 60}秒
                  </div>
                  <div className="text-[11px] font-mono text-purple-400 mt-2">
                    深度沉浸度极高
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">近期活跃度 (30min)</span>
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
                    {stats?.recentVisitorsCount || 1}
                  </div>
                  <div className="text-[11px] font-mono text-stone-400 mt-2 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
                    <span>实时在线交互中</span>
                  </div>
                </div>
              </div>

              {/* Breakdown Grid: Device & Referrer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Device Breakdown */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-4 flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>访问终端与设备分布</span>
                  </h3>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <div className="flex justify-between text-stone-300 mb-1">
                        <span className="flex items-center space-x-1.5">
                          <Laptop className="w-3.5 h-3.5 text-stone-400" />
                          <span>桌面电脑 (Desktop)</span>
                        </span>
                        <span className="font-mono">{stats?.deviceBreakdown.desktop || 0} 访问</span>
                      </div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{
                            width: `${
                              stats && stats.totalPV > 0
                                ? ((stats.deviceBreakdown.desktop / stats.totalPV) * 100).toFixed(1)
                                : 50
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-stone-300 mb-1">
                        <span className="flex items-center space-x-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-stone-400" />
                          <span>移动端手机 (Mobile)</span>
                        </span>
                        <span className="font-mono">{stats?.deviceBreakdown.mobile || 0} 访问</span>
                      </div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all"
                          style={{
                            width: `${
                              stats && stats.totalPV > 0
                                ? ((stats.deviceBreakdown.mobile / stats.totalPV) * 100).toFixed(1)
                                : 40
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-stone-300 mb-1">
                        <span className="flex items-center space-x-1.5">
                          <Tablet className="w-3.5 h-3.5 text-stone-400" />
                          <span>平板设备 (Tablet)</span>
                        </span>
                        <span className="font-mono">{stats?.deviceBreakdown.tablet || 0} 访问</span>
                      </div>
                      <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all"
                          style={{
                            width: `${
                              stats && stats.totalPV > 0
                                ? ((stats.deviceBreakdown.tablet / stats.totalPV) * 100).toFixed(1)
                                : 10
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Referrers Breakdown */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-4 flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>流量来源与引荐渠道</span>
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    {stats && Object.keys(stats.referrerBreakdown).length > 0 ? (
                      Object.entries(stats.referrerBreakdown).map(([ref, count], idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-stone-950/40 border border-white/5"
                        >
                          <span className="text-stone-300 font-mono truncate max-w-[220px]">{ref}</span>
                          <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono text-[11px]">
                            {count} 次引流
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-stone-500 text-xs py-4 text-center">暂无外部引荐来源数据</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Visitor Stream Table */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-2">
                      <span>实时访客访问流水记录</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono">
                        LIVE TELEMETRY
                      </span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      完整记录访问时间戳、设备操作系统、分辨率、浏览里程碑与驻留秒数
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={refreshAllData}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono flex items-center space-x-1.5 transition-colors"
                      title="刷新列表"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>刷新</span>
                    </button>

                    <button
                      onClick={exportVisitorLogsToCSV}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center space-x-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>导出访客 CSV</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('确定要清空全部访客历史记录吗？')) {
                          clearVisitorLogs();
                          refreshAllData();
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 text-red-400 text-xs font-mono flex items-center space-x-1 transition-colors"
                      title="清空日志"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="搜索访客 ID、页面、里程碑、来源渠道、系统..."
                      className="w-full bg-black/40 border border-stone-800 focus:border-amber-500/60 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-stone-800 text-xs font-mono">
                    {(['All', 'Desktop', 'Mobile', 'Tablet'] as const).map((dev) => (
                      <button
                        key={dev}
                        onClick={() => setDeviceFilter(dev)}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${
                          deviceFilter === dev ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {dev === 'All' ? '全部设备' : dev}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-stone-800">
                  <table className="w-full text-left text-xs text-stone-300 font-mono">
                    <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="p-3">访问时间</th>
                        <th className="p-3">访客标识 (UID)</th>
                        <th className="p-3">页面 / 浏览里程碑</th>
                        <th className="p-3">来源渠道</th>
                        <th className="p-3">设备 / 系统 / 浏览器</th>
                        <th className="p-3">屏幕规格</th>
                        <th className="p-3 text-right">停留时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {filteredVisitors.length > 0 ? (
                        filteredVisitors.map((log) => (
                          <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3 text-stone-400 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })}
                              <span className="block text-[10px] text-stone-500">
                                {new Date(log.timestamp).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-stone-700">
                                {log.visitorId}
                              </span>
                            </td>
                            <td className="p-3 max-w-[240px]">
                              <span className="text-stone-200 block truncate">{log.path}</span>
                              {log.milestoneTitle && (
                                <span className="text-[11px] text-amber-400/90 block truncate">
                                  ↳ {log.milestoneTitle}
                                </span>
                              )}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-full bg-stone-950 text-stone-300 border border-white/5 text-[11px]">
                                {log.referrer}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap text-stone-300">
                              <div className="flex items-center space-x-1.5">
                                {log.deviceType === 'Mobile' ? (
                                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                                ) : log.deviceType === 'Tablet' ? (
                                  <Tablet className="w-3.5 h-3.5 text-purple-400" />
                                ) : (
                                  <Laptop className="w-3.5 h-3.5 text-amber-400" />
                                )}
                                <span>
                                  {log.os} · {log.browser}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 whitespace-nowrap text-stone-400 text-[11px]">
                              {log.screenResolution} ({log.language})
                            </td>
                            <td className="p-3 whitespace-nowrap text-right text-emerald-400 font-bold">
                              {log.dwellSeconds}s
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-stone-500 font-sans">
                            未找到符合条件的访客记录
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 商业潜客与订单看板 */}
          {activeTab === 'crm' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Commercial Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">商业管线预估 GMV</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-400">
                    ¥{estimatedRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] font-mono text-stone-400 mt-2">
                    含 4K 套装 + 商业赞助线索
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">商业线索总量</span>
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {leads.length}
                  </div>
                  <div className="text-[11px] font-mono text-amber-400 mt-2">
                    高净值技术与投资人群
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">4K 数字资产订购</span>
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-purple-300">
                    {bundleCount}
                  </div>
                  <div className="text-[11px] font-mono text-purple-400 mt-2">
                    单价 ¥299 终身特权
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between text-stone-400 mb-2">
                    <span className="text-xs font-medium">品牌赞助意向</span>
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-cyan-300">
                    {sponsorCount}
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 mt-2">
                    B2B 生态展位与联名
                  </div>
                </div>
              </div>

              {/* Leads CRM Table */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-2">
                      <span>商业线索与订购客户全景库</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                        CRM LEDGER
                      </span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      实时归集前台所有 Newsletter 订阅、4K 资产购买咨询与 B2B 品牌赞助表单
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={refreshAllData}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono flex items-center space-x-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>刷新</span>
                    </button>

                    <button
                      onClick={exportLeadsToCSV}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center space-x-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>导出客户 CSV</span>
                    </button>
                  </div>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <div className="relative flex-1 w-full">
                    <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="搜索客户邮箱、意向需求或备注信息..."
                      className="w-full bg-black/40 border border-stone-800 focus:border-amber-500/60 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-stone-800 text-xs font-mono">
                    {[
                      { id: 'All', label: '全部' },
                      { id: 'newsletter', label: '邮件订阅' },
                      { id: 'bundle_download', label: '4K 套装' },
                      { id: 'sponsor_inquiry', label: '品牌赞助' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setLeadFilter(item.id)}
                        className={`px-2.5 py-1 rounded-lg transition-colors ${
                          leadFilter === item.id ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Leads Table */}
                <div className="overflow-x-auto rounded-xl border border-stone-800">
                  <table className="w-full text-left text-xs text-stone-300 font-mono">
                    <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="p-3">登记时间</th>
                        <th className="p-3">客户联系邮箱</th>
                        <th className="p-3">线索来源类型</th>
                        <th className="p-3">语言偏好</th>
                        <th className="p-3">意向详情 / 元数据</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {filteredLeads.length > 0 ? (
                        filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3 text-stone-400 whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleString()}
                            </td>
                            <td className="p-3 font-semibold text-stone-200 whitespace-nowrap">
                              {lead.email}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  lead.source === 'bundle_download'
                                    ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                    : lead.source === 'sponsor_inquiry' || lead.source === 'sponsor'
                                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                }`}
                              >
                                {lead.source === 'bundle_download'
                                  ? '4K 资产购买'
                                  : lead.source === 'sponsor_inquiry' || lead.source === 'sponsor'
                                  ? '品牌赞助咨询'
                                  : 'Newsletter 订阅'}
                              </span>
                            </td>
                            <td className="p-3 whitespace-nowrap uppercase text-stone-400">
                              {lead.language}
                            </td>
                            <td className="p-3 max-w-xs text-stone-400 truncate">
                              {lead.metadata ? JSON.stringify(lead.metadata) : '无额外备注'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-stone-500 font-sans">
                            当前线索库为空（前台已有用户订阅或索取资料后即自动汇总至此）
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 商业变现与推广中心 */}
          {activeTab === 'monetization' && <AdminMonetizationHub />}

          {/* TAB 4: 安全防线与主控密钥 */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Sovereign Master Root Token Card */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>主理人专属唯一根凭证 (Sovereign Root Token)</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                      严格单钥准入
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed">
                    已彻底删除并作废所有备用简易口令（如 admin2026 等）。全站安全矩阵仅认准您亲自提供的唯一安全令牌，杜绝一切弱口令爆破隐患。
                  </p>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span>已授权主理人唯一令牌:</span>
                      <button
                        onClick={handleCopyToken}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] flex items-center space-x-1 transition-colors"
                      >
                        {tokenCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{tokenCopied ? '已复制' : '复制凭证'}</span>
                      </button>
                    </div>
                    <div className="font-mono text-xs text-amber-200 break-all select-all bg-stone-950 p-2.5 rounded-lg border border-white/5">
                      {SOVEREIGN_TOKEN}
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] font-mono text-stone-400 bg-stone-950/40 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between">
                      <span>签名算法:</span>
                      <span className="text-stone-300">Salted SHA-256 (Web Crypto)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>零知识哈希指纹:</span>
                      <span className="text-stone-500 truncate max-w-[200px]" title="45deb3dceda578a4fff4956bb2e9dc50891f410999896fbe70af155a417e0d5e">
                        45deb3dc...e0d5e
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>后门防护:</span>
                      <span className="text-emerald-400">ZERO BACKDOORS (严格单钥)</span>
                    </div>
                  </div>
                </div>

                {/* Anti-Brute Force Sentinel Card */}
                <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>防暴力破解哨兵状态 (Sentinel Matrix)</span>
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      系统自动监控非主理人的试探行为，单 IP 连续失败 5 次即触发 15 分钟全局封锁。
                    </p>

                    <div className="mt-4 p-4 rounded-xl bg-black/40 border border-stone-800 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-stone-400">当前锁定状态:</span>
                        <span className={getLockoutState().isLocked ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                          {getLockoutState().isLocked ? '已锁定 (LOCKOUT)' : '正常守护中 (ACTIVE)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">累计失败试探:</span>
                        <span className="text-amber-400">{getLockoutState().failedAttempts} / 5 次</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">加密算法:</span>
                        <span className="text-stone-300">Salted SHA-256 (Web Crypto API)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">会话有效期:</span>
                        <span className="text-stone-300">30 分钟 (自动延展)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center space-x-3">
                    <button
                      onClick={handleResetLockout}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono flex items-center justify-center space-x-2 transition-colors border border-stone-700"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>重置失败防御计数器</span>
                    </button>

                    <button
                      onClick={handleEmergencyLogout}
                      className="py-2.5 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-mono transition-colors"
                    >
                      销毁会话
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Audit Trail Table */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-2">
                    <span>安全审计溯源日志 (Audit Trail)</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono">
                      IMMUTABLE LOGS
                    </span>
                  </h3>
                  <button
                    onClick={refreshAllData}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-stone-800">
                  <table className="w-full text-left text-xs text-stone-300 font-mono">
                    <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="p-3">事件发生时间</th>
                        <th className="p-3">事件类型</th>
                        <th className="p-3">审计详细说明</th>
                        <th className="p-3">终端指纹</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60">
                      {auditLogs.length > 0 ? (
                        auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3 text-stone-400 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  log.type === 'LOGIN_SUCCESS'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : log.type === 'LOGIN_FAILED'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                    : log.type === 'LOCKOUT_TRIGGERED'
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                                }`}
                              >
                                {log.type}
                              </span>
                            </td>
                            <td className="p-3 text-stone-200">{log.detail}</td>
                            <td className="p-3 text-stone-500 max-w-xs truncate">{log.userAgent}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-6 text-center text-stone-500 font-sans">
                            暂无安全防御报警记录
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>,
    document.body
  );
};
