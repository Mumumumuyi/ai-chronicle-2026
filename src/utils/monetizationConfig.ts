// Monetization & Real Revenue Configuration Utility for AI Chronicle 2026
// Empowers the site owner to configure real affiliate links, referral codes,
// sponsorship contact details, and tracks 100% authentic conversion metrics.

export interface MonetizationPartner {
  id: string;
  name: string;
  category: 'gpu' | 'code' | 'inference' | 'creative';
  affiliateUrl: string;       // Owner's real referral URL
  officialFallbackUrl: string;// Official site URL fallback
  promoCode?: string;         // Owner's real promo code
  perkBadgeZh: string;
  perkBadgeEn: string;
  taglineZh: string;
  taglineEn: string;
  descZh: string;
  descEn: string;
  commissionNote: string;     // Note explaining real revenue payout mechanism
  featured?: boolean;
}

export interface OwnerBusinessContact {
  contactEmail: string;       // Real business email
  wechatId: string;          // Real WeChat ID
  telegramHandle?: string;   // Optional Telegram handle
  afdianUrl?: string;        // Optional 爱发电赞助主页
  buyMeACoffeeUrl?: string;  // Optional Buy Me a Coffee / Stripe link
  sponsorTier1PriceZh: string;
  sponsorTier1PriceEn: string;
  sponsorTier2PriceZh: string;
  sponsorTier2PriceEn: string;
  customNoticeZh?: string;
  qrCodeUrl?: string;         // Custom QR code image path or URL
}

