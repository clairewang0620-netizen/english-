
import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { useTTS } from '../hooks/useTTS';

interface WordCardModalProps {
  word: Word;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const WordCardModal: React.FC<WordCardModalProps> = ({ 
  word, 
  onClose, 
  onPrev, 
  onNext, 
  hasPrev, 
  hasNext 
}) => {
  const { speak } = useTTS();
  const [isReinforced, setIsReinforced] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('reinforce-ids');
    const ids = saved ? JSON.parse(saved) : [];
    setIsReinforced(ids.includes(word.id));
    speak(word.text, { rate: 0.9 });
  }, [word]);

  const toggleReinforce = () => {
    const saved = localStorage.getItem('reinforce-ids');
    let ids = saved ? JSON.parse(saved) : [];
    if (isReinforced) {
      ids = ids.filter((id: string) => id !== word.id);
    } else {
      ids.push(word.id);
    }
    localStorage.setItem('reinforce-ids', JSON.stringify(ids));
    setIsReinforced(!isReinforced);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
      <header className="p-4 border-b flex items-center justify-between">
        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
          <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">学习卡片</span>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-50 p-8 flex flex-col items-center text-center">
          <div className="mb-6">
            <h2 className="text-3xl font-normal text-slate-900 mb-2 tracking-tight">{word.text}</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-400 font-sans text-sm lowercase">{word.phonetic}</span>
              <span className="text-slate-300 text-[10px] font-medium italic lowercase">{word.pos.toLowerCase()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <button 
              onClick={() => speak(word.text)}
              className="p-3 bg-green-500 text-white rounded-full shadow-lg active:scale-90 transition-transform"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            </button>
            <button 
              onClick={toggleReinforce}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${isReinforced ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
            >
              <span className="text-xs">{isReinforced ? '★' : '☆'}</span>
              加强记忆
            </button>
          </div>

          <div className="w-full space-y-8 text-left border-t border-slate-50 pt-8">
            <section>
              <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">释义</h3>
              <p className="text-lg font-medium text-slate-700 leading-snug mb-1">{word.chinese}</p>
              <p className="text-xs text-slate-500 leading-relaxed font-normal italic opacity-80">{word.definition}</p>
            </section>

            <section>
              <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4">双语例句</h3>
              <div className="space-y-4">
                {word.examples.map((ex, i) => (
                  <div key={i} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                    <div className="flex justify-between items-start gap-3">
                      <p className="text-slate-600 text-sm font-normal leading-relaxed flex-1">{ex.en}</p>
                      <button onClick={() => speak(ex.en)} className="p-1.5 text-slate-300 hover:text-slate-500 active:scale-90">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-slate-400 font-medium mt-1.5 text-[11px] leading-relaxed">{ex.cn}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <footer className="p-4 bg-white flex justify-between gap-4 max-w-md mx-auto w-full mb-6">
        <button 
          onClick={onPrev}
          disabled={!hasPrev}
          className={`flex-1 py-3 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${hasPrev ? 'bg-slate-100 text-slate-600 active:scale-95' : 'bg-transparent text-slate-100'}`}
        >
          {hasPrev ? '上一个' : ''}
        </button>
        <button 
          onClick={onNext}
          disabled={!hasNext}
          className={`flex-1 py-3 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${hasNext ? 'bg-green-500 text-white shadow-lg active:scale-95' : 'bg-transparent text-slate-100'}`}
        >
          {hasNext ? '下一个' : ''}
        </button>
      </footer>
    </div>
  );
};
