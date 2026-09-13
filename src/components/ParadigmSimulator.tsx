import React, { useState, useMemo } from 'react';
import { PARADIGM_MATRIX } from '../data/timelineData';
import { Cpu, Zap, CheckCircle2, Layers, RotateCcw } from 'lucide-react';

export const ParadigmSimulator: React.FC = () => {
  // Test-time compute simulation state
  const [modelSize, setModelSize] = useState<number>(70); // in Billion parameters
  const [thinkingTokens, setThinkingTokens] = useState<number>(4096); // test time search tokens
  const [taskDifficulty, setTaskDifficulty] = useState<number>(3); // 1: Basic, 2: Code Debug, 3: AIME Math, 4: Research Conjecture

  // Compute scale timeline slider state
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Calculate System 1 vs System 2 performance
  const simulationResults = useMemo(() => {
    // Difficulty factor: 1 to 4
    // Base capability from model size: log scale
    const baseCap = Math.log10(modelSize) * 20; // 7B ~ 17, 70B ~ 37, 400B ~ 52

    // System 1 (Fast inference, no test-time compute)
    let sys1Accuracy = baseCap - (taskDifficulty - 1) * 22;
    sys1Accuracy = Math.max(2, Math.min(95, sys1Accuracy));

    // System 2 (Test-Time Compute scaling: log2 of thinking tokens)
    const searchBonus = Math.log2(Math.max(64, thinkingTokens) / 64) * (14 - (taskDifficulty * 1.5));
    let sys2Accuracy = sys1Accuracy + searchBonus;
    // System 2 cap based on task difficulty
    const theoreticalCap = taskDifficulty === 4 ? 82 : taskDifficulty === 3 ? 94 : 99;
    sys2Accuracy = Math.max(sys1Accuracy, Math.min(theoreticalCap, sys2Accuracy));

    const tokenLatencyMs = Math.round(150 + (thinkingTokens / 120) * 1000);
    const estimatedFlops = (2 * modelSize * 1e9 * (500 + thinkingTokens)).toExponential(2);

    return {
      sys1Accuracy: Math.round(sys1Accuracy),
      sys2Accuracy: Math.round(sys2Accuracy),
      accuracyGain: Math.round(sys2Accuracy - sys1Accuracy),
      tokenLatencyMs,
      estimatedFlops,
    };
  }, [modelSize, thinkingTokens, taskDifficulty]);

  // Compute timeline info by year
  const computeByYear = useMemo(() => {
    if (selectedYear < 1960) {
      return {
        flops: '10^3 FLOPs',
        hardware: '真空电子管 / 继电器 (IBM 704)',
        power: '~50 kW',
        keyFeat: '人工手算与单步命题逻辑求证',
      };
    } else if (selectedYear < 1975) {
      return {
        flops: '10^7 FLOPs',
        hardware: '分立晶体管 / 磁芯内存 (IBM 7094)',
        power: '~20 kW',
        keyFeat: '微观积木世界与西洋跳棋搜索树',
      };
    } else if (selectedYear < 1993) {
      return {
        flops: '10^10 FLOPs',
        hardware: '超大规模集成电路 (VAX-11/780, Symbolics 3600)',
        power: '~10 kW',
        keyFeat: '产生式规则专家系统与早期BP反向传播',
      };
    } else if (selectedYear < 2012) {
      return {
        flops: '10^14 FLOPs',
        hardware: '商品化多核微处理器 (Intel Pentium / Xeon)',
        power: '~2 kW (单机柜)',
        keyFeat: '深蓝480特制芯片搜索与支持向量机二次规划',
      };
    } else if (selectedYear < 2020) {
      return {
        flops: '10^20 FLOPs',
        hardware: '大规模GPU通用并行算力 (NVIDIA K80/V100 + TPU v2)',
        power: '~500 kW (千卡集群)',
        keyFeat: 'AlphaGo深层自博弈与Transformer自注意力预训练',
      };
    } else if (selectedYear < 2024) {
      return {
        flops: '10^25 FLOPs',
        hardware: '万卡GPU互联超级中心 (NVIDIA A100 / H100 80GB)',
        power: '~50 MW (万卡智算中心)',
        keyFeat: '千亿参数GPT-4与RLHF全人类偏好对齐',
      };
    } else {
      return {
        flops: '10^27 FLOPs + 测试时动态乘数',
        hardware: '十万卡级分布式AI综合体 (NVIDIA B200 / 存算一体与液冷网格)',
        power: '~300 MW (专用清洁能源变电站供电)',
        keyFeat: '系统二自省搜索树、自主Agent运行回路与Lean 4定理证明',
      };
    }
  }, [selectedYear]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Section Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#00F0FF] mb-2">
          <span className="px-2.5 py-1 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/30">
            PARADIGM & SCALING LAB
          </span>
          <span className="text-slate-500">|</span>
          <span>历史演进计算实验台</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold font-serif-sc text-white tracking-tight">
          范式矩阵与测试时计算缩放定律实验室
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-light max-w-3xl mt-2">
          亲身体验从1950年代的符号手工规则，到2024-2026年由OpenAI o1与DeepSeek R1引爆的“系统二测试时计算（Test-Time Compute）”第二缩放定律。
        </p>
      </div>

      {/* Experiment 1: Test-Time Compute Interactive Simulator */}
      <div className="glass-panel p-6 sm:p-8 rounded-lg border border-white/10 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
              <h3 className="text-lg sm:text-xl font-bold font-serif-sc text-white">
                实验 A：系统二测试时计算（Test-Time Compute）交互模拟器
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-1">
              模拟当AI面对复杂命题时，增加思考Token与搜索树深度带来的准确率平滑跃迁
            </p>
          </div>
          <button
            onClick={() => {
              setModelSize(70);
              setThinkingTokens(4096);
              setTaskDifficulty(3);
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            重置参数
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Model Size Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">基础预训练参数规模 (Model Size):</span>
                <span className="text-[#00F0FF] font-bold">{modelSize}B 参数</span>
              </div>
              <input
                type="range"
                min="7"
                max="400"
                step="1"
                value={modelSize}
                onChange={(e) => setModelSize(Number(e.target.value))}
                className="w-full accent-[#00F0FF] cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>7B (端侧微型)</span>
                <span>70B (工业主力)</span>
                <span>400B+ (超大前沿)</span>
              </div>
            </div>

            {/* Test-time Thinking Tokens Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">测试时思考计算配额 (Thinking Tokens):</span>
                <span className="text-[#00F0FF] font-bold">{thinkingTokens} Tokens</span>
              </div>
              <input
                type="range"
                min="0"
                max="16384"
                step="256"
                value={thinkingTokens}
                onChange={(e) => setThinkingTokens(Number(e.target.value))}
                className="w-full accent-[#00F0FF] cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0 (纯系统一直觉)</span>
                <span>4,096 (标准思维链)</span>
                <span>16,384 (极深树状搜索)</span>
              </div>
            </div>

            {/* Task Difficulty Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                任务挑战难度等级 (Task Complexity):
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { level: 1, label: '初等常识问答' },
                  { level: 2, label: '复杂系统代码调试' },
                  { level: 3, label: '奥数竞赛 (AIME 级)' },
                  { level: 4, label: '前沿科学未解猜想' },
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => setTaskDifficulty(item.level)}
                    className={`p-2 rounded text-left border transition-all ${
                      taskDifficulty === item.level
                        ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF] font-medium'
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div className="text-[10px] text-slate-500">LEVEL {item.level}</div>
                    <div className="truncate">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Visualization Column */}
          <div className="lg:col-span-7 bg-black/40 rounded-lg p-6 border border-white/10 font-mono">
            <div className="text-xs text-slate-400 mb-4 pb-2 border-b border-white/5 flex items-center justify-between">
              <span>实时推演比对看板 (REAL-TIME SIMULATION)</span>
              <span className="text-emerald-400 text-[10px] flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                第二缩放定律收敛验证中
              </span>
            </div>

            {/* Comparison Meters */}
            <div className="space-y-4 mb-6">
              {/* System 1 (Pretrain intuition) */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">系统一 (System 1 · 仅凭快思考直觉):</span>
                  <span className="text-slate-300 font-bold">{simulationResults.sys1Accuracy}%</span>
                </div>
                <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                  <div 
                    className="h-full bg-slate-500 transition-all duration-300"
                    style={{ width: `${simulationResults.sys1Accuracy}%` }}
                  />
                </div>
              </div>

              {/* System 2 (Test-time compute reasoning) */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#00F0FF] font-semibold flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1" />
                    系统二 (System 2 · 测试时思考树搜索):
                  </span>
                  <span className="text-[#00F0FF] font-bold text-sm">
                    {simulationResults.sys2Accuracy}%
                    <span className="text-xs text-emerald-400 ml-1 font-normal">
                      (+{simulationResults.accuracyGain}%)
                    </span>
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-[#00F0FF]/30 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-[#00F0FF] transition-all duration-300"
                    style={{ width: `${simulationResults.sys2Accuracy}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Computed metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-4 border-t border-white/5">
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-slate-500">单题响应延迟预估</div>
                <div className="text-slate-200 font-bold mt-0.5">
                  {(simulationResults.tokenLatencyMs / 1000).toFixed(1)} 秒
                </div>
              </div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/5">
                <div className="text-[10px] text-slate-500">单步浮点数算力 (FLOPs)</div>
                <div className="text-slate-200 font-bold mt-0.5 truncate">
                  {simulationResults.estimatedFlops}
                </div>
              </div>
              <div className="p-2.5 rounded bg-white/[0.02] border border-white/5 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-slate-500">自省搜索增益</div>
                <div className="text-emerald-400 font-bold mt-0.5">
                  {simulationResults.accuracyGain > 0 ? `提高 ${simulationResults.accuracyGain} 个百分点` : '无需测试时搜索'}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded bg-cyan-950/20 border border-[#00F0FF]/20 text-[11px] text-slate-300 leading-relaxed font-sans">
              <span className="text-[#00F0FF] font-mono font-semibold mr-1">实验结论：</span>
              在低难度任务中，大参数模型凭借直觉即可完美回答；但在高阶数理推导中，增加思考Token带来的性能增益远超单纯扩大模型参数量。这就是为什么2024-2026年整个产业界从“盲目堆预训练”全面转向“强化测试时搜索”。
            </div>
          </div>
        </div>
      </div>

      {/* Experiment 2: Paradigm Matrix Comparison Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-lg border border-white/10">
        <div className="flex items-center space-x-2 mb-2">
          <Layers className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="text-lg sm:text-xl font-bold font-serif-sc text-white">
            实验 B：五大历史范式全维对比矩阵 (Paradigm Matrix)
          </h3>
        </div>
        <p className="text-xs font-mono text-slate-400 mb-6">
          从符号逻辑的孤岛到神经符号的终极综合，直观透视人类70年算法思想变迁
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-white/15 bg-white/[0.02] font-mono text-[11px] text-slate-300">
                <th className="p-3 w-28 text-slate-400">比较维度</th>
                <th className="p-3 text-cyan-300">符号主义 (1956)</th>
                <th className="p-3 text-indigo-300">连接主义 (1986)</th>
                <th className="p-3 text-emerald-300">统计学习 (1995)</th>
                <th className="p-3 text-pink-300">大语言模型 (2020)</th>
                <th className="p-3 text-[#00F0FF] bg-[#00F0FF]/5">自主智能体 (2026)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {PARADIGM_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 font-mono font-semibold text-slate-300 bg-white/[0.01]">
                    {row.dimension}
                  </td>
                  <td className="p-3 text-slate-400 leading-relaxed">{row.symbolism}</td>
                  <td className="p-3 text-slate-400 leading-relaxed">{row.connectionism}</td>
                  <td className="p-3 text-slate-400 leading-relaxed">{row.statistical}</td>
                  <td className="p-3 text-slate-300 leading-relaxed">{row.llm}</td>
                  <td className="p-3 text-slate-100 font-medium leading-relaxed bg-[#00F0FF]/[0.02]">
                    {row.agentic2026}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Experiment 3: Compute Exponent Slider (1950 - 2026) */}
      <div className="glass-panel p-6 sm:p-8 rounded-lg border border-white/10">
        <div className="flex items-center space-x-2 mb-2">
          <Cpu className="w-4 h-4 text-[#00F0FF]" />
          <h3 className="text-lg sm:text-xl font-bold font-serif-sc text-white">
            实验 C：算力爆炸对数标尺 (1950 — 2026)
          </h3>
        </div>
        <p className="text-xs font-mono text-slate-400 mb-6">
          拖动年份滑块，查验不同历史截面上的物理算力阶跃、功耗消耗与里程碑技术成就
        </p>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-400">历史时间截面:</span>
              <span className="text-[#00F0FF] font-bold text-base">{selectedYear} 年</span>
            </div>
            <input
              type="range"
              min="1950"
              max="2026"
              step="1"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full accent-[#00F0FF] cursor-pointer h-2 bg-white/10 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
              <span>1950 (图灵)</span>
              <span>1970 (明斯基)</span>
              <span>1990 (BP/第五代)</span>
              <span>2012 (AlexNet)</span>
              <span>2020 (GPT-3)</span>
              <span className="text-[#00F0FF] font-bold">2026.09 (当前时刻)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/10 font-mono text-xs">
            <div className="p-4 rounded bg-black/40 border border-white/10">
              <div className="text-[10px] text-slate-500 mb-1">算力数量级 (FLOPs)</div>
              <div className="text-lg font-bold text-[#00F0FF]">{computeByYear.flops}</div>
            </div>
            <div className="p-4 rounded bg-black/40 border border-white/10">
              <div className="text-[10px] text-slate-500 mb-1">主流计算物理硬件</div>
              <div className="text-slate-200 font-sans text-xs leading-snug">{computeByYear.hardware}</div>
            </div>
            <div className="p-4 rounded bg-black/40 border border-white/10">
              <div className="text-[10px] text-slate-500 mb-1">典型用电与能耗标尺</div>
              <div className="text-amber-400 font-bold">{computeByYear.power}</div>
            </div>
            <div className="p-4 rounded bg-black/40 border border-white/10">
              <div className="text-[10px] text-slate-500 mb-1">时代核心计算成就</div>
              <div className="text-slate-200 font-sans text-xs leading-snug">{computeByYear.keyFeat}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
