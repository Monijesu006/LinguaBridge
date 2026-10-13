import React, { useState } from 'react';
import { Volume2, Split, Grid, CheckCircle2, Sparkles } from 'lucide-react';
import { speakText, soundEffects } from '../../utils/audio';

export const GermanicEngine: React.FC = () => {
  // Case trigger state
  const [selectedTrigger, setSelectedTrigger] = useState<'subject' | 'akkusativ_verb' | 'dativ_prep' | 'genitiv_prep'>('dativ_prep');

  // Compound word deconstructor active item
  const [selectedCompoundIndex, setSelectedCompoundIndex] = useState<number>(0);
  const [isSplit, setIsSplit] = useState<boolean>(true);

  const COMPOUND_WORDS = [
    {
      word: 'Naturwissenschaften',
      translation: 'Natural sciences',
      parts: [
        { text: 'Natur', literal: 'Nature', part: 'Noun (f.)' },
        { text: 'Wissenschaften', literal: 'Knowledge / Sciences', part: 'Noun (f. pl)' },
      ],
      explanation: 'German builds high-precision academic terms by compounding root nouns without spaces.',
    },
    {
      word: 'Handschuh',
      translation: 'Glove',
      parts: [
        { text: 'Hand', literal: 'Hand', part: 'Noun (f.)' },
        { text: 'Schuh', literal: 'Shoe', part: 'Noun (m.)' },
      ],
      explanation: 'Literally a "shoe for the hand". Notice the gender follows the FINAL noun: der Handschuh (from der Schuh).',
    },
    {
      word: 'Kühlschrank',
      translation: 'Refrigerator',
      parts: [
        { text: 'Kühl', literal: 'Cool / Chilled', part: 'Adjective' },
        { text: 'Schrank', literal: 'Cupboard / Cabinet', part: 'Noun (m.)' },
      ],
      explanation: 'Literally a "cooling cupboard". Gender: der Kühlschrank (from der Schrank).',
    },
    {
      word: 'Flugzeug',
      translation: 'Airplane',
      parts: [
        { text: 'Flug', literal: 'Flight', part: 'Noun (m.)' },
        { text: 'Zeug', literal: 'Stuff / Gear / Tool', part: 'Noun (n.)' },
      ],
      explanation: 'Literally "flight-gear" or "flying tool". Gender: das Flugzeug (from das Zeug).',
    },
    {
      word: 'Straßenbahn',
      translation: 'Streetcar / Tram',
      parts: [
        { text: 'Straße(n)', literal: 'Street', part: 'Noun (f.)' },
        { text: 'Bahn', literal: 'Rail / Track', part: 'Noun (f.)' },
      ],
      explanation: 'Literally a "street railway". Gender: die Straßenbahn.',
    },
  ];

  const currentCompound = COMPOUND_WORDS[selectedCompoundIndex];

  // Cases grid mapping
  const CASE_GRID = [
    {
      caseName: 'Nominativ',
      role: 'Subject (Wer oder was?)',
      masc: 'der',
      fem: 'die',
      neut: 'das',
      plural: 'die',
      activeOn: selectedTrigger === 'subject',
    },
    {
      caseName: 'Akkusativ',
      role: 'Direct Object / Motion (Wen oder was?)',
      masc: 'den',
      fem: 'die',
      neut: 'das',
      plural: 'die',
      activeOn: selectedTrigger === 'akkusativ_verb',
    },
    {
      caseName: 'Dativ',
      role: 'Indirect Object / Location / Preps: mit, bei, nach (Wem?)',
      masc: 'dem',
      fem: 'der',
      neut: 'dem',
      plural: 'den (+n)',
      activeOn: selectedTrigger === 'dativ_prep',
    },
    {
      caseName: 'Genitiv',
      role: 'Possession / Preps: wegen, während, trotz (Wessen?)',
      masc: 'des (+s)',
      fem: 'der',
      neut: 'des (+s)',
      plural: 'der',
      activeOn: selectedTrigger === 'genitiv_prep',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 4 German Cases & Declension Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide uppercase">
                A1 → B1 Foundation
              </span>
              <h3 className="text-xl font-bold text-white">Cases & Declension Matrix (Die 4 Fälle)</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Select a grammatical trigger to watch how definite articles dynamically shift across gender and case.
            </p>
          </div>

          <button
            onClick={() => {
              const phrase = selectedTrigger === 'dativ_prep' ? 'Ich fahre mit dem Zug.' : 'Ich sehe den Hund.';
              speakText(phrase, 'de');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            Listen Trigger
          </button>
        </div>

        {/* Trigger Selection Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { id: 'subject' as const, label: 'Subject (Wer?)', example: 'Der Hund schläft.' },
            { id: 'akkusativ_verb' as const, label: 'Akkusativ (sehen, kaufen)', example: 'Ich sehe den Hund.' },
            { id: 'dativ_prep' as const, label: 'Dativ (mit, bei, helfen)', example: 'Ich helfe dem Mann.' },
            { id: 'genitiv_prep' as const, label: 'Genitiv (wegen, des)', example: 'Wegen des Regens...' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setSelectedTrigger(t.id); soundEffects.playSnap(); }}
              className={`p-3 rounded-xl text-left border transition ${
                selectedTrigger === t.id
                  ? 'bg-amber-950/60 border-amber-500 shadow'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white">{t.label}</div>
              <div className="text-[11px] text-amber-400 font-mono mt-1">{t.example}</div>
            </button>
          ))}
        </div>

        {/* Live Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Case (Fall)</th>
                <th className="py-3 px-4 text-blue-400">Maskulin (♂)</th>
                <th className="py-3 px-4 text-rose-400">Feminin (♀)</th>
                <th className="py-3 px-4 text-emerald-400">Neutral (⚲)</th>
                <th className="py-3 px-4 text-purple-400">Plural (👥)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {CASE_GRID.map((cg) => (
                <tr
                  key={cg.caseName}
                  className={`transition ${
                    cg.activeOn ? 'bg-amber-950/40 font-bold text-white' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <td className="py-3.5 px-4 flex flex-col">
                    <span className="font-semibold text-white">{cg.caseName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{cg.role}</span>
                  </td>
                  <td className={`py-3.5 px-4 font-mono ${cg.activeOn ? 'text-amber-400 text-base underline' : 'text-blue-300'}`}>
                    {cg.masc}
                  </td>
                  <td className={`py-3.5 px-4 font-mono ${cg.activeOn ? 'text-amber-400 text-base underline' : 'text-rose-300'}`}>
                    {cg.fem}
                  </td>
                  <td className={`py-3.5 px-4 font-mono ${cg.activeOn ? 'text-amber-400 text-base underline' : 'text-emerald-300'}`}>
                    {cg.neut}
                  </td>
                  <td className={`py-3.5 px-4 font-mono ${cg.activeOn ? 'text-amber-400 text-base underline' : 'text-purple-300'}`}>
                    {cg.plural}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compound Word Deconstructor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase">
                Vocabulary Demystifier
              </span>
              <h3 className="text-xl font-bold text-white">Compound Word Deconstructor (Komposita-Zerleger)</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Tap to split mammoth German compound nouns into digestible atomic components.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setIsSplit(!isSplit); soundEffects.playSnap(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition"
            >
              <Split className="w-4 h-4 text-emerald-400" />
              {isSplit ? 'Fuse Word' : 'Split Components'}
            </button>
            <button
              onClick={() => speakText(currentCompound.word, 'de')}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Word Carousel Selectors */}
        <div className="flex flex-wrap gap-2 mb-6">
          {COMPOUND_WORDS.map((cw, idx) => (
            <button
              key={cw.word}
              onClick={() => { setSelectedCompoundIndex(idx); soundEffects.playSnap(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCompoundIndex === idx
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cw.word}
            </button>
          ))}
        </div>

        {/* Interactive Deconstructed Display */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            {isSplit ? (
              currentCompound.parts.map((p, i) => (
                <React.Fragment key={p.text}>
                  <div
                    onClick={() => speakText(p.text, 'de')}
                    className="flex flex-col items-center p-4 bg-slate-900 border border-emerald-500/40 rounded-xl hover:border-emerald-400 cursor-pointer transition shadow-md"
                  >
                    <span className="text-2xl font-black text-white">{p.text}</span>
                    <span className="text-xs text-emerald-400 font-semibold mt-1">"{p.literal}"</span>
                    <span className="text-[10px] text-slate-500">{p.part}</span>
                  </div>
                  {i < currentCompound.parts.length - 1 && (
                    <span className="text-2xl font-bold text-slate-600">+</span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="text-3xl md:text-4xl font-black text-white tracking-wide">
                {currentCompound.word}
              </div>
            )}
          </div>

          <div className="border-t border-slate-800/80 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm">
            <div>
              <span className="text-xs uppercase text-slate-400 font-semibold block">Full Translation</span>
              <span className="text-lg font-bold text-emerald-400">{currentCompound.translation}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              💡 {currentCompound.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
