import React from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, Sparkles, Terminal, Layers, X } from 'lucide-react';
import { getLeads, exportLeadsToCSV } from '../utils/leadStorage';

interface AboutDesignHubProps {
  onClose: () => void;
}

export const AboutDesignHub: React.FC<AboutDesignHubProps> = ({ onClose }) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200 no-print"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto liquid-glass-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-stone-100 shadow-2xl border border-amber-400/30 glass-sheen"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
          title="关闭"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 mb-2">
          <Layers className="w-4 h-4" />
          <span>液态玻璃工程设计与前沿出版物美学规范</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
          为什么这个界面既“养眼简约”又“充满历史质感”？
        </h2>

        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6">
          本项目对标世界级数字出版物（Awwwards / Stripe Press / Linear）的严苛工业级设计规范，融合瑞士工匠排版、高信息密度 Bento 架构与液态玻璃（Liquid Glass）材质，彻底杜绝浮夸、空洞的套路化设计。
        </p>

        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="text-amber-300 font-bold mb-1 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              1. 液态玻璃组件系统 (Liquid Glass Two-Tier System)
            </div>
            <p className="text-stone-300 font-sans text-xs leading-relaxed">
              采用原生 CSS 
              <code className="text-amber-200 ml-1">mask-composite: exclude</code> 渐变微描边技术与多层高斯模糊，营造温润暖调、流体光泽感与内嵌高光，以 1px 细微发光边框替代厚重模糊阴影，实现轻盈通透的次世代质感。
            </p>
          </div>

          <div className="p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="text-amber-300 font-bold mb-1 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              2. 简约养眼与信息层级减负 (Radical De-Cluttering)
            </div>
            <p className="text-stone-300 font-sans text-xs leading-relaxed">
              针对“长篇史料容易视觉疲劳”的痛点，将 1.8 万字宏伟通史收拢为呼吸感极佳的“胶囊时空展台”，主体只保留核心纪元、时代箴言与里程碑 Bento 卡片，详案按需查阅，让阅读成为一种享受。
            </p>
          </div>

          <div className="p-4 rounded-2xl liquid-glass border border-white/10">
            <div className="text-amber-300 font-bold mb-1 flex items-center">
              <Terminal className="w-3.5 h-3.5 mr-1" />
              3. 动态背景与暖色光影交响
            </div>
            <p className="text-stone-300 font-sans text-xs leading-relaxed">
              自研生成的 3D 液态琥珀与金丝流体背景，配合暗浓缩咖啡黑曜石灰阶（#0C0A09），赋予整个人工智能通史以普罗米修斯盗火般的文明史诗感与奇点温度。
            </p>
          </div>

          <div className="p-4 rounded-2xl liquid-glass border border-amber-400/30 bg-amber-500/5">
            <div className="text-amber-300 font-bold mb-1 flex items-center justify-between">
              <span className="flex items-center">
                <Layers className="w-3.5 h-3.5 mr-1 text-amber-400" />
                4. 商业变现闭环与客户资产管理 (Commercial Engine)
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
              <span className="text-stone-400">支持无缝导出 Beehiiv / Mailchimp / 飞书客户库</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
