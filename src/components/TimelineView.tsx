import React, { useState, useMemo } from 'react';
import { EPOCHS } from '../data/timelineData';
import { MilestoneModal } from './MilestoneModal';
import { Milestone, ParadigmType, MilestoneCategory } from '../types';
import { Filter, User, ArrowUpRight } from 'lucide-react';

interface TimelineViewProps {
  searchQuery: string;
  activeEpochIndex: number;
  onSelectEpoch: (index: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  searchQuery,
  activeEpochIndex,
  onSelectEpoch,
}) => {
  const [selectedParadigm, setSelectedParadigm] = useState<ParadigmType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<MilestoneCategory | 'ALL'>('ALL');
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  // Flatten all milestones
  const allMilestones = useMemo(() => {
    return EPOCHS.flatMap((epoch) => epoch.milestones);
  }, []);

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return allMilestones.filter((m) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesSubtitle = m.subtitle.toLowerCase().includes(q);
        const matchesFigures = m.keyFigures.some((f) => f.toLowerCase().includes(q));
        const matchesTags = m.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSummary = m.summary.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubtitle && !matchesFigures && !matchesTags && !matchesSummary) {
          return false;
        }
      }

      // Paradigm filter
      if (selectedParadigm !== 'ALL' && m.paradigm !== selectedParadigm) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL' && m.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [allMilestones, searchQuery, selectedParadigm, selectedCategory]);

  const paradigmList: { id: ParadigmType | 'ALL'; label: string }[] = [
    { id: 'ALL', label: '全部范式' },
    { id: 'Symbolism', label: '符号主义' },
    { id: 'Connectionism', label: '连接主义' },
    { id: 'Statistical', label: '统计学习' },
    { id: 'DeepLearning', label: '深度学习' },
    { id: 'FoundationModel', label: '通用大模型' },
    { id: 'AgenticSystem', label: '系统二智能体 (2024-2026)' },
  ];

  const categoryList: { id: MilestoneCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: '全部分类' },
    { id: 'theory', label: '理论奠基' },
    { id: 'algorithm', label: '核心算法' },
    { id: 'compute', label: '算力/基准' },
    { id: 'industry', label: '产业落地' },
    { id: 'geopolitics', label: '地缘政治' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Filter and Control Bar */}
      <div className="glass-panel p-4 rounded-lg mb-8 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Paradigm Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-500 mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" />
            范式筛选:
          </span>
          {paradigmList.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedParadigm(item.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                selectedParadigm === item.id
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-medium'
                  : 'bg-white/[0.02] text-slate-400 border border-white/5 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-500 mr-1">分类:</span>
          {categoryList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-0.5 rounded text-xs font-mono transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'bg-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter result feedback */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6 pb-2 border-b border-white/5">
        <div>
          显示 <span className="text-[#00F0FF] font-bold">{filteredMilestones.length}</span> 项关键历史里程碑事件
          {searchQuery && (
            <span className="ml-2 text-slate-500">
              (匹配关键词: &ldquo;{searchQuery}&rdquo;)
            </span>
          )}
        </div>
        <div className="hidden sm:block text-slate-500">
          点击任意卡片调阅详尽历史绝密档案
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
        {EPOCHS.map((epoch, epochIndex) => {
          // Check if this epoch has any matching milestones
          const epochMilestones = filteredMilestones.filter((m) => m.epochId === epoch.id);
          if (epochMilestones.length === 0) return null;

          const isCurrentActive = epochIndex === activeEpochIndex;

          return (
            <div key={epoch.id} className="relative">
              {/* Epoch spine marker */}
              <div 
                onClick={() => onSelectEpoch(epochIndex)}
                className={`absolute -left-[31px] sm:-left-[47px] top-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                  isCurrentActive
                    ? 'bg-[#00F0FF] text-black ring-4 ring-[#00F0FF]/20 shadow-lg'
                    : 'bg-[#13161F] text-[#00F0FF] border border-white/20 hover:border-[#00F0FF]'
                }`}
              >
                <span className="text-xs font-mono font-bold">
                  {epochIndex === 0 ? '0' : epochIndex}
                </span>
              </div>

              {/* Epoch Header */}
              <div className="mb-6 pt-0.5">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider">
                    {epoch.romanId} · {epoch.era}
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-xs font-mono text-slate-400">
                    算力标尺: {epoch.computeOrderOfMagnitude}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-sc">
                  {epoch.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light max-w-3xl">
                  {epoch.summary}
                </p>
              </div>

              {/* Milestones in this epoch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {epochMilestones.map((milestone) => {
                  return (
                    <div
                      key={milestone.id}
                      onClick={() => setActiveMilestone(milestone)}
                      className="group glass-panel rounded-md p-5 border border-white/10 hover:border-[#00F0FF]/40 cursor-pointer transition-all hover:bg-white/[0.03] relative flex flex-col justify-between"
                    >
                      <div>
                        {/* Top card metadata */}
                        <div className="flex items-center justify-between mb-2 text-xs font-mono">
                          <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 font-bold group-hover:text-[#00F0FF] transition-colors">
                            {milestone.year}
                          </span>
                          <span className="text-[11px] text-slate-500 group-hover:text-slate-400 flex items-center">
                            {milestone.paradigm}
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#00F0FF]" />
                          </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#00F0FF] transition-colors font-serif-sc mb-1">
                          {milestone.title}
                        </h3>
                        <p className="text-xs font-mono text-slate-400 mb-3 line-clamp-1">
                          {milestone.subtitle}
                        </p>

                        {/* Summary */}
                        <p className="text-xs text-slate-300 leading-relaxed font-light mb-4 line-clamp-3">
                          {milestone.summary}
                        </p>
                      </div>

                      <div>
                        {/* Key Figures & Hardware strip */}
                        <div className="pt-3 border-t border-white/5 text-[11px] font-mono flex items-center justify-between text-slate-400">
                          <span className="truncate max-w-[180px] flex items-center">
                            <User className="w-3 h-3 mr-1 text-slate-500 flex-shrink-0" />
                            {milestone.keyFigures[0]}
                            {milestone.keyFigures.length > 1 && ` +${milestone.keyFigures.length - 1}`}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {milestone.computeCostEstimate ? milestone.computeCostEstimate.split(' ')[0] : '理论'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dossier Modal */}
      <MilestoneModal
        milestone={activeMilestone}
        onClose={() => setActiveMilestone(null)}
      />
    </div>
  );
};
