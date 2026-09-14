import React, { useState } from 'react';
import { Download, Check, Sparkles, FileText, Image, ShieldCheck, X, ArrowDownToLine, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PremiumBundleModalProps {
  onClose: () => void;
}

export const PremiumBundleModal: React.FC<PremiumBundleModalProps> = ({ onClose }) => {
  const { currentLang } = useLanguage();
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);

  const bundleItems = [
    {
      title: '《AI 全景通史》学术定本离线全集',
      format: 'PDF (Print-Ready) + EPUB + Markdown',
      desc: '1.8 万字纯文本、精校注释、7大章节排版，适合 Kindle、iPad 及离线深度阅读。',
      icon: FileText,
    },
    {
      title: '4K 超清 3D 纪元图谱与架构壁纸包',
      format: '3840x2160 PNG / SVG 矢量',
      desc: '自研 3D 暖光流体玻璃全景时空图谱，可作桌面壁纸、学术演讲 PPT 背景与展厅素材。',
      icon: Image,
    },
    {
      title: '双重缩放定律离线单页计算仿真器',
      format: 'Standalone Single HTML',
      desc: '无需联网，双击即用的测试时算力（Test-Time Compute）与预训练算力交互仿真工具。',
      icon: Zap,
    },
    {
      title: 'LaTeX 学术引用与 BibTeX 知识图谱库',
      format: 'BibTeX (.bib) + Citation Graph',
      desc: '包含 25+ 项里程碑核心论文的规范 BibTeX 条目，一键直接导入 Overleaf 与 Zotero。',
      icon: Sparkles,
    },
  ];

  const handleDownloadSample = () => {
    setDownloadStarted(true);
    // Create a mock sample text file download
    const sampleContent = `# 人工智能全景通史（1943 — 2026.09.13 历史定本）\n\n感谢下载《AI 全景通史》数字化精简资产包！\n官网地址: https://mumumumuyi.github.io/ai-chronicle-2026/\n\n全量 4K 离线大图、LaTeX 源码与高清 PDF 请通过官方赞助通道获取。\n祝愿每一位探索通用人工智能的学者与工程师，在奇点破晓之时保持清醒与敬畏！`;
    const blob = new Blob([sampleContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AI_Chronicle_2026_Sample_Bundle.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200 no-print"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto liquid-glass-strong rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl border border-amber-400/40 glass-sheen"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 mb-2">
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span className="tracking-wider font-semibold">CANONICAL DIGITAL ASSET BUNDLE</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400 text-[11px]">数字化资产包</span>
        </div>

        <h3 className="text-2xl font-serif font-bold text-white mb-2">
          {currentLang === 'zh' ? '获取《2026 AGI 全景通史》完整数字化资产包' : 'Get The Complete 2026 AGI Chronicle Asset Pack'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6">
          专为高校研究团队、AI 算法工程师、科技博主与投资人打造的完整离线典藏版。包含全部高清矢量图谱、离线排版文档与仿真器源码。
        </p>

        {/* Bundle Content Items */}
        <div className="space-y-3 mb-6">
          {bundleItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-start space-x-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-white">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-amber-300 border border-white/10">
                      {item.format}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Download & Sponsor Action Box */}
        <div className="p-5 rounded-2xl bg-amber-500/[0.08] border border-amber-400/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-mono text-amber-300 font-bold">限时研学特惠礼包</div>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-2xl font-mono font-bold text-white">¥19.9</span>
                <span className="text-xs text-stone-400 line-through">¥99.0</span>
                <span className="text-xs text-stone-400">/ $2.99 USD</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownloadSample}
                className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-mono text-stone-300 hover:text-white flex items-center space-x-1.5 transition-all"
              >
                <ArrowDownToLine className="w-3.5 h-3.5 text-amber-400" />
                <span>免费试读样章</span>
              </button>
              <button
                onClick={() => {
                  alert('请使用微信/支付宝扫码赞助 ¥19.9，备注【通史资产包】并发送至 sponsor@aichronicle.com，即可秒级获取全量网盘下载链接与解压密码！');
                }}
                className="liquid-glass-amber px-4 py-2 rounded-full text-xs font-mono font-bold text-amber-200 hover:text-white flex items-center space-x-1.5 transition-all shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>立即解锁全量包</span>
              </button>
            </div>
          </div>

          {downloadStarted && (
            <div className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1.5 pt-2 border-t border-white/10">
              <Check className="w-3.5 h-3.5" />
              <span>精简样章已触发下载 (AI_Chronicle_2026_Sample_Bundle.md)</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-[11px] font-mono text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>支持个人永久研读、团队内部培训演示及课件教学自由引用</span>
          </div>
        </div>
      </div>
    </div>
  );
};
