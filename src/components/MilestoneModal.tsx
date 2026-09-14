import React from 'react';
import { Milestone } from '../types';
import { X, Calendar, User, Cpu, FileText, Award, Tag, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedMilestone } from '../data/timelineTranslations';

interface MilestoneModalProps {
  milestone: Milestone | null;
  onClose: () => void;
}

export const MilestoneModal: React.FC<MilestoneModalProps> = ({ milestone, onClose }) => {
  const { currentLang } = useLanguage();
  if (!milestone) return null;

  const m = getLocalizedMilestone(milestone, currentLang);
  const isZh = currentLang === 'zh';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto liquid-glass-strong rounded-3xl p-5 sm:p-8 text-stone-100 shadow-2xl border border-amber-400/30 glass-sheen"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-5 right-4 sm:right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Dossier Code & Date */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center text-[11px]">
            <Sparkles className="w-3 h-3 mr-1" />
            {m.id.toUpperCase()}
          </span>
          <span className="text-stone-400 flex items-center text-[11px]">
            <Calendar className="w-3.5 h-3.5 mr-1 text-amber-400" />
            {m.exactDate || m.year}
          </span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-300 text-[11px]">{isZh ? '范式' : 'Paradigm'}: {m.paradigm}</span>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl sm:text-3xl font-serif font-bold text-white mb-1.5 leading-snug">
          {m.title}
        </h2>
        <p className="text-xs sm:text-sm font-mono text-amber-300/90 mb-4">
          {m.subtitle}
        </p>

        {/* Info Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-4 font-mono text-xs">
          <div className="p-3 sm:p-3.5 rounded-2xl liquid-glass border border-white/10">
            <div className="text-stone-500 text-[10px] mb-1 flex items-center">
              <User className="w-3 h-3 mr-1 text-amber-400" />
              {isZh ? '关键奠基人' : 'Key Pioneers'}
            </div>
            <div className="text-stone-200 font-sans font-medium text-xs">
              {m.keyFigures.join(' · ')}
            </div>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl liquid-glass border border-white/10">
            <div className="text-stone-500 text-[10px] mb-1 flex items-center">
              <Cpu className="w-3 h-3 mr-1 text-amber-400" />
              {isZh ? '算力消耗与硬件环境' : 'Compute & Hardware'}
            </div>
            <div className="text-stone-200 font-mono text-xs">
              {m.computeCostEstimate || (isZh ? '文献未记录 / 理论推导' : 'Theoretical / Unrecorded')}
            </div>
          </div>
        </div>

        {/* Landmark Citation */}
        {m.landmarkPaperOrArtifact && (
          <div className="p-3 sm:p-3.5 rounded-2xl liquid-glass border border-white/10 mb-4 flex items-start space-x-2.5 text-xs">
            <FileText className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-mono text-[10px] text-stone-500">{isZh ? '经典文献 / 物理发明索引:' : 'Landmark Paper / Artifact:'}</div>
              <div className="text-stone-200 font-mono mt-0.5 italic text-xs">
                {m.landmarkPaperOrArtifact}
              </div>
            </div>
          </div>
        )}

        {/* Full Narrative */}
        <div className="mb-4">
          <h4 className="text-[11px] font-mono uppercase tracking-wider text-amber-300 mb-2">
            {isZh ? '历史叙事与技术突破' : 'Historical Narrative & Breakdown'}
          </h4>
          <div className="text-stone-300 text-xs sm:text-sm leading-relaxed space-y-2.5 font-light text-justify">
            {m.fullNarrative.split('\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </div>

        {/* Historical Impact */}
        <div className="p-3.5 sm:p-4 rounded-2xl liquid-glass border border-amber-400/30 mb-4 bg-amber-500/[0.04]">
          <div className="flex items-center text-xs font-mono text-amber-300 mb-1">
            <Award className="w-3.5 h-3.5 mr-1" />
            {isZh ? '历史地位裁决' : 'Historical Significance & Legacy'}
          </div>
          <p className="text-xs text-stone-200 leading-relaxed font-serif">
            {m.historicalImpact}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-white/10">
          <Tag className="w-3 h-3 text-stone-500 mr-1" />
          {m.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-mono text-stone-300 border border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
