import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Check, Sparkles, FileText, ShieldCheck, X, ArrowDownToLine, Zap, Copy, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { ARTICLE_META, ARTICLE_CHAPTERS } from '../data/historyArticle';

interface PremiumBundleModalProps {
  onClose: () => void;
}

export const PremiumBundleModal: React.FC<PremiumBundleModalProps> = ({ onClose }) => {
  const { currentLang } = useLanguage();
  const isZh = currentLang === 'zh';

  const [step, setStep] = useState<'details' | 'checkout' | 'delivered'>('details');
  const [orderId] = useState<string>(() => `AC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copiedOrder, setCopiedOrder] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  const texts = {
    badge: isZh ? '离线长卷与学术典藏' : 'CANONICAL OFFLINE EDITION',
    subBadge: isZh ? 'Markdown 全文与引用附录' : 'Markdown Treatise & Citations',
    titleDetails: isZh
      ? '免费下载《2026 AGI 全景通史》离线长卷'
      : currentLang === 'es'
      ? 'Descargar Gratis la Edición Offline de la Crónica AGI 2026'
      : currentLang === 'de'
      ? 'KI-Chronik 2026 Offline-Ausgabe kostenlos herunterladen'
      : currentLang === 'fr'
      ? 'Télécharger Gratuitement l’Édition Hors Ligne de la Chronique AGI 2026'
      : 'Download the 2026 AGI Chronicle Offline Edition for Free',
    titleCheckout: isZh ? '免费下载' : 'Free Download',
    titleDelivered: isZh ? '🎉 已开始下载' : '🎉 Download Triggered',
    descDetails: isZh
      ? '完整收录 1.8 万字通史正文、BibTeX 引用附录与缩放定律公式附录的单一 Markdown 文件，供离线研读、归档与学术引用。'
      : 'A single Markdown file containing the full 18,000-word treatise, an embedded BibTeX citation appendix, and the scaling-law formula appendix.',
    descCheckout: isZh
      ? '点击下方按钮即可免费下载完整离线长卷（Markdown 单文件）。'
      : 'Click below to download the complete offline treatise as a single Markdown file, free of charge.',
    descDelivered: isZh
      ? '完整离线长卷已触发浏览器下载。'
      : 'The complete offline treatise has been dispatched to your browser download queue.',
    backBtn: isZh ? '返回详情' : 'Back to Details',
    priceBadge: isZh ? '研学离线包' : 'Offline Research Edition',
    priceLine: isZh ? '免费开放 · 无需支付' : 'Free · No payment required',
    sampleBtn: isZh ? '免费试读样章' : 'Free Sample Chapter',
    checkoutBtn: isZh ? '免费下载全卷' : 'Download for Free',
    licenseNote: isZh ? '支持个人永久研读、团队内部培训演示及教学自由引用' : 'Personal & academic perpetual license for presentations and teaching.',
    orderIdLabel: isZh ? '下载编号:' : 'Reference ID:',
    downloadNowBtn: isZh ? '免费下载完整离线长卷' : 'Download the Full Offline Treatise',
    sampleDownloadedAlert: isZh ? '样章已开始下载！' : 'Sample chapter downloading!',
    deliveredHeading: isZh ? '离线长卷已生成' : 'Offline Treatise Downloaded',
    deliveredSummary: (id: string) => isZh
      ? `下载编号: ${id}`
      : `Reference: ${id}`,
    finishBtn: isZh ? '完成' : 'Done',
    returnBtn: isZh ? '返回礼包详情' : 'Return to Details'
  };

  const bundleItems = [
    {
      title: isZh ? '《AI 全景通史》学术定本离线全集' : 'AI Chronicle Academic Treatise (Offline Edition)',
      format: 'Markdown (.md)',
      desc: isZh ? '1.8 万字纯文本、精校注释、7 大章节完整全文，含每章纪元洞见与文献出处标注。' : '18,000-word canonical treatise with per-chapter insights and source annotations.',
      icon: FileText,
    },
    {
      title: isZh ? 'LaTeX 学术引用附录' : 'LaTeX BibTeX Citation Appendix',
      format: '内嵌 BibTeX 代码块',
      desc: isZh ? '内嵌里程碑核心论文的规范 BibTeX 条目，可直接导入 Overleaf 与 Zotero。' : 'Standardized .bib entries for foundational AI milestone papers, ready for Overleaf & Zotero.',
      icon: Sparkles,
    },
    {
      title: isZh ? '双重缩放定律公式附录' : 'Dual Scaling Laws Formula Appendix',
      format: '附录',
      desc: isZh ? '测试时计算（Test-Time Compute）核心数学公式与参数说明，随文附赠。' : 'Core mathematical formulas and parameter notes for test-time compute scaling.',
      icon: Zap,
    },
  ];

  const handleDownloadSample = () => {
    const chapters = ARTICLE_CHAPTERS.slice(0, 2);
    let md = `# ${ARTICLE_META.title} · 【免费研读样章】\n`;
    md += `> ${ARTICLE_META.subtitle}\n\n`;
    md += `**出版版本**: ${ARTICLE_META.version} | **作者**: ${ARTICLE_META.author} | **样章编号**: ${orderId}\n\n`;
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

    md += `\n### 阅读后续 5 大章节完整内容\n访问完整通史交互门户: https://mumumumuyi.github.io/ai-chronicle-2026/\n`;
    triggerFileDownload(`AI_Chronicle_Sample_Chapter_${orderId}.md`, md);
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('delivered');

    let md = `# ${ARTICLE_META.title}\n`;
    md += `> ${ARTICLE_META.subtitle}\n\n`;
    md += `================================================================================\n`;
    md += `【离线长卷下载凭据 / OFFLINE EDITION DOWNLOAD REFERENCE】\n`;
    md += `下载编号: ${orderId}\n`;
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
                    <span className="text-2xl font-mono font-bold text-emerald-300">{isZh ? '免费' : 'Free'}</span>
                    <span className="text-xs text-stone-400">{texts.priceLine}</span>
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
              {texts.deliveredSummary(orderId)}
              <br />
              <code className="text-white text-[11px]">AI_Chronicle_2026_Full_Academic_Bundle_{orderId}.md</code>
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
