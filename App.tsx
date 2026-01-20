
import React, { useState } from 'react';
import { PageType } from './types';
import { WordLearn } from './pages/WordLearn';
import { Dictation } from './pages/Dictation';
import { Reading } from './pages/Reading';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.HOME);

  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (currentPage === PageType.LEARN) {
    return <WordLearn onBack={() => navigateTo(PageType.HOME)} />;
  }

  if (currentPage === PageType.DICTATION) {
    return <Dictation onBack={() => navigateTo(PageType.HOME)} />;
  }

  if (currentPage === PageType.READING) {
    return <Reading onBack={() => navigateTo(PageType.HOME)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Dashboard Container */}
      <div className="max-w-4xl w-full px-6 py-12 md:py-20">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                AceEnglish <span className="text-indigo-600">Pro</span>
              </h1>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight">
              Welcome back, <span className="text-slate-400">Learner</span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 font-medium">
              Ready to master 20 more words today?
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex bg-white px-6 py-4 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 gap-8">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">STREAK</p>
              <p className="text-xl font-black text-slate-800">12 Days</p>
            </div>
            <div className="w-px bg-slate-100"></div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">WORDS</p>
              <p className="text-xl font-black text-slate-800">1,240</p>
            </div>
          </div>
        </header>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card: Word Library */}
          <button 
            onClick={() => navigateTo(PageType.LEARN)}
            className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left hover:scale-[1.02] active:scale-95 transition-all flex flex-col justify-between h-full"
          >
            <div>
              <div className="inline-block p-4 bg-indigo-50 text-indigo-600 rounded-3xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Word Library</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Smart flashcards and group-based learning pathways.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
              Explore Library
              <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Card: Dictation */}
          <button 
            onClick={() => navigateTo(PageType.DICTATION)}
            className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left hover:scale-[1.02] active:scale-95 transition-all flex flex-col justify-between h-full"
          >
            <div>
              <div className="inline-block p-4 bg-teal-50 text-teal-600 rounded-3xl mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Dictation</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Challenge your listening and spelling with AI feedback.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-teal-600 font-black text-xs uppercase tracking-widest">
              Start Practice
              <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Card: Journal Reading */}
          <button 
            onClick={() => navigateTo(PageType.READING)}
            className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-left hover:scale-[1.02] active:scale-95 transition-all flex flex-col justify-between h-full"
          >
            <div>
              <div className="inline-block p-4 bg-amber-50 text-amber-600 rounded-3xl mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">Reading</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Daily curated articles with translation and shadowing.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-widest">
              Read Today
              <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
              </svg>
            </div>
          </button>

        </div>

        {/* Footer info */}
        <footer className="mt-20 text-center">
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">
            © 2024 ACEENGLISH PRO SAAS • BUILT FOR SUCCESS
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;
