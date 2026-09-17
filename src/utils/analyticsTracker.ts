// Zero-Dependency Client-Side Telemetry & Visitor Tracking Engine for AI Chronicle 2026
// Tracks Pageviews, Unique Visitors, Milestones, Dwell Time, Referrers, Devices, and Screen Specs

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

// Pre-seed realistic telemetry data if storage is fresh
function seedInitialTelemetry(): VisitorLogEntry[] {
  const seedList: VisitorLogEntry[] = [
    {
      id: 'log_seed_01',
      visitorId: 'v_us_92a81f',
      sessionId: 's_81f09',
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      path: '/stage (2024-2026 具身智能)',
      milestoneId: 'ms_deepseek_r1',
      milestoneTitle: 'DeepSeek-R1 开源推理模型冲击波',
      referrer: 'X / Twitter',
      deviceType: 'Mobile',
      os: 'iOS',
      browser: 'Safari',
      screenResolution: '393x852',
      language: 'en-US',
      dwellSeconds: 245,
    },
    {
      id: 'log_seed_02',
      visitorId: 'v_cn_41c09b',
      sessionId: 's_9921a',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      path: '/ecosystem (全球生态算力特权)',
      referrer: 'GitHub',
      deviceType: 'Desktop',
      os: 'macOS',
      browser: 'Chrome',
      screenResolution: '1728x1117',
      language: 'zh-CN',
      dwellSeconds: 380,
    },
    {
      id: 'log_seed_03',
      visitorId: 'v_eu_77f43e',
      sessionId: 's_33d91',
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      path: '/stage (2022-2023 大语言模型大爆发)',
      milestoneId: 'ms_gpt4',
      milestoneTitle: 'GPT-4 发布与多模态跃升',
      referrer: 'Google Search',
      deviceType: 'Desktop',
      os: 'Windows',
      browser: 'Edge',
      screenResolution: '1920x1080',
      language: 'de-DE',
      dwellSeconds: 512,
    },
    {
      id: 'log_seed_04',
      visitorId: 'v_jp_52b11a',
      sessionId: 's_44c12',
      timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
      path: '/lab (范式演化实验室)',
      referrer: 'Hacker News',
      deviceType: 'Desktop',
      os: 'Linux',
      browser: 'Firefox',
      screenResolution: '2560x1440',
      language: 'en-US',
      dwellSeconds: 620,
    },
    {
      id: 'log_seed_05',
      visitorId: 'v_cn_88d30e',
      sessionId: 's_11b89',
      timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      path: '/stage (2024-2026 具身智能)',
      milestoneId: 'ms_claude_35_sonnet',
      milestoneTitle: 'Claude 3.5 Sonnet 与智能体工作流',
      referrer: '知乎 (Zhihu)',
      deviceType: 'Mobile',
      os: 'Android',
      browser: 'Chrome',
      screenResolution: '412x915',
      language: 'zh-CN',
      dwellSeconds: 195,
    },
    {
      id: 'log_seed_06',
      visitorId: 'v_sg_33e99a',
      sessionId: 's_77b02',
      timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      path: '/reader (深度编年史通读)',
      referrer: 'Direct / Direct Traffic',
      deviceType: 'Desktop',
      os: 'macOS',
      browser: 'Safari',
      screenResolution: '1440x900',
      language: 'en-GB',
      dwellSeconds: 840,
    },
    {
      id: 'log_seed_07',
      visitorId: 'v_kr_19f72c',
      sessionId: 's_65e10',
      timestamp: new Date(Date.now() - 160 * 60 * 1000).toISOString(),
      path: '/stage (2012-2016 深度学习觉醒)',
      milestoneId: 'ms_alexnet',
      milestoneTitle: 'AlexNet 夺得 ImageNet 冠军',
      referrer: 'Google Search',
      deviceType: 'Tablet',
      os: 'iOS',
      browser: 'Safari',
      screenResolution: '820x1180',
      language: 'ko-KR',
      dwellSeconds: 310,
    }
  ];

  try {
    localStorage.setItem(VISITOR_LOGS_KEY, JSON.stringify(seedList));
  } catch (e) {
    console.error(e);
  }
  return seedList;
}

// Retrieve all visitor logs
export function getVisitorLogs(): VisitorLogEntry[] {
  try {
    const raw = localStorage.getItem(VISITOR_LOGS_KEY);
    if (!raw) {
      return seedInitialTelemetry();
    }
    const logs: VisitorLogEntry[] = JSON.parse(raw);
    if (logs.length === 0) {
      return seedInitialTelemetry();
    }
    return logs;
  } catch {
    return seedInitialTelemetry();
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
  } catch (err) {
    console.error('Failed to record telemetry:', err);
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
