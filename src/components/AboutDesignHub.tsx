import { ShieldCheck, Brain, Sparkles, Terminal, X } from 'lucide-react';
import { getLeads, exportLeadsToCSV } from '../utils/leadStorage';

interface AboutDesignHubProps {
  onClose: () => void;
}

export const AboutDesignHub: React.FC<AboutDesignHubProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto liquid-glass-strong rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl border border-amber-400/30 glass-sheen"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 mb-2">
          <Brain className="w-4 h-4" />
          <span>AI 第二大脑认知底座与液态玻璃工程设计</span>
        </div>

        <h2 className="text-2xl font-serif font-bold text-white mb-2">
          为什么这个界面既“养眼简约”又“充满历史质感”？
        </h2>

        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6">
          本项目深度提取了本机 Obsidian 知识库（
          <code className="text-amber-300 bg-black/30 px-1 py-0.5 rounded font-mono text-xs">
            AI-第二大脑/
          </code>
          ）中的 371 套前沿 UI 提示词原型与《UI设计反AI味基准》。
        </p>

        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="text-amber-300 font-bold mb-1 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              1. 液态玻璃组件系统 (Liquid Glass Two-Tier System)
            </div>
            <p className="text-stone-300 font-sans text-xs leading-relaxed">
              源自知识库《Bloom Liquid Glass Hero》与《Equilibrium》：采用原生 CSS 
              <code className="text-amber-200 ml-1">mask-composite: exclude</code> 渐变描边技术与多层高斯模糊，营造温润暖调、流体光泽感与内嵌高光，彻底告别死板的实色边框。
            </p>
          </div>

          <div className="p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="text-amber-300 font-bold mb-1 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              2. 简约养眼与信息层级减负 (Radical De-Cluttering)
            </div>
            <p className="text-stone-300 font-sans text-xs leading-relaxed">
              针对“字太多、容易视觉疲劳”的痛点，将 1.8 万字宏伟通史收拢为呼吸感极佳的“胶囊展台”，主体只保留核心纪元、时代箴言与里程碑胶囊，详案按需查阅，让阅读成为一种享受。
            </p>
          </div>

          <div className="p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="text-amber-300 font-bold mb-1 flex items-center">
              <Terminal className="w-3.5 h-3.5 mr-1" />
              3. 动态背景与暖色光影交响
            </div>
            <p className="text-stone-300 font-sans text-xs leading-relaxed">
              自研生成的 3D 液态琥珀与金丝流体背景，配合暗浓缩咖啡灰阶（#0C0A09），赋予整个人工智能通史以普罗米修斯盗火般的文明神圣感与奇点温度。
            </p>
          </div>

          <div className="p-4 rounded-2xl liquid-glass border border-amber-400/30 bg-amber-500/5">
            <div className="text-amber-300 font-bold mb-1 flex items-center justify-between">
              <span className="flex items-center">
                <Brain className="w-3.5 h-3.5 mr-1 text-amber-400" />
                4. 商业变现闭环与潜客 CRM 资产 (Commercial Engine)
              </span>
              <button
                type="button"
                onClick={exportLeadsToCSV}
                className="liquid-glass-amber px-3 py-1 rounded-full text-[11px] text-amber-200 hover:text-white flex items-center space-x-1"
                title="将本站所有购买用户、赞助商意向与订阅邮箱导出为标准 CSV"
              >
                <span>📥 导出线索名单 CSV</span>
              </button>
            </div>
            <p className="text-stone-300 font-sans text-xs leading-relaxed mb-2">
              全站打通了三层商业漏斗：数字资产包直购（带订单号与即时交付）、B2B 智能广告排期测算器、高价值学术内参订阅。所有潜客与订单数据均沉淀于本地 CRM 账本，随时一键导出对接邮件自动化或商务拜访。
            </p>
            <div className="flex items-center space-x-3 text-[11px] font-mono text-amber-300/90 pt-1 border-t border-white/10">
              <span>当前累积有效线索: <b className="text-white">{getLeads().length}</b> 条</span>
              <span>·</span>
              <span className="text-stone-400">支持无缝导入 Beehiiv / Mailchimp / 飞书客户库</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

