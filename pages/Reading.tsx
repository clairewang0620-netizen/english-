
import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { ARTICLES } from '../data';
import { Article } from '../types';
import { useTTS } from '../hooks/useTTS';

interface ReadingProps {
  onBack: () => void;
}

export const Reading: React.FC<ReadingProps> = ({ onBack }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showTrans, setShowTrans] = useState<Record<number, boolean>>({});
  const [ttsRate, setTtsRate] = useState(1.0);
  const [recordings, setRecordings] = useState<Record<number, string>>({});
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { speak } = useTTS();

  const toggleTrans = (idx: number) => {
    setShowTrans(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const startShadowing = async (idx: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordings(prev => ({ ...prev, [idx]: url }));
      };

      setRecordingIndex(idx);
      mediaRecorder.start();
      
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setRecordingIndex(null);
          stream.getTracks().forEach(track => track.stop());
        }
      }, 8000);

    } catch (err) {
      console.error("Recording error:", err);
      alert("Microphone permission denied.");
    }
  };

  const playRecording = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  if (!selectedArticle) {
    return (
      <Layout title="Curated Reading" onBack={onBack}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          {ARTICLES.map(article => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left flex flex-col"
            >
              <div className="h-44 w-full overflow-hidden relative">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  {article.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight tracking-tight">{article.title}</h3>
                  <p className="text-slate-500 font-medium text-xs leading-relaxed line-clamp-2">{article.summary}</p>
                </div>
                <div className="mt-4 flex items-center justify-end">
                  <span className="bg-slate-50 group-hover:bg-green-500 group-hover:text-white text-slate-400 p-2 rounded-xl transition-colors">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title={selectedArticle.title} 
      onBack={() => setSelectedArticle(null)}
      actions={
        <div className="flex bg-slate-100 rounded-xl p-1 shadow-inner">
          {[0.6, 1.0, 1.4].map(rate => (
            <button
              key={rate}
              onClick={() => setTtsRate(rate)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${ttsRate === rate ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {rate === 0.6 ? 'Slow' : rate === 1.0 ? 'Normal' : 'Fast'}
            </button>
          ))}
        </div>
      }
    >
      <div className="max-w-2xl mx-auto space-y-12 pb-32">
        <header className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">{selectedArticle.title}</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => speak(selectedArticle.paragraphs.map(p => p.en).join(' '), { rate: ttsRate })}
              className="bg-green-500 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg shadow-green-100"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
              Read Full Text
            </button>
          </div>
        </header>

        {selectedArticle.paragraphs.map((para, idx) => (
          <section key={idx} className="flex gap-6 items-start">
            <div className="flex-1">
              <p className="text-xl text-slate-700 leading-relaxed font-medium selection:bg-green-100 selection:text-green-900">
                {para.en}
              </p>
              
              {showTrans[idx] && (
                <div className="mt-4 p-6 bg-slate-50/50 rounded-2xl border-l-4 border-green-500 animate-in fade-in slide-in-from-left duration-300">
                  <p className="text-slate-600 font-bold leading-relaxed">{para.cn}</p>
                </div>
              )}
              
              {recordings[idx] && (
                <div className="mt-4 flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100 w-fit animate-in zoom-in duration-300">
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Done!</span>
                  <button 
                    onClick={() => playRecording(recordings[idx])}
                    className="flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Play My Voice
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0 sticky top-24 pt-1">
              <button 
                onClick={() => speak(para.en, { rate: ttsRate })}
                className="p-2.5 bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition-colors"
                title="Speak"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
              </button>
              
              <button 
                onClick={() => toggleTrans(idx)}
                className={`p-2.5 rounded-xl border transition-all ${showTrans[idx] ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                title="Translate"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </button>

              <button 
                onClick={() => startShadowing(idx)}
                disabled={recordingIndex !== null}
                className={`p-2.5 rounded-xl border transition-all ${recordingIndex === idx ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-white text-slate-400 border-slate-100 hover:text-green-500 hover:border-green-200'}`}
                title="Shadowing"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>
          </section>
        ))}

        <footer className="pt-16 border-t border-slate-100">
          <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">Key Terminology</h3>
          <div className="flex flex-wrap gap-3">
            {selectedArticle.keywords.map((kw, i) => (
              <button 
                key={i}
                onClick={() => speak(kw.text)}
                className="bg-white px-4 py-2.5 rounded-2xl border border-slate-50 shadow-sm flex flex-col items-center group active:scale-95 transition-all"
              >
                <span className="text-slate-800 font-bold group-hover:text-green-600 text-sm">{kw.text}</span>
                <span className="text-slate-400 font-bold text-[9px]">{kw.cn}</span>
              </button>
            ))}
          </div>
        </footer>
      </div>
    </Layout>
  );
};
