
import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { WORDS, GROUPS, CATEGORIES } from '../data';
import { Word } from '../types';
import { WordCardModal } from './WordCardModal';
import { useTTS } from '../hooks/useTTS';

interface WordLearnProps {
  onBack: () => void;
}

export const WordLearn: React.FC<WordLearnProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'group' | 'category' | 'reinforce'>('group');
  const [selectedGroupId, setSelectedGroupId] = useState<string>(GROUPS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [reinforceIds, setReinforceIds] = useState<string[]>([]);
  const { speak } = useTTS();

  useEffect(() => {
    const saved = localStorage.getItem('reinforce-ids');
    if (saved) setReinforceIds(JSON.parse(saved));
  }, []);

  const filteredWords = useMemo(() => {
    if (activeTab === 'reinforce') {
      return WORDS.filter(w => reinforceIds.includes(w.id));
    }
    if (activeTab === 'group') {
      const group = GROUPS.find(g => g.id === selectedGroupId);
      return WORDS.filter(w => group?.words.includes(w.id));
    } else {
      if (!selectedCategory) return [];
      const mapping: Record<string, string> = {
        '大学英语四级': 'CET-4', '大学英语六级': 'CET-6', '专四': 'TEM-4', '专八': 'TEM-8',
        '雅思': 'IELTS', '商务英语': 'Business', '金融': 'Finance', '科技': 'Tech', '文化': 'Culture', '社交': 'Social'
      };
      const catKey = mapping[selectedCategory] || selectedCategory;
      return WORDS.filter(w => w.categories.includes(catKey) || w.categories.includes(selectedCategory));
    }
  }, [activeTab, selectedGroupId, selectedCategory, reinforceIds]);

  return (
    <Layout title="词库学习" onBack={onBack}>
      <div className="flex bg-slate-200 p-1 rounded-2xl mb-6 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('group')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'group' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'}`}
        >
          分组
        </button>
        <button 
          onClick={() => setActiveTab('category')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'category' ? 'bg-white shadow-sm text-green-600' : 'text-slate-500'}`}
        >
          分类
        </button>
        <button 
          onClick={() => setActiveTab('reinforce')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${activeTab === 'reinforce' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          ★ 记忆集
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {activeTab !== 'reinforce' && (
          <aside className="md:w-48 flex-shrink-0">
            <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto max-h-[70vh] gap-2 pb-2 md:pb-0 scrollbar-hide">
              {(activeTab === 'group' ? GROUPS : CATEGORIES).map(item => {
                const id = typeof item === 'string' ? item : item.id;
                const title = typeof item === 'string' ? item : item.title;
                const isSelected = activeTab === 'group' ? selectedGroupId === id : selectedCategory === title;
                
                return (
                  <button
                    key={id}
                    onClick={() => activeTab === 'group' ? setSelectedGroupId(id) : setSelectedCategory(title)}
                    className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${isSelected ? 'bg-green-600 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                  >
                    {title}
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        <div className="flex-1 space-y-2">
          {filteredWords.length > 0 ? (
            filteredWords.map((word, index) => (
              <div 
                key={word.id} 
                className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer"
                onClick={() => setActiveWordIndex(index)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base font-normal text-slate-800 tracking-tight">{word.text}</span>
                    <span className="text-[10px] text-slate-400 font-sans lowercase opacity-60">{word.phonetic.toLowerCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span className="italic lowercase opacity-70">{word.pos.toLowerCase()}</span>
                    <span className="opacity-20">•</span>
                    <span className="line-clamp-1">{word.chinese}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(word.text);
                  }}
                  className="p-2.5 text-slate-300 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all active:scale-90"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
              <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">暂无内容</p>
            </div>
          )}
        </div>
      </div>

      {activeWordIndex !== null && filteredWords[activeWordIndex] && (
        <WordCardModal 
          word={filteredWords[activeWordIndex]} 
          onClose={() => {
            setActiveWordIndex(null);
            const saved = localStorage.getItem('reinforce-ids');
            if (saved) setReinforceIds(JSON.parse(saved));
          }} 
          onPrev={() => setActiveWordIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
          onNext={() => setActiveWordIndex(prev => (prev !== null && prev < filteredWords.length - 1 ? prev + 1 : prev))}
          hasPrev={activeWordIndex > 0}
          hasNext={activeWordIndex < filteredWords.length - 1}
        />
      )}
    </Layout>
  );
};
