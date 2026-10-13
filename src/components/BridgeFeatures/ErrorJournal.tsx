import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, ArrowRight, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { ErrorJournalEntry, LanguageCode } from '../../types';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface ErrorJournalProps {
  entries: ErrorJournalEntry[];
  language: LanguageCode;
  onDrillCompleted?: (xp: number) => void;
}

export const ErrorJournal: React.FC<ErrorJournalProps> = ({ entries, language, onDrillCompleted }) => {
  const [selectedEntryIndex, setSelectedEntryIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const entry = entries[selectedEntryIndex];

  if (!entry) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        No recurrent errors recorded for this language yet! Keep practicing.
      </div>
    );
  }

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    soundEffects.playSnap();
    setSelectedAnswerIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerIndex === null) return;
    setIsAnswerSubmitted(true);

    if (selectedAnswerIndex === entry.drillCorrectIndex) {
      soundEffects.playSuccess();
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      if (onDrillCompleted) onDrillCompleted(25);
    }
  };

  const handleReset = () => {
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
              Error Diagnosis Journal
            </span>
            <span className="text-xs text-slate-400">Metacognitive Pattern Analysis</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Targeted 2-Minute Remedial Drills</h2>
        </div>

        <div className="flex items-center gap-2">
          {entries.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedEntryIndex(idx);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedEntryIndex === idx
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Pattern #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Mistake Pattern Summary Card */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase font-semibold text-rose-400">Recurring Blindspot</span>
            <h3 className="text-xl font-extrabold text-white">{entry.mistakePattern}</h3>
            <span className="text-xs text-slate-400">Logged {entry.frequency} times during exercises</span>
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            {entry.category}
          </span>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-xl border border-slate-800/80">
          <span className="font-bold text-rose-300">Why it happens: </span>
          {entry.whyItHappens}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Common Pitfall:</span>
            <span className="text-rose-200 line-through">{entry.exampleBad}</span>
          </div>
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Target Native Usage:</span>
            <span className="text-emerald-200 font-semibold">{entry.exampleGood}</span>
          </div>
        </div>
      </div>

      {/* Targeted 2-Minute Drill */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            Instant Active Recall Drill
          </h4>

          {isAnswerSubmitted && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry Drill
            </button>
          )}
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-base font-bold text-white">
          {entry.drillQuestion}
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {entry.drillOptions.map((opt, idx) => {
            let optionStyle = 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200';
            if (selectedAnswerIndex === idx) {
              optionStyle = 'bg-slate-800 border-rose-500 text-white shadow';
            }
            if (isAnswerSubmitted) {
              if (idx === entry.drillCorrectIndex) {
                optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
              } else if (selectedAnswerIndex === idx) {
                optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
              }
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelectOption(idx)}
                className={`p-3.5 rounded-xl border text-left text-sm transition flex items-center justify-between ${optionStyle}`}
              >
                <span>{opt}</span>
                {isAnswerSubmitted && idx === entry.drillCorrectIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswerSubmitted && selectedAnswerIndex === idx && idx !== entry.drillCorrectIndex && (
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {!isAnswerSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswerIndex === null}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-sm transition shadow-lg shadow-rose-500/20 active:scale-95"
          >
            Submit Answer
          </button>
        ) : (
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 animate-fadeIn">
            <span className="text-xs uppercase font-bold text-slate-400">Diagnosis Feedback</span>
            <p className="text-xs text-slate-300 leading-relaxed">{entry.drillExplanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
