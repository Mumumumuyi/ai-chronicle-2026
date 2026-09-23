export type ParadigmType = 
  | 'Symbolism'       // 符号主义 / 逻辑推理
  | 'Connectionism'   // 连接主义 / 神经网络
  | 'Statistical'     // 统计学习 / 凸优化与概率图
  | 'DeepLearning'    // 深度表征学习 / 反向传播与算力红利
  | 'FoundationModel' // 基础大模型 / 规模法则与自监督
  | 'AgenticSystem';  // 系统二推理与自主智能体集群 (2024-2026)

export type MilestoneCategory = 
  | 'theory' 
  | 'algorithm' 
  | 'compute' 
  | 'industry' 
  | 'geopolitics' 
  | 'breakthrough' 
  | 'debate';

export interface Milestone {
  id: string;
  /** URL slug for the standalone dossier page: /milestone/<slug>/ */
  slug: string;
  year: number | string;
  exactDate?: string;
  title: string;
  subtitle: string;
  epochId: string;
  category: MilestoneCategory;
  paradigm: ParadigmType;
  summary: string;
  fullNarrative: string;
  keyFigures: string[];
  landmarkPaperOrArtifact?: string;
  computeCostEstimate?: string;
  historicalImpact: string; // 深度评述
  tags: string[];
}

export interface Epoch {
  id: string;
  romanId: string;
  era: string;
  title: string;
  subtitle: string;
  summary: string;
  dominantParadigm: ParadigmType;
  accentColor: string;
  computeOrderOfMagnitude: string; // e.g. "10^0 FLOPs" to "10^26 FLOPs"
  milestones: Milestone[];
  philosophicalTension: string; // 本纪元的核心哲学/技术争论
  epigraph: {
    quote: string;
    author: string;
    source: string;
  };
}

export interface ArticleChapter {
  id: string;
  chapterNumber: string;
  title: string;
  timeSpan: string;
  leadQuote: {
    text: string;
    attribution: string;
  };
  introParagraph: string;
  sections: {
    subtitle: string;
    content: string[];
    highlightInsight?: string;
    archivalReference?: string;
  }[];
}

export interface ParadigmComparisonItem {
  dimension: string;
  symbolism: string;
  connectionism: string;
  statistical: string;
  llm: string;
  agentic2026: string;
}
