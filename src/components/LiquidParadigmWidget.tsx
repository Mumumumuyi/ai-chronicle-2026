import React, { useState, useMemo } from 'react';
import { Zap, RotateCcw, Sparkles, GitBranch, Activity } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { soundFX } from '../utils/audioEffects';

export const LiquidParadigmWidget: React.FC = () => {
  const { currentLang } = useLanguage();
  const [activeParadigm, setActiveParadigm] = useState<'symbolism' | 'connectionism' | 'agentic2026'>('agentic2026');
  const [thinkingTokens, setThinkingTokens] = useState<number>(4096);
  const [modelSize, setModelSize] = useState<number>(70);

  const isZh = currentLang === 'zh';

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

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleSelectParadigm = (id: 'symbolism' | 'connectionism' | 'agentic2026') => {
    soundFX.playClick(720);
    setActiveParadigm(id);
  };

  const handleTokenChange = (val: number) => {
    setThinkingTokens(val);
    soundFX.playSliderTick(val / 16384);
  };

  const handleModelChange = (val: number) => {
    setModelSize(val);
    soundFX.playSliderTick(val / 405);
  };

  const handlePresetTokens = (val: number) => {
    soundFX.playClick(800);
    setThinkingTokens(val);
  };

  const handlePresetModel = (val: number) => {
    soundFX.playClick(800);
    setModelSize(val);
  };

  const handleReset = () => {
    soundFX.playClick(500);
    setModelSize(70);
    setThinkingTokens(4096);
  };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-24 space-y-12 animate-tab-enter">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full liquid-glass-pill text-xs font-mono text-amber-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>PARADIGM & SCALING MATRIX</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
          {isZh ? '范式演变与测试时计算实验室' : 'The Dual Scaling Law Laboratory'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-300/80 font-light">
          {isZh 
            ? '从符号逻辑的规则孤岛，到 2024-2026 年慢思考强化学习（Test-Time Compute）第二缩放定律的优雅跃迁。'
            : 'From isolated symbolic rules to the empirical second scaling law of test-time inference compute (2024-2026).'}
        </p>
      </div>

      {/* Part 1: Interactive Fluid Paradigm Cards with Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {paradigmCards.map((card) => {
          const isSelected = activeParadigm === card.id;
          return (
            <div
              key={card.id}
              onClick={() => handleSelectParadigm(card.id)}
              onMouseMove={handleCardMouseMove}
              className={`spotlight-card p-6 rounded-3xl cursor-pointer transition-all duration-300 relative glass-sheen ${
                isSelected
                  ? 'liquid-glass-amber scale-[1.02] shadow-2xl border border-amber-300/40'
                  : 'liquid-glass hover:bg-white/[0.06] border border-white/10'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2 relative z-10">
                <span className={isSelected ? 'text-amber-300 font-bold' : 'text-stone-400'}>
                  {card.name}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>

              <h3 className="text-lg font-serif font-semibold text-white mb-2 relative z-10">
                {card.title}
              </h3>

              <p className="text-xs font-serif italic text-stone-300/90 mb-4 leading-relaxed relative z-10">
                {card.quote}
              </p>

              <div className="space-y-1.5 pt-3 border-t border-white/10 text-[11px] font-mono text-stone-400 relative z-10">
                <div className="text-stone-300 truncate">{card.feat}</div>
                <div className="text-amber-200/80 truncate">{card.flaw}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Part 2: Liquid Glass Test-Time Scaling Slider Widget */}
      <div className="liquid-glass-strong rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
          <div>
            <div className="flex items-center space-x-2 text-white font-serif text-lg font-semibold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isZh ? '测试时计算（Test-Time Compute）第二缩放定律推演仪' : 'Test-Time Compute (System 2) Scaling Simulator'}</span>
            </div>
            <p className="text-xs font-mono text-stone-400 mt-0.5">
              {isZh 
                ? '验证：给模型更多思考 Token 与树搜索分支，在复杂难题上性能平滑飞跃'
                : 'Scaling Law: Allocating more search tokens yields exponential gains on complex reasoning benchmarks'}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="liquid-glass-pill px-3 py-1 rounded-full text-xs font-mono text-stone-400 hover:text-white flex items-center space-x-1 self-start sm:self-auto hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isZh ? '重置' : 'Reset'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Slider Controls */}
          <div className="lg:col-span-6 space-y-6">
            {/* Thinking Tokens Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-stone-300 font-medium">
                  {isZh ? '思考 Token 预算 (Thinking Tokens):' : 'Thinking Tokens Budget:'}
                </span>
                <span className="text-amber-300 font-bold text-sm font-mono">
                  {thinkingTokens.toLocaleString()} Tokens
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="16384"
                step="256"
                value={thinkingTokens}
                onChange={(e) => handleTokenChange(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-800 rounded-full"
              />
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
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
                    onClick={() => handlePresetTokens(item.val)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      thinkingTokens === item.val
                        ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold'
                        : 'bg-white/5 text-stone-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Base Model Parameters Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-stone-300 font-medium">
                  {isZh ? '预训练基座规模 (Base Parameters):' : 'Base Model Parameters:'}
                </span>
                <span className="text-amber-300 font-bold text-sm font-mono">{modelSize}B {isZh ? '参数' : 'Params'}</span>
              </div>
              <input
                type="range"
                min="7"
                max="405"
                step="1"
                value={modelSize}
                onChange={(e) => handleModelChange(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-800 rounded-full"
              />
              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
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
                    onClick={() => handlePresetModel(item.val)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      modelSize === item.val
                        ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold'
                        : 'bg-white/5 text-stone-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Interactive System 2 Search Tree Visualizer */}
            <div className="p-4 rounded-2xl liquid-glass border border-white/10 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center space-x-1.5 text-amber-300 font-semibold">
                  <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isZh ? '测试时思维链树展开模拟' : 'Test-Time Search Tree Visualizer'}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-stone-400 border border-white/10">
                  {isZh ? `搜索深度: ${scalingStats.treeDepth} 级` : `Depth: ${scalingStats.treeDepth}`}
                </span>
              </div>

              {/* Dynamic Branching Node Visual */}
              <div className="h-16 flex items-center justify-between px-3 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden">
                {/* Root node */}
                <div className="flex flex-col items-center z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-black" />
                  </div>
                  <span className="text-[8px] text-amber-300 mt-1">Root</span>
                </div>

                {/* Connecting Search Beams */}
                <div className="flex-1 h-0.5 mx-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500/40 relative">
                  <div 
                    className="absolute inset-y-0 left-0 bg-amber-200 shadow-md transition-all duration-300"
                    style={{ width: `${Math.min(100, (thinkingTokens / 16384) * 100)}%` }}
                  />
                </div>

                {/* Search Exploration Nodes */}
                <div className="flex items-center space-x-2 z-10">
                  {Array.from({ length: Math.min(5, scalingStats.treeDepth) }).map((_, nIdx) => (
                    <div key={nIdx} className="flex flex-col items-center">
                      <div 
                        className={`w-3 h-3 rounded-full transition-all duration-300 flex items-center justify-center ${
                          nIdx < scalingStats.treeDepth
                            ? 'bg-amber-400/80 ring-2 ring-amber-400/30 scale-110'
                            : 'bg-stone-700 opacity-40'
                        }`}
                      >
                        <span className="w-1 h-1 rounded-full bg-white" />
                      </div>
                      <span className="text-[8px] text-stone-400 mt-1">D{nIdx + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-stone-400">
                <span>{isZh ? `已探索思考节点: ~${scalingStats.treeNodes * 128} 状态` : `Explored States: ~${scalingStats.treeNodes * 128}`}</span>
                <span className="text-amber-300">{isZh ? `搜索耗时: ~${scalingStats.latencySec}s` : `Latency: ~${scalingStats.latencySec}s`}</span>
              </div>
            </div>
          </div>

          {/* Real-time Meter Glass Panel */}
          <div className="lg:col-span-6 liquid-glass p-5 sm:p-6 rounded-2xl border border-amber-400/20 font-mono">
            <div className="flex justify-between items-center text-xs text-stone-400 mb-4 pb-2 border-b border-white/10">
              <span className="font-semibold text-stone-200">
                {isZh ? '前沿基准能力投射 (Benchmark Projections)' : 'Reasoning Benchmark Projections'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center space-x-1">
                <Activity className="w-2.5 h-2.5 animate-pulse" />
                <span>LIVE TELEMETRY</span>
              </span>
            </div>

            <div className="space-y-4">
              {/* Benchmark 1 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-300">MATH-500 (竞赛数学):</span>
                  <span className="text-amber-300 font-bold">{scalingStats.math500}%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-400"
                    style={{ width: `${scalingStats.math500}%` }}
                  />
                </div>
              </div>

              {/* Benchmark 2 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-300">SWE-bench Verified (真实代码仓库解决率):</span>
                  <span className="text-amber-300 font-bold">{scalingStats.sweBench}%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 h-full rounded-full transition-all duration-400"
                    style={{ width: `${scalingStats.sweBench}%` }}
                  />
                </div>
              </div>

              {/* Benchmark 3 */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-300">GPQA Diamond (博士级高难科学推理):</span>
                  <span className="text-amber-300 font-bold">{scalingStats.gpqa}%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-400"
                    style={{ width: `${scalingStats.gpqa}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Intuition vs Search Delta */}
            <div className="mt-6 p-4 rounded-xl bg-black/30 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>{isZh ? '系统一前向直觉准确率:' : 'System 1 Instinct Acc:'}</span>
                <span className="text-stone-200">{scalingStats.baseAcc}%</span>
              </div>
              <div className="flex justify-between text-amber-300 font-bold pt-1 border-t border-white/5">
                <span className="flex items-center">
                  <Zap className="w-3 h-3 mr-1 text-amber-400" />
                  {isZh ? '系统二测试时搜索净增益:' : 'System 2 Test-Time Delta:'}
                </span>
                <span>+{scalingStats.gain}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: Paradigm Matrix Deep Comparison */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl overflow-x-auto">
        <h3 className="text-lg font-serif font-semibold text-white mb-4">
          {isZh ? '三大 AI 范式横向对比矩阵 (1943 - 2026)' : 'AI Paradigm Comparison Matrix'}
        </h3>
        <table className="w-full text-left text-xs font-mono border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10 text-stone-400">
              <th className="py-2.5 px-3">{isZh ? '对比维度' : 'Dimension'}</th>
              <th className="py-2.5 px-3 text-amber-300">{isZh ? '符号主义 (1956)' : 'Symbolism (1956)'}</th>
              <th className="py-2.5 px-3 text-amber-300">{isZh ? '连接主义 (1986)' : 'Connectionism (1986)'}</th>
              <th className="py-2.5 px-3 text-amber-200 font-bold bg-amber-500/10 rounded-t-lg">
                {isZh ? '自主智能体 (2026.09)' : 'Autonomous Agents (2026.09)'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-stone-300">
            <tr>
              <td className="py-3 px-3 font-semibold text-stone-400">{isZh ? '核心表征' : 'Representation'}</td>
              <td className="py-3 px-3">{isZh ? '离散符号、谓词公理' : 'Discrete symbols'}</td>
              <td className="py-3 px-3">{isZh ? '连续稠密向量、流形' : 'Dense continuous vectors'}</td>
              <td className="py-3 px-3 text-amber-200 bg-amber-500/10">{isZh ? '神经直觉 + 离散检验/树搜索' : 'Neuro-symbolic search trees'}</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-stone-400">{isZh ? '知识获取' : 'Acquisition'}</td>
              <td className="py-3 px-3">{isZh ? '专家手工形式化编码' : 'Manual expert rules'}</td>
              <td className="py-3 px-3">{isZh ? '海量互联网文本梯度自监督' : 'Large-scale self-supervision'}</td>
              <td className="py-3 px-3 text-amber-200 bg-amber-500/10">{isZh ? '环境自闭环强化学习 + 慢思考自省' : 'RL on verifiable environments'}</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-stone-400">{isZh ? '推理机制' : 'Reasoning'}</td>
              <td className="py-3 px-3">{isZh ? '形式推导、归结消解' : 'Strict deductive deduction'}</td>
              <td className="py-3 px-3">{isZh ? '单向前向传播 (System 1)' : 'Forward pass (System 1)'}</td>
              <td className="py-3 px-3 text-amber-200 bg-amber-500/10">{isZh ? '测试时动态多步自反思 (System 2)' : 'Runtime test-time search (System 2)'}</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-semibold text-stone-400">{isZh ? '致命软肋' : 'Key Flaw'}</td>
              <td className="py-3 px-3">{isZh ? '常识获取瓶颈、组合爆炸' : 'Combinatorial explosion'}</td>
              <td className="py-3 px-3">{isZh ? '概率幻觉、黑盒不可溯' : 'Hallucination & lack of rigor'}</td>
              <td className="py-3 px-3 text-amber-200 bg-amber-500/10">{isZh ? '长程执行漂移、对齐与安全边界' : 'Long-horizon drift & alignment'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