export interface CloudSyncConfig {
  enableCloudSync: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export interface AffiliateClickMetric {
  toolId: string;
  toolName: string;
  clicks: number;
  promoCopies: number;
  lastInteractionAt: string;
}

const PARTNERS_CONFIG_KEY = 'ai_chronicle_partners_cfg_v1';
const OWNER_CONTACT_KEY = 'ai_chronicle_owner_contact_v1';
const CLOUD_SYNC_KEY = 'ai_chronicle_cloud_sync_cfg_v1';
const AFFILIATE_METRICS_KEY = 'ai_chronicle_affiliate_metrics_v1';

// Default partner base definitions with realistic programs
export const DEFAULT_PARTNERS: MonetizationPartner[] = [
  // 1. GPU & Compute (Highest earning potential: 10%-15% recurring affiliate cash payout)
  {
    id: 'runpod',
    name: 'RunPod Cloud GPUs',
    category: 'gpu',
    affiliateUrl: 'https://runpod.io',
    officialFallbackUrl: 'https://runpod.io',
    perkBadgeZh: '按秒计费 GPU 容器',
    perkBadgeEn: 'Per-second GPU billing',
    taglineZh: '极速按秒计费 H100 / A100 / RTX 4090 算力容器',
    taglineEn: 'Pay-per-second H100, A100, and RTX 4090 cloud GPUs',
    descZh: '全球开发者构建大模型、微调与扩散模型的首选 GPU 容器平台。秒级拉起 PyTorch 与 vLLM 环境，支持按秒计费与 Spot 廉价实例。',
    descEn: 'Deploy PyTorch & vLLM containers in seconds. Secure spot & on-demand instances at fraction of hyperscaler cost.',
    commissionNote: 'RunPod 官方联盟计划：注册用户消费后，推广者可获 10% 现金返现 (可提现 PayPal/银行卡)',
    featured: true,
  },
  {
    id: 'autodl',
    name: 'AutoDL 算力云 (国内首选)',
    category: 'gpu',
    affiliateUrl: 'https://www.autodl.com',
    officialFallbackUrl: 'https://www.autodl.com',
    perkBadgeZh: '国内低延迟算力云',
    perkBadgeEn: 'China-local GPU cloud',
    taglineZh: '国内低延迟、高带宽高校与开发者算力首选',
    taglineEn: 'Leading domestic cloud GPU provider for Chinese universities & labs',
    descZh: '支持国内各大高校与微信/支付宝充值，内置网盘加速与多种预置模型镜像，是中文社区最具性价比的实验利器。',
    descEn: 'Fast localized mirrors, pre-configured weights, and student subsidies with simple mobile billing.',
    commissionNote: 'AutoDL 推荐计划：邀请新用户注册充值，可获得算力代金券提成与推广佣金',
    featured: true,
  },
  {
    id: 'lambdalabs',
    name: 'Lambda Labs GPU Cloud',
    category: 'gpu',
    affiliateUrl: 'https://lambdalabs.com/service/gpu-cloud',
    officialFallbackUrl: 'https://lambdalabs.com/service/gpu-cloud',
    perkBadgeZh: 'H100/H200 裸金属集群',
    perkBadgeEn: 'Bare-metal H100/H200',
    taglineZh: '最高性价比的预训练与深度学习集群',
    taglineEn: 'Cost-effective high-performance clusters for deep learning',
    descZh: '被众多硅谷 AI 独角兽选用的高性能算力平台。提供单卡到 8xH100 裸金属节点，免去繁琐运维，专注前沿探索。',
    descEn: 'Bare-metal and cloud 8xH100/H200 instances for foundational research without long waitlists.',
    commissionNote: '企业级 GPU 采购引荐：针对大客户预订可申请企业商务分佣',
  },

  // 2. Coding Agents & IDEs
  {
    id: 'cursor',
    name: 'Cursor AI IDE',
    category: 'code',
    affiliateUrl: 'https://www.cursor.com',
    officialFallbackUrl: 'https://www.cursor.com',
    perkBadgeZh: 'AI 原生代码编辑器',
    perkBadgeEn: 'AI-first code editor',
    taglineZh: '基于深度仓库感知的下一代 AI 编程编辑器',
    taglineEn: 'The AI-first code editor with deep repository awareness',
    descZh: '可接入多家前沿大模型的 AI 代码编辑器。支持全库语义索引、多文件自动改写与终端自动排障。',
    descEn: 'Seamless multi-file edits, codebase indexing, and contextual generation with frontier LLMs.',
    commissionNote: 'Cursor 推广员计划：邀请新开发者注册使用，获赠 Pro 账户时长或官方大使返利',
    featured: true,
  },
  {
    id: 'windsurf',
    name: 'Windsurf Editor (Codeium)',
    category: 'code',
    affiliateUrl: 'https://codeium.com/windsurf',
    officialFallbackUrl: 'https://codeium.com/windsurf',
    perkBadgeZh: 'Cascade 智能体 IDE',
    perkBadgeEn: 'Agentic Cascade IDE',
    taglineZh: 'Codeium 打造的全新 Flow 级协同编码 Agent',
    taglineEn: 'Agentic IDE powered by Codeium Cascade architecture',
    descZh: '以 Cascade 架构为核心，主动预测开发者意图并在本地工作流中自主演进，消除传统补全的割裂感。',
    descEn: 'Real-time proactive workflow coordination that lives inside your terminal and codebase.',
    commissionNote: 'Codeium 校园与开发者传播支持计划',
  },

  // 3. Inference Acceleration & Serverless API
  {
    id: 'groq',
    name: 'Groq LPU Inference',
    category: 'inference',
    affiliateUrl: 'https://groq.com',
    officialFallbackUrl: 'https://groq.com',
    perkBadgeZh: 'LPU 芯片极速推理',
    perkBadgeEn: 'LPU hardware inference',
    taglineZh: '500+ Tokens/秒的硬件级极限推理芯片',
    taglineEn: '500+ Tokens/second hardware LPU inference engine',
    descZh: '基于专有 LPU 芯片架构，彻底颠覆传统 GPU 内存带宽瓶颈。为实时多智能体与语音交互提供极致流式响应。',
    descEn: 'Deterministic SRAM processing engineered specifically for extreme low-latency LLM generations.',
    commissionNote: 'Groq 开发者引荐与 API 配额返赠计划',
    featured: true,
  },
  {
    id: 'together',
    name: 'Together.ai API',
    category: 'inference',
    affiliateUrl: 'https://together.ai',
    officialFallbackUrl: 'https://together.ai',
    perkBadgeZh: '开源模型 Serverless API',
    perkBadgeEn: 'Open-weight serverless API',
    taglineZh: '全系列开源前沿模型（Llama 3.3 / DeepSeek）一键调用',
    taglineEn: 'Serverless inference endpoints for open-weight models',
    descZh: '提供全球最快、最稳定的开源模型 Serverless API 与专用端点，支持极低成本的 Token 计费与自定 LoRA 适配。',
    descEn: 'Fast, reliable API endpoints for Llama 3.3, DeepSeek, and custom fine-tuned weights.',
    commissionNote: 'Together 推广邀请返利：受邀者首充奖励与长期使用额度分发',
  },

  // 4. Creative & Multimodal
  {
    id: 'midjourney',
    name: 'Midjourney v7',
    category: 'creative',
    affiliateUrl: 'https://www.midjourney.com',
    officialFallbackUrl: 'https://www.midjourney.com',
    perkBadgeZh: '影院级视觉生成',
    perkBadgeEn: 'Cinematic visual generation',
    taglineZh: '顶尖影院级审美与超细节视觉生成引擎',
    taglineEn: 'Cinematic aesthetic generation with photorealistic fidelity',
    descZh: '全球公认视觉审美最强的美学生成平台。支持精准字符渲染、角色与材质一致性控制。',
    descEn: 'State-of-the-art diffusion visuals with consistent character and style parameter controls.',
    commissionNote: '创作者年度会员折扣通道',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs Voice AI',
    category: 'creative',
    affiliateUrl: 'https://elevenlabs.io',
    officialFallbackUrl: 'https://elevenlabs.io',
    perkBadgeZh: '多语言高保真语音合成',
    perkBadgeEn: '29-language voice AI',
    taglineZh: '全球领先的逼真语音克隆与跨语言同声传译',
    taglineEn: 'Natural voice synthesis and cross-language dubbing',
    descZh: '为 AI Agent、播客与影视提供高保真、带情感起伏与呼吸感的合成语音，支持 29 种语言超强复刻。',
    descEn: 'Emotionally nuanced speech generation across 29 languages for interactive voice agents.',
    commissionNote: 'ElevenLabs 官方 Affiliate：享 22% 第一年付费订单现金返佣',
  },
];

export const DEFAULT_OWNER_CONTACT: OwnerBusinessContact = {
  contactEmail: '',
  wechatId: '',
  telegramHandle: '',
  afdianUrl: 'https://afdian.com/a/aichronicle',
  buyMeACoffeeUrl: '',
  qrCodeUrl: '',
  sponsorTier1PriceZh: '¥699 / 月 或 $99 USD',
  sponsorTier1PriceEn: '$99 / mo or ¥699 CNY',
  sponsorTier2PriceZh: '¥4,999 / 季 (独家冠名)',
  sponsorTier2PriceEn: '$699 / quarter (Headline)',
  customNoticeZh: '',
};

export const DEFAULT_CLOUD_SYNC: CloudSyncConfig = {
  enableCloudSync: false,
  supabaseUrl: '',
  supabaseAnonKey: '',
};

// --- Storage API ---

export function getMonetizationPartners(): MonetizationPartner[] {
  try {
    const raw = localStorage.getItem(PARTNERS_CONFIG_KEY);
    if (!raw) return DEFAULT_PARTNERS;
    const saved: MonetizationPartner[] = JSON.parse(raw);
    // Ensure all default partners exist if new ones were added
    return DEFAULT_PARTNERS.map(defaultP => {
      const found = saved.find(s => s.id === defaultP.id);
      return found ? { ...defaultP, ...found } : defaultP;
    });
  } catch {
    return DEFAULT_PARTNERS;
  }
}

export function saveMonetizationPartners(partners: MonetizationPartner[]): void {
  try {
    localStorage.setItem(PARTNERS_CONFIG_KEY, JSON.stringify(partners));
  } catch (err) {
    console.error('Failed to save monetization partners:', err);
  }
}

export function getOwnerContact(): OwnerBusinessContact {
  try {
    const raw = localStorage.getItem(OWNER_CONTACT_KEY);
    if (!raw) return DEFAULT_OWNER_CONTACT;
    return { ...DEFAULT_OWNER_CONTACT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_OWNER_CONTACT;
  }
}

export function saveOwnerContact(contact: OwnerBusinessContact): void {
  try {
    localStorage.setItem(OWNER_CONTACT_KEY, JSON.stringify(contact));
  } catch (err) {
    console.error('Failed to save owner contact:', err);
  }
}

export function getCloudSyncConfig(): CloudSyncConfig {
  try {
    const raw = localStorage.getItem(CLOUD_SYNC_KEY);
    if (!raw) return DEFAULT_CLOUD_SYNC;
    return { ...DEFAULT_CLOUD_SYNC, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CLOUD_SYNC;
  }
}

export function saveCloudSyncConfig(cfg: CloudSyncConfig): void {
  try {
    localStorage.setItem(CLOUD_SYNC_KEY, JSON.stringify(cfg));
  } catch (err) {
    console.error('Failed to save cloud sync config:', err);
  }
}

// 100% Authentic Affiliate Conversion Tracking (Click & Promo Copy counts)
export function getAffiliateMetrics(): Record<string, AffiliateClickMetric> {
  try {
    const raw = localStorage.getItem(AFFILIATE_METRICS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordAffiliateInteraction(
  toolId: string,
  toolName: string,
  type: 'click' | 'promo_copy'
): void {
  try {
    const metrics = getAffiliateMetrics();
    const existing = metrics[toolId] || {
      toolId,
      toolName,
      clicks: 0,
      promoCopies: 0,
      lastInteractionAt: new Date().toISOString(),
    };

    if (type === 'click') {
      existing.clicks += 1;
    } else {
      existing.promoCopies += 1;
    }
    existing.lastInteractionAt = new Date().toISOString();
    metrics[toolId] = existing;

    localStorage.setItem(AFFILIATE_METRICS_KEY, JSON.stringify(metrics));
  } catch (err) {
    console.error('Failed to record affiliate interaction:', err);
  }
}

export function clearAffiliateMetrics(): void {
  try {
    localStorage.removeItem(AFFILIATE_METRICS_KEY);
  } catch (err) {
    console.error('Failed to clear affiliate metrics:', err);
  }
}
