import React, { useState } from 'react';
import { Download, Check, Sparkles, FileText, Image, ShieldCheck, X, ArrowDownToLine, Zap, QrCode, Copy, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { saveLead } from '../utils/leadStorage';

interface PremiumBundleModalProps {
  onClose: () => void;
}

export const PremiumBundleModal: React.FC<PremiumBundleModalProps> = ({ onClose }) => {
  const { currentLang } = useLanguage();
  const [step, setStep] = useState<'details' | 'checkout' | 'delivered'>('details');
  const [orderId] = useState<string>(() => `AC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [copiedOrder, setCopiedOrder] = useState<boolean>(false);

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
    const sampleContent = `# 人工智能全景通史（1943 — 2026.09.13 历史定本样章）\n\n感谢下载《AI 全景通史》数字化精简样章！\n在线完整版: https://mumumumuyi.github.io/ai-chronicle-2026/\n\n全量 4K 离线大图、LaTeX 源码与高清 PDF 可通过官方快速通道获取。\n订单编号: ${orderId}\n祝愿每一位探索通用人工智能的学者与工程师保持清醒与敬畏！`;
    triggerFileDownload('AI_Chronicle_Sample_Chapter.md', sampleContent);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail || !buyerEmail.includes('@')) {
      alert('请输入有效的邮箱以便接收资产包与更新！');
      return;
    }

    // Save buyer to lead ledger
    saveLead(buyerEmail, 'bundle_download', currentLang);
    setStep('delivered');

    // Deliver full asset bundle archive
    const fullBundleContent = `# 《人工智能演进全景通史》（1943 — 2026.09.13 典藏全量定本）\n\n【专属凭据】\n订单号: ${orderId}\n绑定邮箱: ${buyerEmail}\n授权类型: 个人永久研究与学术引用授权\n\n感谢您对《AI 全景通史》独立研创项目的慷慨支持！\n全量资源包包含了 7 大章节学术原论、系统二测试时算力推演模型源码及 4K 高清纪元图谱。\n\n如需加入 VIP 读者学术社群，请发送邮件至: sponsor@aichronicle.com`;
    triggerFileDownload(`AI_Chronicle_2026_Full_Bundle_${orderId}.md`, fullBundleContent);
  };

  const triggerFileDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedOrder(true);
    setTimeout(() => setCopiedOrder(false), 2000);
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

        {/* Header Navigation for Steps */}
        {step === 'checkout' && (
          <button
            onClick={() => setStep('details')}
            className="flex items-center space-x-1.5 text-xs font-mono text-stone-400 hover:text-amber-300 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回详情</span>
          </button>
        )}

        {/* Top Header Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 mb-2">
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span className="tracking-wider font-semibold">CANONICAL DIGITAL ASSET BUNDLE</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400 text-[11px]">数字化资产包</span>
        </div>

        <h3 className="text-2xl font-serif font-bold text-white mb-2">
          {step === 'checkout'
            ? '订单核销与资产包交付'
            : step === 'delivered'
            ? '🎉 交付成功！资产已开始下载'
            : currentLang === 'zh'
            ? '获取《2026 AGI 全景通史》完整数字化资产包'
            : 'Get The Complete 2026 AGI Chronicle Asset Pack'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6">
          {step === 'checkout'
            ? '请扫码赞助特惠金额，并在付款备注中填入您的专属订单号，输入邮箱即可秒级触发全量离线资产包下载。'
            : step === 'delivered'
            ? '全量资产包已自动触发浏览器下载，同时我们已将离线网盘备份凭据登记至系统。'
            : '专为高校研究团队、AI 算法工程师、科技博主与投资人打造的完整离线典藏版。包含全部高清矢量图谱、离线排版文档与仿真器源码。'}
        </p>

        {/* STEP 1: Details View */}
        {step === 'details' && (
          <>
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

            {/* Price & Checkout Trigger Box */}
            <div className="p-5 rounded-2xl bg-amber-500/[0.08] border border-amber-400/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                    onClick={() => setStep('checkout')}
                    className="liquid-glass-amber px-5 py-2 rounded-full text-xs font-mono font-bold text-amber-200 hover:text-white flex items-center space-x-1.5 transition-all shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>立即购买解锁</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[11px] font-mono text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>支持个人永久研读、团队内部培训演示及课件教学自由引用</span>
              </div>
            </div>
          </>
        )}

        {/* STEP 2: Checkout & Verification View */}
        {step === 'checkout' && (
          <form onSubmit={handleCompleteCheckout} className="space-y-5 animate-in fade-in duration-150">
            {/* Order Tag & Price Info */}
            <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">专属定单号:</span>
                <span className="text-amber-300 font-bold">{orderId}</span>
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="text-stone-400 hover:text-white p-0.5"
                  title="复制订单号"
                >
                  {copiedOrder ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-amber-200 font-bold">待付: ¥19.9 / $2.99</div>
            </div>

            {/* QR Code Container */}
            <div className="p-5 rounded-2xl liquid-glass border border-amber-400/30 flex flex-col items-center justify-center text-center">
              <div className="w-40 h-40 rounded-xl bg-white p-2 shadow-xl flex flex-col items-center justify-center border-2 border-amber-400/40 mb-3">
                <QrCode className="w-20 h-20 text-stone-900" />
                <span className="text-[10px] font-mono font-bold text-stone-800 mt-1">微信 / 支付宝 扫一扫</span>
                <span className="text-[9px] font-mono text-amber-700">备注定单号: {orderId}</span>
              </div>
              <p className="text-[11px] text-stone-300 font-mono">
                扫码赞助 ¥19.9（或海外通过 Stripe/PayPal 支付 $2.99）
              </p>
            </div>

            {/* Email verification input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-stone-300 block">
                接收下载凭据与更新通知的邮箱:
              </label>
              <input
                type="email"
                required
                placeholder="your.email@organization.com"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl liquid-glass-amber text-xs font-mono font-bold text-amber-200 hover:text-white transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>已扫码支付，立即下载全量离线资产包</span>
            </button>
          </form>
        )}

        {/* STEP 3: Delivered View */}
        {step === 'delivered' && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-serif font-bold text-white">
              已交付并下载典藏全量包
            </h4>

            <p className="text-xs text-stone-300 font-mono leading-relaxed max-w-md mx-auto">
              订单号: <span className="text-amber-300">{orderId}</span> · 绑定邮箱: <span className="text-amber-200">{buyerEmail}</span>
              <br />
              文件 <code className="text-white">AI_Chronicle_2026_Full_Bundle_{orderId}.md</code> 已直接传输至您的下载目录。
            </p>

            <div className="pt-2 flex justify-center space-x-3">
              <button
                onClick={() => setStep('details')}
                className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-mono text-stone-300 hover:text-white"
              >
                返回礼包详情
              </button>
              <button
                onClick={onClose}
                className="liquid-glass-amber px-5 py-2 rounded-full text-xs font-mono text-amber-200 hover:text-white"
              >
                完成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
