import React from 'react';
import { Volume2, CheckCircle, XCircle, Globe2, Sparkles, BookOpen } from 'lucide-react';
import { CulturalBriefing, LanguageCode } from '../../types';
import { speakText } from '../../utils/audio';

interface CulturalBriefingsProps {
  briefings: CulturalBriefing[];
  language: LanguageCode;
}

export const CulturalBriefings: React.FC<CulturalBriefingsProps> = ({ briefings, language }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              Real-World Cultural Briefings
            </span>
            <span className="text-xs text-slate-400">Sociolinguistic Context & Nuance</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Living the Language: Beyond Flat Grammar</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {briefings.map((briefing) => (
          <div key={briefing.id} className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-5 shadow-lg">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  {briefing.tag}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">{briefing.title}</h3>
              </div>

              <button
                onClick={() => speakText(briefing.audioDialogue, language, 0.9)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                Listen Cultural Phrase
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              {briefing.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                  <CheckCircle className="w-4 h-4" /> Recommended Etiquette (Do)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{briefing.doTip}</p>
              </div>

              <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase">
                  <XCircle className="w-4 h-4" /> Cultural Faux Pas (Avoid)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{briefing.avoidTip}</p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-amber-950/30 to-slate-900 rounded-xl border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Authentic Phrase:</span>
                <span className="text-amber-300 font-bold text-sm">"{briefing.audioDialogue}"</span>
                <span className="text-slate-400 ml-2">({briefing.audioTranslation})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
