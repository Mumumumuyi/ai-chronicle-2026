import React, { useState, useMemo, useEffect } from 'react';
import { RotateCcw, GitBranch, Activity, Server, Cpu, ArrowUpRight, Copy, Check, Tag } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getMonetizationPartners, MonetizationPartner } from '../utils/monetizationConfig';
import { recordAffiliateAction } from '../utils/analyticsTracker';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const LiquidParadigmWidget: React.FC = () => {
  const { currentLang } = useLanguage();
  const [activeParadigm, setActiveParadigm] = useState<'symbolism' | 'connectionism' | 'agentic2026'>('agentic2026');
  const [thinkingTokens, setThinkingTokens] = useState<number>(4096);
  const [modelSize, setModelSize] = useState<number>(70);
  const [partners, setPartners] = useState<MonetizationPartner[]>([]);
  const [copiedPartnerId, setCopiedPartnerId] = useState<string | null>(null);
  const revealRef = useScrollReveal<HTMLDivElement>([currentLang]);

  const isZh = currentLang === 'zh';

  useEffect(() => {
    setPartners(getMonetizationPartners());
  }, []);

  const runpodPartner = partners.find(p => p.id === 'runpod') || {
    id: 'runpod',
    name: 'RunPod Cloud GPUs',
    affiliateUrl: 'https://runpod.io',
    officialFallbackUrl: 'https://runpod.io',
    promoCode: '',
    perkBadgeZh: '按秒计费 GPU 容器',
    perkBadgeEn: 'Per-second billing',
  };

  const autodlPartner = partners.find(p => p.id === 'autodl') || {
    id: 'autodl',
    name: 'AutoDL 算力云 (国内首选)',
    affiliateUrl: 'https://www.autodl.com',
    officialFallbackUrl: 'https://www.autodl.com',
    promoCode: '',
    perkBadgeZh: '国内低延迟算力云',
    perkBadgeEn: 'China-local GPU cloud',
  };

  const togetherPartner = partners.find(p => p.id === 'together') || {
    id: 'together',
    name: 'Together.ai API',
    affiliateUrl: 'https://together.ai',
    officialFallbackUrl: 'https://together.ai',
    perkBadgeZh: '开源模型 Serverless API',
    perkBadgeEn: 'Serverless inference',
  };

  const lambdaPartner = partners.find(p => p.id === 'lambdalabs') || {
    id: 'lambdalabs',
    name: 'Lambda Labs GPU Cloud',
    affiliateUrl: 'https://lambdalabs.com/service/gpu-cloud',
    officialFallbackUrl: 'https://lambdalabs.com/service/gpu-cloud',
    perkBadgeZh: 'H100 裸金属集群',
    perkBadgeEn: 'Bare-metal clusters',
  };

  const handlePartnerClick = (partner: { id: string; name: string; affiliateUrl?: string; officialFallbackUrl?: string }) => {
    recordAffiliateAction(partner.id, partner.name, 'click');
  };

  const handleCopyPromo = (code: string, partner: { id: string; name: string }) => {
    navigator.clipboard.writeText(code);
    setCopiedPartnerId(partner.id);
    recordAffiliateAction(partner.id, partner.name, 'promo_copy');
    setTimeout(() => setCopiedPartnerId(null), 2000);
  };

  // Hardware provisioning estimates
  const hardwareRec = useMemo(() => {
    if (modelSize <= 14) {
      return {
        vramFp16: `${modelSize * 2} GB`,
        vramInt4: `${Math.round(modelSize * 0.75)} GB`,
        gpuName: '1x NVIDIA RTX 4090 (24GB)',
        descZh: '单卡消费级旗舰即可跑满，适合个人微调与量化推理',
        descEn: 'Single consumer flagship card, ideal for local fine-tuning',
        autoDlCost: '约 ¥1.8/小时',
        runpodCost: '$0.44/hr',
      };
    } else if (modelSize <= 72) {
      return {
        vramFp16: `${modelSize * 2} GB`,
        vramInt4: `${Math.round(modelSize * 0.75)} GB`,
        gpuName: '2x ~ 4x A100 / RTX 4090 集群',
        descZh: '中型前沿模型标准配置，支持长上下文与多步树搜索',
        descEn: 'Multi-GPU cluster for reasoning search & long context',
        autoDlCost: '约 ¥7.5/小时 (2卡)',
        runpodCost: '$1.76/hr (4x 4090)',
      };
    } else {
      return {
        vramFp16: `${modelSize * 2} GB`,
        vramInt4: `${Math.round(modelSize * 0.75)} GB`,
        gpuName: '8x H100 80GB SXM5 张量并行集群',
        descZh: '千亿级旗舰模型全精度运行，企业与实验室科研顶配',
        descEn: '8x H100 80GB cluster for 405B dense inference',
        autoDlCost: '需专属裸金属算力节点',
        runpodCost: '$19.9/hr (8x H100)',
      };
    }
  }, [modelSize]);

  // Compute test-time scaling metrics
  const scalingStats = useMemo(() => {
    // Base intuition accuracy
    const baseAcc = Math.round(Math.min(85, Math.max(15, Math.log10(modelSize) * 25 + 10)));
    // Test-time compute bonus (System 2 search)
    const bonus = Math.round(Math.log2(Math.max(64, thinkingTokens) / 64) * 5.8);
    const totalAcc = Math.min(98, baseAcc + bonus);
    const latencySec = (0.2 + (thinkingTokens / 1200)).toFixed(1);

    // Dynamic benchmark projections
    const math500 = Math.min(96, Math.round(baseAcc * 0.8 + bonus * 1.2));
    const sweBench = Math.min(78, Math.round(baseAcc * 0.55 + bonus * 0.95));
    const gpqa = Math.min(82, Math.round(baseAcc * 0.65 + bonus * 1.05));

    // Dynamic tree parameters
    const treeDepth = Math.min(6, Math.max(1, Math.round(Math.log2(Math.max(64, thinkingTokens) / 64))));
    const treeNodes = Math.min(32, Math.max(1, Math.round(thinkingTokens / 512)));

    return {
      baseAcc,
      totalAcc,
      gain: totalAcc - baseAcc,
      latencySec,
      math500,
      sweBench,
      gpqa,
      treeDepth,
      treeNodes,
    };
  }, [modelSize, thinkingTokens]);

  const paradigmCards = isZh ? [
    {
      id: 'symbolism' as const,
      name: '符号主义 (1956)',
      title: '逻辑公理与显式规则',
      quote: '“智能即离散符号的形式演算与启发式搜索。”',
      feat: '代表：逻辑理论家、专家系统 (MYCIN)、深蓝国际象棋',
      flaw: '软肋：常识获取瓶颈、组合爆炸、现实噪声易脆断',
    },
    {
      id: 'connectionism' as const,
      name: '连接主义 (1986)',
      title: '神经元权重与分布式表征',
      quote: '“模式蕴含在千亿突触的连续流形与梯度自组织中。”',
      feat: '代表：感知机、反向传播 (BP)、CNN、Transformer',
      flaw: '软肋：黑盒不可解释、需要海量数据、容易出现概率幻觉',
    },
    {
      id: 'agentic2026' as const,
      name: '自主智能体 (2026.09)',
      title: '神经符号收敛与系统二慢思考',
      quote: '“直觉生成假设，测试时搜索求证，真实环境闭环仲裁。”',
      feat: '代表：o1/R1 思维链树搜索、Runtime Loop、Lean 4 定理证明',
      flaw: '使命：人机共生安全对齐、多轮执行自省与物理具身扩展',
    },
  ] : [
    {
      id: 'symbolism' as const,
      name: 'Symbolism (1956)',
      title: 'Formal Logic & Explicit Axioms',
      quote: '"Intelligence is the formal manipulation and heuristic search of discrete symbols."',
      feat: 'Milestones: Logic Theorist, MYCIN Expert Systems, Deep Blue',
      flaw: 'Bottleneck: Knowledge acquisition bottleneck & combinatorial explosion',
    },
    {
      id: 'connectionism' as const,
      name: 'Connectionism (1986)',
      title: 'Neural Weights & Continuous Manifolds',
      quote: '"Patterns emerge within continuous manifolds of billions of synapses."',
      feat: 'Milestones: Perceptron, Backpropagation, CNNs, Transformers',
      flaw: 'Bottleneck: Black-box uninterpretability & statistical hallucinations',
    },
    {
      id: 'agentic2026' as const,
      name: 'Autonomous Agents (2026.09)',
      title: 'Neuro-Symbolic Convergence & System 2',
      quote: '"Intuition hypothesizes, test-time tree search proves, runtime loops arbitrate."',
      feat: 'Milestones: o1/R1 Reasoning Chains, Runtime Loops, Lean 4 proofs',
      flaw: 'Frontier: Symbiotic safety alignment, multi-turn runtime self-repair',
    },
  ];

  return (
    <div ref={revealRef} className="bg-ob max-w-6xl mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-24 space-y-14">
      {/* Section Header */}
      <div className="rv max-w-2xl space-y-4">
        <p className="eyebrow on-dark">
          <i />
          {isZh ? '范式演变与测试时计算实验室' : 'Paradigm & Scaling Matrix'}
        </p>
        <h2 className="text-3xl sm:text-5xl font-serif font-medium text-pearl tracking-[-0.01em] leading-[1.15]">
          {isZh ? '缩放定律实验室' : 'The Dual Scaling Law Laboratory'}
        </h2>
        <p className="text-sm text-[#A8A29E] leading-[1.9]">
          {isZh
            ? '从符号逻辑的规则孤岛，到 2024-2026 年慢思考强化学习（Test-Time Compute）第二缩放定律的优雅跃迁。'
            : 'From isolated symbolic rules to the empirical second scaling law of test-time inference compute (2024-2026).'}
        </p>
      </div>

      {/* Part 1: Paradigm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#292524] border border-[#292524]">
        {paradigmCards.map((card) => {
          const isSelected = activeParadigm === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveParadigm(card.id)}
              className={`rv text-left p-6 transition-colors duration-300 ${
                isSelected ? 'bg-ob2' : 'bg-ob hover:bg-ob2'
              }`}
            >
              <div className="flex items-center justify-between mono mb-3">
                <span className={isSelected ? 'text-gold' : 'text-[#78716C]'}>
                  {card.name}
                </span>
                <span className={`w-2 h-2 border transition-colors ${isSelected ? 'bg-gold border-gold' : 'border-[#44403C]'}`} />
              </div>

              <h3 className="text-lg font-serif font-medium text-pearl mb-3">
                {card.title}
              </h3>

              <p className="text-xs font-serif text-[#A8A29E] mb-4 leading-relaxed">
                {card.quote}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-[#292524] mono text-[#78716C]">
                <div className="text-[#D6D3D1]">{card.feat}</div>
                <div className="text-gold2/80">{card.flaw}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Part 2: Test-Time Scaling Simulator */}
      <div className="rv panel-dark p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-7 border-b border-[#292524] gap-3">
          <div>
            <p className="eyebrow on-dark mb-2">
              <i />
              {isZh ? '测试时计算（Test-Time Compute）第二缩放定律推演仪' : 'Test-Time Compute (System 2) Scaling Simulator'}
            </p>
            <p className="mono text-[#78716C]">
              {isZh
                ? '验证：给模型更多思考 Token 与树搜索分支，在复杂难题上性能平滑飞跃'
                : 'Scaling Law: Allocating more search tokens yields exponential gains on complex reasoning benchmarks'}
            </p>
          </div>
          <button
            onClick={() => { setModelSize(70); setThinkingTokens(4096); }}
            className="btn-ghost self-start sm:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isZh ? '重置' : 'Reset'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Slider Controls */}
          <div className="lg:col-span-6 space-y-7">
            {/* Thinking Tokens Slider */}
            <div>
              <div className="flex justify-between mono mb-3">
                <span className="text-[#A8A29E]">
                  {isZh ? '思考 Token 预算 (Thinking Tokens):' : 'Thinking Tokens Budget:'}
                </span>
                <span className="text-gold font-mono text-sm">
                  {thinkingTokens.toLocaleString()} Tokens
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="16384"
                step="256"
                value={thinkingTokens}
                onChange={(e) => setThinkingTokens(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer h-1.5 bg-[#292524] rounded-full"
              />
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[
                  { label: isZh ? '0 (直觉)' : '0 (Fast)', val: 0 },
                  { label: isZh ? '1K (轻度)' : '1K (Light)', val: 1024 },
                  { label: isZh ? '4K (标准自省)' : '4K (Std)', val: 4096 },
                  { label: isZh ? '8K (深度推理)' : '8K (Deep)', val: 8192 },
                  { label: isZh ? '16K (树搜索极值)' : '16K (Max Tree)', val: 16384 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setThinkingTokens(item.val)}
                    className={`px-2.5 py-1 mono transition-colors border ${
                      thinkingTokens === item.val
                        ? 'border-gold text-gold bg-[rgba(201,168,106,0.08)]'
                        : 'border-[#44403C] text-[#78716C] hover:text-pearl hover:border-[#78716C]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Base Model Parameters Slider */}
            <div>
              <div className="flex justify-between mono mb-3">
                <span className="text-[#A8A29E]">
                  {isZh ? '预训练基座规模 (Base Parameters):' : 'Base Model Parameters:'}
                </span>
                <span className="text-gold font-mono text-sm">{modelSize}B {isZh ? '参数' : 'Params'}</span>
              </div>
              <input
                type="range"
                min="7"
                max="405"
                step="1"
                value={modelSize}
                onChange={(e) => setModelSize(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer h-1.5 bg-[#292524] rounded-full"
              />
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {[
                  { label: isZh ? '7B (端侧微型)' : '7B (Edge)', val: 7 },
                  { label: isZh ? '14B (桌面主力)' : '14B (Desktop)', val: 14 },
                  { label: isZh ? '70B (工业基准)' : '70B (Industry)', val: 70 },
                  { label: isZh ? '236B (混合专家)' : '236B (MoE)', val: 236 },
                  { label: isZh ? '405B (前沿顶峰)' : '405B (Frontier)', val: 405 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setModelSize(item.val)}
                    className={`px-2.5 py-1 mono transition-colors border ${
                      modelSize === item.val
                        ? 'border-gold text-gold bg-[rgba(201,168,106,0.08)]'
                        : 'border-[#44403C] text-[#78716C] hover:text-pearl hover:border-[#78716C]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic System 2 Search Tree Visualizer */}
            <div className="panel-dark-2 p-4 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gold">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{isZh ? '测试时思维链树展开模拟' : 'Test-Time Search Tree Visualizer'}</span>
                </span>
                <span className="mono px-2 py-0.5 border border-[#44403C] text-[#78716C]">
                  {isZh ? `搜索深度: ${scalingStats.treeDepth} 级` : `Depth: ${scalingStats.treeDepth}`}
                </span>
              </div>

              {/* Branching Node Visual */}
              <div className="h-16 flex items-center justify-between px-3 bg-black/40 border border-[#292524] relative overflow-hidden">
                {/* Root node */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-gold flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-ob" />
                  </div>
                  <span className="text-[8px] text-gold mt-1">Root</span>
                </div>

                {/* Connecting Search Beam */}
                <div className="flex-1 h-px mx-2 bg-[#44403C] relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-gold transition-all duration-300"
                    style={{ width: `${Math.min(100, (thinkingTokens / 16384) * 100)}%` }}
                  />
                </div>

                {/* Search Exploration Nodes */}
                <div className="flex items-center gap-2 z-10">
                  {Array.from({ length: Math.min(5, scalingStats.treeDepth) }).map((_, nIdx) => (
                    <div key={nIdx} className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full transition-all duration-300 flex items-center justify-center bg-gold/80">
                        <span className="w-1 h-1 rounded-full bg-ob" />
                      </div>
                      <span className="text-[8px] text-[#78716C] mt-1">D{nIdx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-[#78716C]">
                <span>{isZh ? `已探索思考节点: ~${scalingStats.treeNodes * 128} 状态` : `Explored States: ~${scalingStats.treeNodes * 128}`}</span>
                <span className="text-gold">{isZh ? `搜索耗时: ~${scalingStats.latencySec}s` : `Latency: ~${scalingStats.latencySec}s`}</span>
              </div>
            </div>
          </div>

          {/* Real-time Meter Panel */}
          <div className="lg:col-span-6 panel-dark-2 p-5 sm:p-6 font-mono">
            <div className="flex justify-between items-center text-xs mb-5 pb-3 border-b border-[#292524]">
              <span className="mono text-pearl">
                {isZh ? '前沿基准能力投射 (Benchmark Projections)' : 'Reasoning Benchmark Projections'}
              </span>
              <span className="mono px-2 py-0.5 border border-[rgba(201,168,106,0.4)] text-gold flex items-center gap-1">
                <Activity className="w-2.5 h-2.5" />
                <span>{isZh ? '模型推演' : 'SIMULATED'}</span>
              </span>
            </div>

            <div className="space-y-5">
              {[
                { label: 'MATH-500 (竞赛数学):', val: scalingStats.math500 },
                { label: 'SWE-bench Verified (真实代码仓库解决率):', val: scalingStats.sweBench },
                { label: 'GPQA Diamond (博士级高难科学推理):', val: scalingStats.gpqa },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#A8A29E]">{b.label}</span>
                    <span className="text-gold font-semibold">{b.val}%</span>
                  </div>
                  <div className="w-full bg-black/40 h-1.5 overflow-hidden border border-[#292524]">
                    <div
                      className="bg-gold h-full transition-all duration-500"
                      style={{ width: `${b.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Intuition vs Search Delta */}
            <div className="mt-7 pt-4 border-t border-[#292524] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#78716C]">
                <span>{isZh ? '系统一前向直觉准确率:' : 'System 1 Instinct Acc:'}</span>
                <span className="text-pearl">{scalingStats.baseAcc}%</span>
              </div>
              <div className="flex justify-between text-gold font-semibold">
                <span className="flex items-center">
                  {isZh ? '系统二测试时搜索净增益:' : 'System 2 Test-Time Delta:'}
                </span>
                <span>+{scalingStats.gain}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Provisioning & 1-Click Replication */}
      <div className="rv panel-dark p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-7 pb-6 border-b border-[#292524]">
          <div>
            <p className="eyebrow on-dark mb-2">
              <i />
              {isZh ? '算力实机部署与一键复现' : 'Compute Provisioning · 1-Click Deploy'}
            </p>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-pearl">
              {isZh ? `${modelSize}B 模型实机复现算力配置与一键起机` : `Hardware Provisioning & 1-Click Deploy for ${modelSize}B Model`}
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A29E] mt-2 max-w-2xl leading-relaxed">
              {isZh
                ? '根据您在上方设定的模型参数量与测试时思考长度，动态推算最低与最优显存。直达认证算力云，领取开发者专属算力礼包。'
                : 'Dynamically calculated VRAM footprint and recommended compute nodes based on your model size and search horizon.'}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto border border-[rgba(201,168,106,0.35)] px-4 py-3 flex-shrink-0">
            <Cpu className="w-4 h-4 text-gold flex-shrink-0" />
            <div className="text-xs font-mono">
              <span className="text-[#78716C] block text-[10px] uppercase tracking-wider">{isZh ? '推荐硬件规格' : 'Recommended Spec'}</span>
              <span className="text-gold2 font-semibold">{hardwareRec.gpuName}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Spec Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#292524] border border-[#292524] mb-6">
          {[
            { label: isZh ? 'FP16 权重显存' : 'FP16 VRAM', val: hardwareRec.vramFp16, sub: isZh ? '不含 KV Cache 冗余' : 'Raw weight space' },
            { label: isZh ? 'INT4 量化最低显存' : 'INT4 Quant VRAM', val: hardwareRec.vramInt4, sub: isZh ? 'AWQ / GPTQ 压缩' : 'AWQ / GPTQ footprint' },
            { label: isZh ? '国内 AutoDL 参考单价' : 'AutoDL Est. Cost', val: hardwareRec.autoDlCost, sub: isZh ? '支持微信/支付宝按时计费' : 'Hourly billing' },
            { label: isZh ? '全球 RunPod 参考单价' : 'RunPod Est. Cost', val: hardwareRec.runpodCost, sub: isZh ? '按秒计费 · 即开即停' : 'Per-second billing' },
          ].map((s) => (
            <div key={s.label} className="bg-ob p-4">
              <span className="mono text-[#78716C] block">{s.label}</span>
              <span className="text-sm sm:text-base font-mono font-semibold text-gold2 mt-1.5 block">{s.val}</span>
              <span className="text-[10px] text-[#57534E] mt-1 block">{s.sub}</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-[#A8A29E] mb-7 py-3 border-y border-[#292524] flex items-center gap-2">
          <Activity className="w-4 h-4 text-gold flex-shrink-0" />
          <span>{isZh ? hardwareRec.descZh : hardwareRec.descEn}</span>
        </div>

        {/* Dual Provider Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#292524] border border-[#292524]">
          {/* Provider 1: AutoDL */}
          <div className="bg-ob2 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="font-semibold text-pearl text-sm font-mono">{autodlPartner.name}</span>
                <span className="mono px-2 py-0.5 border border-[#44403C] text-gold flex-shrink-0">
                  {isZh ? autodlPartner.perkBadgeZh : autodlPartner.perkBadgeEn}
                </span>
              </div>
              <p className="text-xs text-[#A8A29E] leading-relaxed mb-4">
                {isZh
                  ? '国内极速低延迟网络，预装 PyTorch、vLLM、Ollama 等常用大模型镜像与中文网盘加速通道，高校与个人首选。'
                  : 'Leading domestic GPU cloud for researchers with pre-configured weights and localized bandwidth.'}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#292524]">
              {autodlPartner.promoCode && (
                <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 border border-[#292524] text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#78716C]">
                    <Tag className="w-3 h-3 text-gold" />
                    <span>{isZh ? '新人立减码:' : 'Promo Code:'}</span>
                    <span className="text-pearl font-semibold">{autodlPartner.promoCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyPromo(autodlPartner.promoCode!, autodlPartner)}
                    className="text-gold hover:text-gold2 flex items-center gap-1 text-[11px]"
                  >
                    {copiedPartnerId === autodlPartner.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>{isZh ? '已复制' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{isZh ? '复制' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <a
                href={autodlPartner.affiliateUrl || autodlPartner.officialFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handlePartnerClick(autodlPartner)}
                className="w-full py-2.5 px-4 border border-[rgba(201,168,106,0.35)] text-gold2 hover:bg-gold hover:text-ob hover:border-gold font-mono text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{isZh ? '前往 AutoDL 一键起机开跑' : 'Launch on AutoDL Cloud'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Provider 2: RunPod */}
          <div className="bg-ob2 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="font-semibold text-pearl text-sm font-mono">{runpodPartner.name}</span>
                <span className="mono px-2 py-0.5 border border-[#44403C] text-gold flex-shrink-0">
                  {isZh ? runpodPartner.perkBadgeZh : runpodPartner.perkBadgeEn}
                </span>
              </div>
              <p className="text-xs text-[#A8A29E] leading-relaxed mb-4">
                {isZh
                  ? '全球顶级高性价比算力，提供 H100、A100、L40S 与 RTX 4090 裸金属容器，按秒计费，支持海外信用卡与加密结算。'
                  : 'Global hyperscale GPU instances with per-second billing, spot instances, and instant vLLM/PyTorch deployments.'}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#292524]">
              {runpodPartner.promoCode && (
                <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 border border-[#292524] text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[#78716C]">
                    <Tag className="w-3 h-3 text-gold" />
                    <span>{isZh ? '专属返利码:' : 'Promo Code:'}</span>
                    <span className="text-pearl font-semibold">{runpodPartner.promoCode}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyPromo(runpodPartner.promoCode!, runpodPartner)}
                    className="text-gold hover:text-gold2 flex items-center gap-1 text-[11px]"
                  >
                    {copiedPartnerId === runpodPartner.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>{isZh ? '已复制' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{isZh ? '复制' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <a
                href={runpodPartner.affiliateUrl || runpodPartner.officialFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handlePartnerClick(runpodPartner)}
                className="w-full py-2.5 px-4 border border-[rgba(201,168,106,0.35)] text-gold2 hover:bg-gold hover:text-ob hover:border-gold font-mono text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>{isZh ? '前往 RunPod 拉起算力' : 'Deploy on RunPod'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Supplementary Channels */}
        <div className="mt-6 pt-5 border-t border-[#292524] flex flex-wrap items-center justify-between gap-3">
          <span className="mono text-[#57534E]">
            {isZh ? '更多极速推演与集群选型通道：' : 'Additional inference & bare-metal channels:'}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={togetherPartner.affiliateUrl || togetherPartner.officialFallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handlePartnerClick(togetherPartner as MonetizationPartner)}
              className="mono px-3 py-1.5 border border-[#44403C] text-[#A8A29E] hover:text-gold2 hover:border-gold flex items-center gap-1.5 transition-all"
            >
              <span>Together.ai ({isZh ? togetherPartner.perkBadgeZh : togetherPartner.perkBadgeEn})</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href={lambdaPartner.affiliateUrl || lambdaPartner.officialFallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handlePartnerClick(lambdaPartner as MonetizationPartner)}
              className="mono px-3 py-1.5 border border-[#44403C] text-[#A8A29E] hover:text-gold2 hover:border-gold flex items-center gap-1.5 transition-all"
            >
              <Server className="w-3 h-3" />
              <span>Lambda Labs ({isZh ? lambdaPartner.perkBadgeZh : lambdaPartner.perkBadgeEn})</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Affiliate Transparency Footer */}
        <p className="mono text-[#57534E] text-center mt-6 pt-4 border-t border-[#292524]">
          {isZh
            ? '算力生态合作说明：本站所推荐算力通道均经实测验证，点击通道注册即可享受对应折扣优惠；收益全数用于通史开源与独立维护。'
            : 'Affiliate Transparency: Verified GPU partner links provide discount perks. Commissions support our independent AI research.'}
        </p>
      </div>

      {/* Part 3: Paradigm Matrix Deep Comparison */}
      <div className="rv panel-dark p-6 sm:p-8 overflow-x-auto">
        <p className="eyebrow on-dark mb-5">
          <i />
          {isZh ? '三大 AI 范式横向对比矩阵 (1943 - 2026)' : 'AI Paradigm Comparison Matrix'}
        </p>
        <table className="w-full text-left text-xs font-mono border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[#44403C] text-[#78716C]">
              <th className="py-3 px-3 font-normal mono">{isZh ? '对比维度' : 'Dimension'}</th>
              <th className="py-3 px-3 font-normal mono text-gold2">{isZh ? '符号主义 (1956)' : 'Symbolism (1956)'}</th>
              <th className="py-3 px-3 font-normal mono text-gold2">{isZh ? '连接主义 (1986)' : 'Connectionism (1986)'}</th>
              <th className="py-3 px-3 mono text-gold bg-[rgba(201,168,106,0.07)]">
                {isZh ? '自主智能体 (2026.09)' : 'Autonomous Agents (2026.09)'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#292524] text-[#A8A29E]">
            <tr>
              <td className="py-3 px-3 text-[#78716C]">{isZh ? '核心表征' : 'Representation'}</td>
              <td className="py-3 px-3">{isZh ? '离散符号、谓词公理' : 'Discrete symbols'}</td>
              <td className="py-3 px-3">{isZh ? '连续稠密向量、流形' : 'Dense continuous vectors'}</td>
              <td className="py-3 px-3 text-gold2 bg-[rgba(201,168,106,0.05)]">{isZh ? '神经直觉 + 离散检验/树搜索' : 'Neuro-symbolic search trees'}</td>
            </tr>
            <tr>
              <td className="py-3 px-3 text-[#78716C]">{isZh ? '知识获取' : 'Acquisition'}</td>
              <td className="py-3 px-3">{isZh ? '专家手工形式化编码' : 'Manual expert rules'}</td>
              <td className="py-3 px-3">{isZh ? '海量互联网文本梯度自监督' : 'Large-scale self-supervision'}</td>
              <td className="py-3 px-3 text-gold2 bg-[rgba(201,168,106,0.05)]">{isZh ? '环境自闭环强化学习 + 慢思考自省' : 'RL on verifiable environments'}</td>
            </tr>
            <tr>
              <td className="py-3 px-3 text-[#78716C]">{isZh ? '推理机制' : 'Reasoning'}</td>
              <td className="py-3 px-3">{isZh ? '形式推导、归结消解' : 'Strict deductive deduction'}</td>
              <td className="py-3 px-3">{isZh ? '单向前向传播 (System 1)' : 'Forward pass (System 1)'}</td>
              <td className="py-3 px-3 text-gold2 bg-[rgba(201,168,106,0.05)]">{isZh ? '测试时动态多步自反思 (System 2)' : 'Runtime test-time search (System 2)'}</td>
            </tr>
            <tr>
              <td className="py-3 px-3 text-[#78716C]">{isZh ? '致命软肋' : 'Key Flaw'}</td>
              <td className="py-3 px-3">{isZh ? '常识获取瓶颈、组合爆炸' : 'Combinatorial explosion'}</td>
              <td className="py-3 px-3">{isZh ? '概率幻觉、黑盒不可溯' : 'Hallucination & lack of rigor'}</td>
              <td className="py-3 px-3 text-gold2 bg-[rgba(201,168,106,0.05)]">{isZh ? '长程执行漂移、对齐与安全边界' : 'Long-horizon drift & alignment'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
