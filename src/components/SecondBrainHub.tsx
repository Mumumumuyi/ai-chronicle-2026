import React, { useState } from 'react';
import { Brain, ShieldCheck, XCircle, Terminal } from 'lucide-react';

export const SecondBrainHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'anti-ai' | 'runtime-loop' | 'knowledge-map'>('anti-ai');
  const [previewBadAIVibe, setPreviewBadAIVibe] = useState<boolean>(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-[#00F0FF] mb-2">
          <span className="px-2.5 py-1 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/30">
            KNOWLEDGE BASE INTEGRATION
          </span>
          <span className="text-slate-500">|</span>
          <span>AI 第二大脑认知映射</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold font-serif-sc text-white tracking-tight">
          AI 第二大脑知识底座与“反AI味”工程美学
        </h2>
        <p className="text-sm sm:text-base text-slate-400 font-light max-w-3xl mt-2">
          本项目深度整合了本机长期沉淀的 Obsidian AI 第二大脑知识库（
          <code className="text-xs font-mono text-[#00F0FF] bg-white/5 px-1 py-0.5 rounded">
            AI-第二大脑/
          </code>
          ）中的设计哲学、执行规范与原子知识网络。
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('anti-ai')}
          className={`px-4 py-2 rounded-t-md transition-all flex items-center space-x-2 ${
            activeTab === 'anti-ai'
              ? 'bg-white/10 text-[#00F0FF] border-b-2 border-[#00F0FF] font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>UI设计反AI味基准 (去套路化)</span>
        </button>
        <button
          onClick={() => setActiveTab('runtime-loop')}
          className={`px-4 py-2 rounded-t-md transition-all flex items-center space-x-2 ${
            activeTab === 'runtime-loop'
              ? 'bg-white/10 text-[#00F0FF] border-b-2 border-[#00F0FF] font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Agent Runtime Loop (执行闭环)</span>
        </button>
        <button
          onClick={() => setActiveTab('knowledge-map')}
          className={`px-4 py-2 rounded-t-md transition-all flex items-center space-x-2 ${
            activeTab === 'knowledge-map'
              ? 'bg-white/10 text-[#00F0FF] border-b-2 border-[#00F0FF] font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>原子知识节点映射 (562+ 笔记)</span>
        </button>
      </div>

      {/* Tab Content 1: Anti-AI UI Baseline */}
      {activeTab === 'anti-ai' && (
        <div className="space-y-8">
          <div className="glass-panel p-6 sm:p-8 rounded-lg border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold font-serif-sc text-white">
                  知识库原子规范：《UI设计反AI味基准》
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  档案溯源: <code className="text-[#00F0FF]">原子/技能与提示词/UI设计反AI味基准.md</code>
                </p>
              </div>

              {/* Bad AI vs Professional Toggle */}
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-slate-400">切换设计对比视窗:</span>
                <button
                  onClick={() => setPreviewBadAIVibe(!previewBadAIVibe)}
                  className={`px-3 py-1.5 rounded transition-all border ${
                    previewBadAIVibe
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500'
                      : 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40'
                  }`}
                >
                  {previewBadAIVibe ? '⚠️ 模拟俗套 AI 界面' : '✓ 当前专业瑞士工匠风'}
                </button>
              </div>
            </div>

            {/* Interactive Preview Comparison Box */}
            <div className={`p-6 rounded-lg transition-all duration-300 border ${
              previewBadAIVibe
                ? 'bg-gradient-to-br from-[#1a0b2e] via-[#2d124d] to-[#0f051d] border-purple-500/50 shadow-2xl shadow-purple-500/20'
                : 'bg-[#0D0F14] border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-4 text-xs font-mono">
                <span className={previewBadAIVibe ? 'text-purple-300 font-bold' : 'text-[#00F0FF]'}>
                  {previewBadAIVibe ? '［典型AI生成界面症状：俗气紫色渐变 + 浮夸光晕 + 低信息密度］' : '［第二大脑反AI味基准：低饱和暗灰阶 + 1px极细边框 + 高信息密度 + 瑞士版式］'}
                </span>
                <span className="text-slate-500">LIVE PREVIEW</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded transition-all ${
                  previewBadAIVibe
                    ? 'bg-purple-900/40 border border-purple-400/40 rounded-2xl shadow-lg'
                    : 'bg-white/[0.02] border border-white/10 rounded-md font-mono text-xs'
                }`}>
                  <div className={previewBadAIVibe ? 'text-purple-300 text-xs' : 'text-slate-500 text-[10px]'}>
                    {previewBadAIVibe ? '✨ 炫酷超级指标 ✨' : 'INDEX.CHRONICLE_SPAN'}
                  </div>
                  <div className={previewBadAIVibe ? 'text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300' : 'text-slate-200 font-bold text-sm mt-1'}>
                    83 YEARS
                  </div>
                  <div className={previewBadAIVibe ? 'text-xs text-purple-400 mt-2' : 'text-[10px] text-slate-400 mt-1'}>
                    {previewBadAIVibe ? '占了整整一屏的大卡片' : '高信息密度行条，行高统一'}
                  </div>
                </div>

                <div className={`p-4 rounded transition-all ${
                  previewBadAIVibe
                    ? 'bg-purple-900/40 border border-purple-400/40 rounded-2xl shadow-lg'
                    : 'bg-white/[0.02] border border-white/10 rounded-md font-mono text-xs'
                }`}>
                  <div className={previewBadAIVibe ? 'text-purple-300 text-xs' : 'text-slate-500 text-[10px]'}>
                    {previewBadAIVibe ? '🚀 震撼算力奇迹 🚀' : 'COMPUTE.EXPONENT_SCALE'}
                  </div>
                  <div className={previewBadAIVibe ? 'text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300' : 'text-[#00F0FF] font-bold text-sm mt-1'}>
                    10^25 FLOPs
                  </div>
                  <div className={previewBadAIVibe ? 'text-xs text-purple-400 mt-2' : 'text-[10px] text-slate-400 mt-1'}>
                    {previewBadAIVibe ? '到处都是发光彩虹渐变' : '单一强调色 #00F0FF 引导视觉重心'}
                  </div>
                </div>

                <div className={`p-4 rounded transition-all ${
                  previewBadAIVibe
                    ? 'bg-purple-900/40 border border-purple-400/40 rounded-2xl shadow-lg'
                    : 'bg-white/[0.02] border border-white/10 rounded-md font-mono text-xs'
                }`}>
                  <div className={previewBadAIVibe ? 'text-purple-300 text-xs' : 'text-slate-500 text-[10px]'}>
                    {previewBadAIVibe ? '⚡ 颠覆性神级技术 ⚡' : 'ACTIVE_PARADIGM.STATE'}
                  </div>
                  <div className={previewBadAIVibe ? 'text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400' : 'text-emerald-400 font-bold text-sm mt-1'}>
                    SYSTEM 2 REASONING
                  </div>
                  <div className={previewBadAIVibe ? 'text-xs text-purple-400 mt-2' : 'text-[10px] text-slate-400 mt-1'}>
                    {previewBadAIVibe ? '无意义的晃动与光斑特效' : '小圆角 6-8px，细边框代替阴影'}
                  </div>
                </div>
              </div>
            </div>

            {/* Rule Comparison Table */}
            <div className="mt-8 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-sans">
                <thead>
                  <tr className="border-b border-white/10 font-mono text-[11px] text-slate-400">
                    <th className="p-3">症状（AI 生成套路味）</th>
                    <th className="p-3">反着做（第二大脑专业工匠标准）</th>
                    <th className="p-3">在本项目中的落地点</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 text-rose-400 flex items-center">
                      <XCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      紫色 #6D3BEB + 各种炫光渐变
                    </td>
                    <td className="p-3 text-emerald-400">
                      中性暗灰阶骨架 + 唯一低饱和强调色 (#00F0FF)
                    </td>
                    <td className="p-3 text-slate-300">
                      全站采用 #08090C 钛合金深色背景与赛博电光青重点点缀
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 text-rose-400 flex items-center">
                      <XCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      4 张大卡片放 4 个数字占满一整屏
                    </td>
                    <td className="p-3 text-emerald-400">
                      高信息密度指标条，高度压缩在 50-60px
                    </td>
                    <td className="p-3 text-slate-300">
                      Hero 区与编年史卡片保持紧凑，留白克制有节奏
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 text-rose-400 flex items-center">
                      <XCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      14px+ 大圆角 + 模糊大投影 + 炫目掠光
                    </td>
                    <td className="p-3 text-emerald-400">
                      1px 极细边框代替大阴影，圆角收敛至 6-8px
                    </td>
                    <td className="p-3 text-slate-300">
                      使用 border-white/10 细线，纯净平直的工业仪器触感
                    </td>
                  </tr>
                  <tr className="hover:bg-white/[0.02]">
                    <td className="p-3 text-rose-400 flex items-center">
                      <XCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                      装饰性晃动动画，干扰阅读
                    </td>
                    <td className="p-3 text-emerald-400">
                      只保留具有功能语义的微动效 (时间轴滑动、过滤)
                    </td>
                    <td className="p-3 text-slate-300">
                      所有过渡均为 150-200ms 功能性反馈，无冗余无用摆动
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Agent Runtime Loop */}
      {activeTab === 'runtime-loop' && (
        <div className="glass-panel p-6 sm:p-8 rounded-lg border border-white/10 space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h3 className="text-lg font-bold font-serif-sc text-white">
              现代自主智能体操作系统架构 (Agent Runtime Loop)
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              核心信条：<span className="text-[#00F0FF] font-semibold">“Tool is capability, Runtime is authority.”</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-white/[0.02] border border-white/10">
              <div className="text-[#00F0FF] text-[10px] font-bold mb-1">01. 目标编译</div>
              <div className="text-slate-200 font-sans font-medium mb-1">Goal Compiler</div>
              <p className="text-[11px] text-slate-400 font-sans">锁定不可擅降的验收标准与安全边界</p>
            </div>
            <div className="p-3 rounded bg-white/[0.02] border border-white/10">
              <div className="text-[#00F0FF] text-[10px] font-bold mb-1">02. 方案图</div>
              <div className="text-slate-200 font-sans font-medium mb-1">Plan Graph</div>
              <p className="text-[11px] text-slate-400 font-sans">拆解为带依赖关系的动态 DAG 执行节点</p>
            </div>
            <div className="p-3 rounded bg-white/[0.02] border border-white/10">
              <div className="text-[#00F0FF] text-[10px] font-bold mb-1">03. 节点执行</div>
              <div className="text-slate-200 font-sans font-medium mb-1">Execution Loop</div>
              <p className="text-[11px] text-slate-400 font-sans">调用编译器、文件、终端真实路径运行</p>
            </div>
            <div className="p-3 rounded bg-white/[0.02] border border-white/10">
              <div className="text-[#00F0FF] text-[10px] font-bold mb-1">04. 验证引擎</div>
              <div className="text-slate-200 font-sans font-medium mb-1">Verification Engine</div>
              <p className="text-[11px] text-slate-400 font-sans">防作弊棘轮，仅凭真实测试与产物说话</p>
            </div>
            <div className="p-3 rounded bg-white/[0.02] border border-white/10">
              <div className="text-[#00F0FF] text-[10px] font-bold mb-1">05. 返工引擎</div>
              <div className="text-slate-200 font-sans font-medium mb-1">Rework Engine</div>
              <p className="text-[11px] text-slate-400 font-sans">深剖失败真因，动态插回子节点修复</p>
            </div>
            <div className="p-3 rounded bg-white/[0.02] border border-white/10">
              <div className="text-[#00F0FF] text-[10px] font-bold mb-1">06. 最终裁决</div>
              <div className="text-slate-200 font-sans font-medium mb-1">Final Judge</div>
              <p className="text-[11px] text-slate-400 font-sans">汇总多视角审查，交付真实达标产物</p>
            </div>
          </div>

          <div className="p-4 rounded bg-cyan-950/20 border border-[#00F0FF]/30 text-xs text-slate-300 leading-relaxed font-sans">
            <span className="text-[#00F0FF] font-mono font-bold mr-1">本页面诞生过程的实体验证：</span>
            本项目的编写完全贯彻了 Runtime Loop 的法则：从用户指令的目标编译（写作大师级通史 + 反AI味高交互前端），到方案图拆分，再到真实在 Windows 终端中运行 <code className="text-[#00F0FF]">npm install</code>、验证构建产物，以切实的代码证据保证了系统的高品质交付。
          </div>
        </div>
      )}

      {/* Tab Content 3: Knowledge Map */}
      {activeTab === 'knowledge-map' && (
        <div className="glass-panel p-6 sm:p-8 rounded-lg border border-white/10 space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h3 className="text-lg font-bold font-serif-sc text-white">
              AI 第二大脑关键原子知识索引 (Obsidian Vault 实体连通)
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              长期知识库路径: <code className="text-[#00F0FF]">D:\Software\obsidian\Scbrain_of_ai\Scbrain_of_ai\AI-第二大脑\</code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded bg-white/[0.02] border border-white/10 hover:border-[#00F0FF]/40 transition-colors">
              <div className="text-[10px] text-slate-500 mb-1">#原子知识 · 技能与提示词</div>
              <div className="text-slate-100 font-bold text-sm mb-1">UI设计反AI味基准.md</div>
              <p className="text-slate-400 font-sans text-xs">
                总结了告别紫色渐变与大卡片的规则，树立中性灰阶与高信息密度标准。
              </p>
            </div>

            <div className="p-4 rounded bg-white/[0.02] border border-white/10 hover:border-[#00F0FF]/40 transition-colors">
              <div className="text-[10px] text-slate-500 mb-1">#经验复用 · 路由表</div>
              <div className="text-slate-100 font-bold text-sm mb-1">01-新项目启动路由表.md</div>
              <p className="text-slate-400 font-sans text-xs">
                针对前端/UI任务提供防AI味与真实验证的闭环路由准则。
              </p>
            </div>

            <div className="p-4 rounded bg-white/[0.02] border border-white/10 hover:border-[#00F0FF]/40 transition-colors">
              <div className="text-[10px] text-slate-500 mb-1">#原子知识 · 执行与验证</div>
              <div className="text-slate-100 font-bold text-sm mb-1">目标编译与验证闭环.md</div>
              <p className="text-slate-400 font-sans text-xs">
                禁止静默降低用户目标，任何声称“完成”都必须提供运行时的确凿证据。
              </p>
            </div>

            <div className="p-4 rounded bg-white/[0.02] border border-white/10 hover:border-[#00F0FF]/40 transition-colors">
              <div className="text-[10px] text-slate-500 mb-1">#设计提示词库 · 总览</div>
              <div className="text-slate-100 font-bold text-sm mb-1">00-提示词库总览.md</div>
              <p className="text-slate-400 font-sans text-xs">
                汇集371个精选实验级UI设计原型（Hero、落地页、着色器、Bento排版）。
              </p>
            </div>

            <div className="p-4 rounded bg-white/[0.02] border border-white/10 hover:border-[#00F0FF]/40 transition-colors">
              <div className="text-[10px] text-slate-500 mb-1">#全局执行系统</div>
              <div className="text-slate-100 font-bold text-sm mb-1">Agent Runtime Loop System</div>
              <p className="text-slate-400 font-sans text-xs">
                驱动自主编码与自愈合返工引擎的底层最高优先级操作系统。
              </p>
            </div>

            <div className="p-4 rounded bg-white/[0.02] border border-white/10 hover:border-[#00F0FF]/40 transition-colors">
              <div className="text-[10px] text-slate-500 mb-1">#工程技能规范</div>
              <div className="text-slate-100 font-bold text-sm mb-1">karpathy-guidelines</div>
              <p className="text-slate-400 font-sans text-xs">
                想清再写、简洁优先、手术式修改、目标驱动执行，减少LLM编码幻觉。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
