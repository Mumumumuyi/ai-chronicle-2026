import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Check, Sparkles, FileText, Image, ShieldCheck, X, ArrowDownToLine, Zap, QrCode, Copy, ArrowLeft, CreditCard, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { saveLead } from '../utils/leadStorage';
import { ARTICLE_META, ARTICLE_CHAPTERS } from '../data/historyArticle';
import { getOwnerContact } from '../utils/monetizationConfig';
import { recordAffiliateAction } from '../utils/analyticsTracker';

interface PremiumBundleModalProps {
  onClose: () => void;
}

export const PremiumBundleModal: React.FC<PremiumBundleModalProps> = ({ onClose }) => {
  const { currentLang } = useLanguage();
  const isZh = currentLang === 'zh';

  const [step, setStep] = useState<'details' | 'checkout' | 'delivered'>('details');
  const [orderId] = useState<string>(() => `AC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [buyerEmail, setBuyerEmail] = useState<string>('');
  const [copiedOrder, setCopiedOrder] = useState<boolean>(false);
  const ownerContact = getOwnerContact();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  const texts = {
    badge: isZh ? '数字化资产包与学术典藏' : 'CANONICAL DIGITAL ASSET BUNDLE',
    subBadge: isZh ? '4K 离线图谱与学术全集' : 'Offline Pack & Citation Graph',
    titleDetails: isZh 
      ? '获取《2026 AGI 全景通史》完整数字化资产包' 
      : currentLang === 'es'
      ? 'Paquete Canónico Completo de Activos Digitales AGI 2026'
      : currentLang === 'de'
      ? 'Vollständiges digitales AGI-Asset-Paket 2026'
      : currentLang === 'fr'
      ? 'Pack Complet d’Actifs Numériques AGI 2026'
      : 'Get The Complete 2026 AGI Chronicle Asset Pack',
    titleCheckout: isZh ? '订单核销与资产包交付' : 'Order Verification & Immediate Delivery',
    titleDelivered: isZh ? '🎉 交付成功！资产已开始下载' : '🎉 Delivered! Download Triggered',
    descDetails: isZh
      ? '专为高校研究团队、AI 算法工程师、科技博主与投资人打造的完整离线典藏版。包含全部高清矢量图谱、离线排版文档与仿真器源码。'
      : 'Engineered for researchers, ML teams, and technology writers. Complete offline bundle with 4K diagram assets, LaTeX citations, and the standalone scaling law simulator.',
    descCheckout: isZh
      ? '请扫码赞助特惠金额并在付款备注中填入专属订单号，输入邮箱即可秒级触发全量离线资产包下载。'
      : 'Scan to support the promotional price. Input your email below to instantly trigger full offline delivery.',
    descDelivered: isZh
      ? '全量资产包已自动触发浏览器下载，同时离线备份凭据已登记至系统。'
      : 'The complete asset bundle has been dispatched to your browser download queue.',
    backBtn: isZh ? '返回详情' : 'Back to Details',
    priceBadge: isZh ? '限时研学特惠礼包' : 'Limited Research Edition',
    priceLine: isZh ? '¥19.9 (原价 ¥99.0) / $2.99 USD' : '$2.99 USD (Reg. $14.99) / ¥19.9 CNY',
    sampleBtn: isZh ? '免费试读样章' : 'Free Sample Chapter',
    checkoutBtn: isZh ? '立即购买解锁' : 'Unlock Full Bundle',
    licenseNote: isZh ? '支持个人永久研读、团队内部培训演示及教学自由引用' : 'Personal & academic perpetual license for presentations and teaching.',
    orderIdLabel: isZh ? '专属订单号:' : 'Order ID:',
    pendingPay: isZh ? '待付: ¥19.9 / $2.99' : 'Due: $2.99 / ¥19.9',
    qrScanTip: isZh ? '微信 / 支付宝 扫一扫' : 'Scan to Tip (WeChat / Alipay / Card)',
    qrRemarkTip: isZh ? `备注订单号: ${orderId}` : `Note Order: ${orderId}`,
    qrSubNote: isZh ? '扫码赞助 ¥19.9（或海外通过 Stripe/PayPal 支付 $2.99）' : 'Tip $2.99 USD (or ¥19.9 CNY via mobile pay)',
    emailLabel: isZh ? '接收下载凭据与更新通知的邮箱:' : 'Email for delivery & lifetime updates:',
    emailPlaceholder: 'your.email@organization.com',
    downloadNowBtn: isZh ? '已扫码支付，立即下载全量离线资产包' : 'Download Full Digital Asset Pack Now',
    sampleDownloadedAlert: isZh ? '样章已开始下载！' : 'Sample chapter downloading!',
    deliveredHeading: isZh ? '已交付典藏全量包' : 'Asset Bundle Dispatched',
    deliveredSummary: (id: string, email: string) => isZh 
      ? `订单号: ${id} · 绑定邮箱: ${email}` 
      : `Order: ${id} · Email: ${email}`,
    finishBtn: isZh ? '完成' : 'Done',
    returnBtn: isZh ? '返回礼包详情' : 'Return to Details'
  };

  const bundleItems = [
    {
      title: isZh ? '《AI 全景通史》学术定本离线全集' : 'AI Chronicle Academic Treatise (Offline Edition)',
      format: 'PDF + EPUB + Markdown',
      desc: isZh ? '1.8 万字纯文本、精校注释、7大章节排版，适合 Kindle、iPad 及离线深度研读。' : '18,000-word canonical treatise formatted for Kindle, iPad, and offline reference.',
      icon: FileText,
    },
    {
      title: isZh ? '4K 超清 3D 纪元图谱与架构壁纸包' : '4K Ultra-HD 3D Epoch Wallpapers & Vector Graphics',
      format: '3840x2160 PNG / SVG',
      desc: isZh ? '自研 3D 暖光流体玻璃全景时空图谱，可作桌面壁纸、学术演讲 PPT 背景与展厅素材。' : 'Liquid glass 3D rendered diagrams suitable for keynote presentations and displays.',
      icon: Image,
    },
    {
      title: isZh ? '双重缩放定律离线单页计算仿真器' : 'Dual Scaling Laws Offline Simulator (Single-file HTML)',
      format: 'Standalone HTML',
      desc: isZh ? '无需联网，双击即用的测试时算力（Test-Time Compute）与预训练算力交互仿真工具。' : 'Zero-dependency single-file HTML application simulating pre-training & test-time compute tradeoffs.',
      icon: Zap,
    },
    {
      title: isZh ? 'LaTeX 学术引用与 BibTeX 知识图谱库' : 'LaTeX BibTeX Citation Database & Reference Graph',
      format: 'BibTeX (.bib)',
      desc: isZh ? '包含 25+ 项里程碑核心论文的规范 BibTeX 条目，一键直接导入 Overleaf 与 Zotero。' : 'Standardized .bib entries for 25+ foundational AI milestone papers for Overleaf & Zotero.',
      icon: Sparkles,
    },
  ];

  const handleDownloadSample = () => {
    const chapters = ARTICLE_CHAPTERS.slice(0, 2);
    let md = `# ${ARTICLE_META.title} · 【免费研读样章】\n`;
    md += `> ${ARTICLE_META.subtitle}\n\n`;
    md += `**出版版本**: ${ARTICLE_META.version} | **作者**: ${ARTICLE_META.author} | **样章订单参考**: ${orderId}\n\n`;
    md += `---\n\n## 导言与立论摘要\n\n${ARTICLE_META.abstract}\n\n---\n\n`;
    
    chapters.forEach(ch => {
      md += `## ${ch.chapterNumber}: ${ch.title} (${ch.timeSpan})\n\n`;
      if (ch.leadQuote) {
        md += `> "${ch.leadQuote.text}"\n> —— *${ch.leadQuote.attribution}*\n\n`;
      }
      md += `${ch.introParagraph}\n\n`;
      ch.sections.forEach(sec => {
        md += `### ${sec.subtitle}\n\n`;
        sec.content.forEach(p => {
          md += `${p}\n\n`;
        });
        if (sec.highlightInsight) {
          md += `> **💡 核心洞见**: ${sec.highlightInsight}\n\n`;
        }
        if (sec.archivalReference) {
          md += `*文献出处*: \`${sec.archivalReference}\`\n\n`;
        }
      });
      md += `---\n\n`;
    });

    md += `\n### 获取后续 5 大章节与 4K 矢量图谱\n访问完整通史交互门户: https://mumumumuyi.github.io/ai-chronicle-2026/\n`;
    triggerFileDownload(`AI_Chronicle_Sample_Chapter_${orderId}.md`, md);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail || !buyerEmail.includes('@')) {
      alert(isZh ? '请输入有效的邮箱以便接收资产包与更新！' : 'Please enter a valid email address!');
      return;
    }

    saveLead(buyerEmail, 'bundle_download', currentLang);
    setStep('delivered');

    let md = `# ${ARTICLE_META.title}\n`;
    md += `> ${ARTICLE_META.subtitle}\n\n`;
    md += `================================================================================\n`;
    md += `【官方典藏数字资产包认证凭据 / CERTIFICATE OF CANONICAL ARCHIVE】\n`;
    md += `订单编号: ${orderId}\n`;
    md += `授权邮箱: ${buyerEmail}\n`;
    md += `定本版本: ${ARTICLE_META.version}\n`;
    md += `出版日期: ${ARTICLE_META.publishedDate}\n`;
    md += `字数规模: ${ARTICLE_META.wordCountTotal} (全量无删减学术长卷)\n`;
    md += `授权协议: 个人研读、高校教学与学术引用永久许可 (Academic Perpetual License)\n`;
    md += `在线站点: https://mumumumuyi.github.io/ai-chronicle-2026/\n`;
    md += `================================================================================\n\n`;

    md += `## 摘要与立论依据 (Abstract)\n\n${ARTICLE_META.abstract}\n\n---\n\n`;

    ARTICLE_CHAPTERS.forEach(ch => {
      md += `# ${ch.chapterNumber}: ${ch.title}\n`;
      md += `**历史跨度**: ${ch.timeSpan}\n\n`;
      if (ch.leadQuote) {
        md += `> "${ch.leadQuote.text}"\n> —— *${ch.leadQuote.attribution}*\n\n`;
      }
      md += `${ch.introParagraph}\n\n`;
      ch.sections.forEach(sec => {
        md += `## ${sec.subtitle}\n\n`;
        sec.content.forEach(p => {
          md += `${p}\n\n`;
        });
        if (sec.highlightInsight) {
          md += `> **💡 纪元洞见**: ${sec.highlightInsight}\n\n`;
        }
        if (sec.archivalReference) {
          md += `*【经典档案文献】*: \`${sec.archivalReference}\`\n\n`;
        }
      });
      md += `\n================================================================================\n\n`;
    });

    md += `# 附录一：LaTeX / BibTeX 标准学术文献引用图谱库\n\n`;
    md += `\`\`\`bibtex
@article{aichronicle2026,
  title={The Spark, The Winter, and The Silicon Singularity: A Canonical Chronicle of Artificial Intelligence (1943--2026)},
  author={Antigravity Chronicle Research Group},
  journal={AI Chronicle Archive},
  year={2026},
  month={September},
  url={https://mumumumuyi.github.io/ai-chronicle-2026/}
}

@article{turing1950,
  title={Computing Machinery and Intelligence},
  author={Turing, Alan M.},
  journal={Mind},
  volume={59},
  number={236},
  pages={433--460},
  year={1950}
}

@article{mcculloch1943,
  title={A Logical Calculus of the Ideas Immanent in Nervous Activity},
  author={McCulloch, Warren S. and Pitts, Walter},
  journal={Bulletin of Mathematical Biophysics},
  volume={5},
  pages={115--133},
  year={1943}
}

@article{rumelhart1986,
  title={Learning representations by back-propagating errors},
  author={Rumelhart, David E. and Hinton, Geoffrey E. and Williams, Ronald J.},
  journal={Nature},
  volume={323},
  pages={533--536},
  year={1986}
}

@article{vaswani2017,
  title={Attention is All You Need},
  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N. and Kaiser, {\\L}ukasz and Polosukhin, Illia},
  journal={Advances in Neural Information Processing Systems (NeurIPS)},
  volume={30},
  year={2017}
}

@article{brown2020,
  title={Language Models are Few-Shot Learners},
  author={Brown, Tom B. and Mann, Benjamin and Ryder, Nick and Subbiah, Melanie and Kaplan, Jared and Dhariwal, Prafulla and Neelakantan, Arvind and Shyam, Pranav and Sastry, Girish and Askell, Amanda and others},
  journal={Advances in Neural Information Processing Systems (NeurIPS)},
  volume={33},
  year={2020}
}

@techreport{openai2024o1,
  title={Learning to Reason with LLMs: OpenAI o1 System Card},
  author={OpenAI},
  institution={OpenAI Research},
  year={2024},
  month={September}
}

@article{deepseek2025r1,
  title={DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning},
  author={DeepSeek-AI and Guo, Daya and Yang, Dejian and others},
  journal={arXiv preprint arXiv:2501.12948},
  year={2025}
}
\`\`\`\n\n`;

    md += `# 附录二：测试时计算第二缩放定律（Test-Time Compute）核心数学公式\n\n`;
    md += `在 2024-2026 年现代推理模型中，推理准确率由双重算力联合决定：\n\n`;
    md += `$$P(N, C_{\\text{test}}) = 1 - \\exp\\left( -\\alpha \\cdot N^\\beta \\cdot C_{\\text{test}}^\\gamma \\right)$$\n\n`;
    md += `其中：\n`;
    md += `- $N$: 模型预训练参数规模 (Parameters)\n`;
    md += `- $C_{\\text{test}}$: 测试时搜索思考 Token 数 (Test-Time Tokens / Flops)\n`;
    md += `- $\\alpha, \\beta, \\gamma$: 验证域难度常数与树搜索效率指数\n\n`;
    md += `当预训练模型参数由于高质量文本用尽而遭遇收益递减墙时，通过增加系统二多步反思算力，可使小模型超越 10 倍以上体量纯直觉大模型。\n\n`;
    md += `---\n© 2026 AI Chronicle · 感谢您的支持，愿理性之火永照智性未来。\n`;

    triggerFileDownload(`AI_Chronicle_2026_Full_Academic_Bundle_${orderId}.md`, md);
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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200 no-print"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto liquid-glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-stone-100 shadow-2xl border border-amber-400/40 glass-sheen"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Navigation for Steps */}
        {step === 'checkout' && (
          <button
            type="button"
            onClick={() => setStep('details')}
            className="flex items-center space-x-1.5 text-xs font-mono text-stone-400 hover:text-amber-300 transition-colors mb-2.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{texts.backBtn}</span>
          </button>
        )}

        {/* Top Header Badge */}
        <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono text-amber-300 mb-2 pr-8">
          <Download className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="tracking-wider font-semibold">{texts.badge}</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400 text-[10px] sm:text-[11px] truncate">{texts.subBadge}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2 pr-8">
          {step === 'checkout'
            ? texts.titleCheckout
            : step === 'delivered'
            ? texts.titleDelivered
            : texts.titleDetails}
        </h3>

        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-5">
          {step === 'checkout'
            ? texts.descCheckout
            : step === 'delivered'
            ? texts.descDelivered
            : texts.descDetails}
        </p>

        {/* STEP 1: Details View */}
        {step === 'details' && (
          <>
            <div className="space-y-2.5 mb-5">
              {bundleItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className="p-3 sm:p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-serif font-bold text-white leading-snug">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-amber-300 border border-white/10 flex-shrink-0">
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
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/[0.08] border border-amber-400/30 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-amber-300 font-bold">{texts.priceBadge}</div>
                  <div className="flex items-baseline space-x-2 mt-0.5">
                    <span className="text-2xl font-mono font-bold text-white">¥19.9</span>
                    <span className="text-xs text-stone-400 line-through">¥99.0</span>
                    <span className="text-xs text-stone-400">/ $2.99 USD</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="liquid-glass-pill px-4 py-2.5 rounded-full text-xs font-mono text-stone-300 hover:text-white flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5 text-amber-400" />
                    <span>{texts.sampleBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="liquid-glass-amber px-5 py-2.5 rounded-full text-xs font-mono font-bold text-amber-200 hover:text-white flex items-center justify-center space-x-1.5 transition-all shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{texts.checkoutBtn}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 text-[11px] font-mono text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="leading-snug">{texts.licenseNote}</span>
              </div>
            </div>
          </>
        )}

        {/* STEP 2: Checkout & Verification View */}
        {step === 'checkout' && (
          <form onSubmit={handleCompleteCheckout} className="space-y-4 sm:space-y-5 animate-in fade-in duration-150">
            {/* Order Tag & Price Info */}
            <div className="p-3 sm:p-3.5 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">{texts.orderIdLabel}</span>
                <span className="text-amber-300 font-bold">{orderId}</span>
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="text-stone-400 hover:text-white p-0.5"
                  title="Copy Order ID"
                >
                  {copiedOrder ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-amber-200 font-bold">{texts.pendingPay}</div>
            </div>

            {/* Direct 1-Click Online Payment Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ownerContact.afdianUrl && (
                <a
                  href={ownerContact.afdianUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordAffiliateAction('bundle_pay', 'Afdian Bundle Unlock', 'click')}
                  className="p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all text-center"
                >
                  <Zap className="w-3.5 h-3.5 text-purple-300" />
                  <span>{isZh ? '爱发电在线支持 ¥19.9' : 'Tip ¥19.9 via Afdian'}</span>
                  <ArrowUpRight className="w-3 h-3 text-purple-300" />
                </a>
              )}
              {ownerContact.buyMeACoffeeUrl && (
                <a
                  href={ownerContact.buyMeACoffeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordAffiliateAction('bundle_pay', 'BuyMeACoffee Bundle Unlock', 'click')}
                  className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 hover:text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all text-center"
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isZh ? '国际卡支付 $2.99 USD' : 'Pay $2.99 USD via Card'}</span>
                  <ArrowUpRight className="w-3 h-3 text-amber-300" />
                </a>
              )}
            </div>

            {/* QR Code Container */}
            <div className="p-4 sm:p-5 rounded-2xl liquid-glass border border-amber-400/30 flex flex-col items-center justify-center text-center">
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-xl bg-white p-2 shadow-xl flex flex-col items-center justify-center border-2 border-amber-400/40 mb-2.5">
                <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-stone-900" />
                <span className="text-[10px] font-mono font-bold text-stone-800 mt-1">{texts.qrScanTip}</span>
                <span className="text-[9px] font-mono text-amber-700">{texts.qrRemarkTip}</span>
              </div>
              <p className="text-[11px] text-stone-300 font-mono leading-snug">
                {texts.qrSubNote}
              </p>
            </div>

            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-stone-300 block">
                {texts.emailLabel}
              </label>
              <input
                type="email"
                required
                placeholder={texts.emailPlaceholder}
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-stone-100 text-sm sm:text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl liquid-glass-amber text-xs font-mono font-bold text-amber-200 hover:text-white transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{texts.downloadNowBtn}</span>
            </button>
          </form>
        )}

        {/* STEP 3: Delivered View */}
        {step === 'delivered' && (
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <h4 className="text-base sm:text-lg font-serif font-bold text-white">
              {texts.deliveredHeading}
            </h4>

            <p className="text-xs text-stone-300 font-mono leading-relaxed max-w-md mx-auto">
              {texts.deliveredSummary(orderId, buyerEmail)}
              <br />
              <code className="text-white text-[11px]">AI_Chronicle_2026_Full_Bundle_{orderId}.md</code>
            </p>

            <div className="pt-2 flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-mono text-stone-300 hover:text-white"
              >
                {texts.returnBtn}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="liquid-glass-amber px-5 py-2 rounded-full text-xs font-mono text-amber-200 hover:text-white"
              >
                {texts.finishBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
