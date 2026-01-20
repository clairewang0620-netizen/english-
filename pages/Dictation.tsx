
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { WORDS, GROUPS } from '../data';
import { Word } from '../types';
import { useTTS } from '../hooks/useTTS';

interface DictationProps {
  onBack: () => void;
}

export const Dictation: React.FC<DictationProps> = ({ onBack }) => {
  const [view, setView] = useState<'menu' | 'test' | 'mistakes'>('menu');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'success' | 'fail'>('none');
  const [showHint, setShowHint] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>(() => {
    const saved = localStorage.getItem('mistake-ids');
    return saved ? JSON.parse(saved) : [];
  });
  
  const { speak } = useTTS();

  const activeWordList = useMemo(() => {
    if (view === 'test' && selectedGroupId) {
      const group = GROUPS.find(g => g.id === selectedGroupId);
      return WORDS.filter(w => group?.words.includes(w.id));
    }
    if (view === 'mistakes') {
      return WORDS.filter(w => mistakes.includes(w.id));
    }
    return [];
  }, [view, selectedGroupId, mistakes]);

  const currentWord = activeWordList[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < activeWordList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setFeedback('none');
      setShowHint(false);
    } else {
      setView('menu');
    }
  }, [currentIndex, activeWordList]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || feedback !== 'none') return;

    if (userInput.trim().toLowerCase() === currentWord.text.toLowerCase()) {
      setFeedback('success');
      setTimeout(handleNext, 1500);
    } else {
      setFeedback('fail');
      if (!mistakes.includes(currentWord.id)) {
        const newMistakes = [...mistakes, currentWord.id];
        setMistakes(newMistakes);
        localStorage.setItem('mistake-ids', JSON.stringify(newMistakes));
      }
    }
  };

  if (view === 'menu') {
    return (
      <Layout title="单词听写" onBack={onBack}>
        <div className="space-y-6">
          <button 
            onClick={() => setView('mistakes')}
            className="w-full bg-red-50 p-6 rounded-3xl flex items-center justify-between border border-red-100 hover:bg-red-100 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-3 rounded-2xl text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-black text-red-900">错题强化</h3>
                <p className="text-red-400 text-[9px] font-black uppercase tracking-widest">{mistakes.length} 个单词</p>
              </div>
            </div>
            <svg className="h-5 w-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {GROUPS.map(g => (
              <button
                key={g.id}
                onClick={() => { setSelectedGroupId(g.id); setView('test'); setCurrentIndex(0); setUserInput(''); setFeedback('none'); setShowHint(false); }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all text-left"
              >
                <h3 className="text-sm font-black text-slate-800 mb-0.5">组 {g.id.replace('g', '')}</h3>
                <p className="text-slate-400 font-bold text-[9px] uppercase tracking-widest">{g.words.length} 词</p>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (view === 'mistakes') {
    return (
      <Layout title="错题复习" onBack={() => setView('menu')}>
        <div className="space-y-2">
          {activeWordList.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-100"><p className="text-slate-300 text-xs font-bold uppercase tracking-widest">暂无错题</p></div>
          ) : (
            activeWordList.map(word => (
              <div key={word.id} className="bg-white px-4 py-3 rounded-2xl border border-slate-50 flex items-center justify-between shadow-sm">
                <div>
                  <h3 className="text-base font-normal text-slate-800 tracking-tight">{word.text}</h3>
                  <p className="text-slate-400 text-xs">{word.chinese}</p>
                </div>
                <button onClick={() => speak(word.text)} className="p-2.5 text-slate-300 hover:text-green-500 bg-slate-50 rounded-xl">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`听写训练 ${currentIndex + 1}/${activeWordList.length}`} onBack={() => setView('menu')}>
      <div className="flex flex-col items-center py-8 max-w-md mx-auto">
        <button 
          onClick={() => speak(currentWord.text, { rate: 0.8 })}
          className="w-24 h-24 bg-green-500 text-white rounded-full shadow-xl shadow-green-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all mb-10"
        >
          <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <input
            autoFocus
            autoComplete="off"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={feedback !== 'none'}
            placeholder="键入拼写..."
            className={`w-full text-center py-5 px-4 text-3xl font-normal rounded-2xl border-2 outline-none transition-all ${
              feedback === 'success' ? 'border-green-500 text-green-600 bg-green-50' : 
              feedback === 'fail' ? 'border-red-500 text-red-600 bg-red-50' : 
              'border-slate-100 bg-white focus:border-green-500'
            }`}
          />

          <div className="min-h-[140px] flex flex-col items-center">
            {feedback === 'success' && <div className="text-3xl font-black text-green-600 animate-bounce">Bravo! 👏</div>}
            
            {feedback === 'fail' && (
              <div className="text-center animate-in fade-in zoom-in space-y-4">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-red-50">
                  <p className="text-[9px] font-black text-red-300 uppercase tracking-widest mb-1">正确答案</p>
                  <p className="text-4xl font-normal text-slate-800 tracking-tight">{currentWord.text}</p>
                  <p className="text-sm font-bold text-slate-400 mt-1">{currentWord.chinese}</p>
                </div>
                <button onClick={handleNext} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest">下一词 →</button>
              </div>
            )}

            {feedback === 'none' && (
              <div className="w-full flex flex-col items-center gap-4">
                {showHint ? (
                  <p className="text-base font-bold text-slate-500 animate-in fade-in">{currentWord.chinese}</p>
                ) : (
                  <button type="button" onClick={() => setShowHint(true)} className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-200 pb-0.5">显示中文提示</button>
                )}
                <div className="flex gap-3 w-full pt-4">
                  <button type="submit" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">检查</button>
                  <button type="button" onClick={handleNext} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">跳过</button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};
