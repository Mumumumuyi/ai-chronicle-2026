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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase text-[#A8A29E] hover:text-gold2 transition-colors border border-transparent hover:border-[#44403C] whitespace-nowrap select-none"
        title="Switch Language / 切换语言"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none flex-shrink-0">{currentOption.flag}</span>
        <span>{currentOption.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 text-[#78716C] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-ob2 border border-[#44403C] rounded-md p-1.5 z-50 anim-fade shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <div className="px-3 py-2 text-[10px] font-mono text-gold uppercase tracking-[0.2em] border-b border-[#292524] mb-1 flex items-center gap-1.5">
            <Globe className="w-3 h-3" />
            <span>Select Language</span>
          </div>

          <div>
            {languages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLang(lang.code as SupportedLanguage);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-xs flex items-center justify-between transition-colors border-l-2 ${
                    isSelected
                      ? 'border-gold text-gold2 bg-[rgba(201,168,106,0.08)]'
                      : 'border-transparent text-[#A8A29E] hover:text-pearl hover:bg-[rgba(244,241,234,0.04)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
