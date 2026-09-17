import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { SupportedLanguage } from '../i18n/types';

export const LanguageDropdown: React.FC = () => {
  const { currentLang, setLang, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = languages.find((l) => l.code === currentLang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="liquid-glass rounded-full px-2.5 sm:px-3 py-1.5 flex items-center space-x-1.5 text-xs font-mono text-stone-200 hover:text-white hover:bg-white/10 transition-all border border-amber-400/25 whitespace-nowrap flex-shrink-0 select-none"
        title="Switch Language / 切换语言"
      >
        <span className="text-sm flex-shrink-0">{currentOption.flag}</span>
        <span className="font-semibold whitespace-nowrap">{currentOption.code.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3 text-stone-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 liquid-glass-strong rounded-2xl p-1.5 shadow-2xl border border-amber-400/40 z-50 animate-in fade-in duration-150 backdrop-blur-xl glass-sheen">
          <div className="px-3 py-1.5 text-[10px] font-mono text-amber-300 uppercase tracking-wider border-b border-white/10 mb-1 flex items-center space-x-1">
            <Globe className="w-3 h-3" />
            <span>Select Language</span>
          </div>

          <div className="space-y-0.5">
            {languages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLang(lang.code as SupportedLanguage);
                    setIsOpen(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'liquid-glass-amber text-amber-200 font-semibold'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span className="font-medium">{lang.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
