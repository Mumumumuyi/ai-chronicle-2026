import { Terminal, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#060709] py-12 px-4 sm:px-6 font-mono text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-slate-200 font-bold tracking-wider uppercase">
              AI CHRONICLE · 2026.09.13 历史定本
            </div>
            <div className="text-[10px] text-slate-500">
              普罗米修斯的火种与硅基奇点：人工智能演进全景通史
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[11px]">
          <span className="flex items-center text-slate-400">
            <Shield className="w-3 h-3 mr-1 text-[#00F0FF]" />
            遵循 AI 第二大脑反AI味设计基准
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500">
            运行时: React 18 + Vite 6 + Tailwind CSS
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">
            VERIFIED: 2026-09-13
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-slate-600 text-[10px]">
        “我们不仅见证了历史，我们正站在奇点的事件视界上参与创造历史。”
      </div>
    </footer>
  );
};
