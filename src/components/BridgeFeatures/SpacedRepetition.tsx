import React, { useState } from 'react';
import { Volume2, RotateCcw, Check, Flame, Award, Sparkles, BookOpen } from 'lucide-react';
import { SRSCard, LanguageCode } from '../../types';
import { speakText, soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface SpacedRepetitionProps {
  cards: SRSCard[];
  language: LanguageCode;
  onCardReviewed?: (cardId: string, ease: number) => void;
}

export const SpacedRepetition: React.FC<SpacedRepetitionProps> = ({ cards, language, onCardReviewed }) => {
  const [deck, setDeck] = useState<SRSCard[]>(cards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(7);
  const [sessionReviewed, setSessionReviewed] = useState<number>(0);

  const currentCard = deck[currentIndex];

  const handleFlip = () => {
    soundEffects.playSnap();
    setIsFlipped(!isFlipped);
  };

  const handleRateCard = (ratingMultiplier: number) => {
    soundEffects.playSnap();
    const nextIndex = currentIndex + 1;
    setSessionReviewed((prev) => prev + 1);

    if (onCardReviewed && currentCard) {
      onCardReviewed(currentCard.id, ratingMultiplier);
    }

    if (ratingMultiplier >= 2.5) {
      soundEffects.playSuccess();
    }

    if (nextIndex >= deck.length) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }

    setIsFlipped(false);
    setCurrentIndex(nextIndex);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionReviewed(0);
  };

  if (!currentCard || currentIndex >= deck.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
          🎉
        </div>
        <h3 className="text-2xl font-black text-white">Daily Review Deck Completed!</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          You reviewed {sessionReviewed} spaced repetition items today. Your retention interval has been dynamically adjusted.
        </p>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          Review Deck Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
              Smart Spaced Repetition (SRS)
            </span>
            <span className="text-xs text-slate-400">Card {currentIndex + 1} of {deck.length}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Adaptive Retention Interval Engine</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <Flame className="w-4 h-4" />
            <span>{streak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Flip Flashcard */}
      <div
        onClick={handleFlip}
        className="min-h-72 p-8 bg-gradient-to-b from-slate-950 to-slate-900/90 rounded-2xl border border-slate-800 hover:border-purple-500/40 cursor-pointer transition shadow-xl flex flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-[11px] font-semibold text-slate-300">
            {currentCard.category} • {currentCard.level}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              speakText(currentCard.targetWord, language, 0.9);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            <Volume2 className="w-5 h-5 text-purple-400" />
          </button>
        </div>

        <div className="text-center py-6 space-y-3">
          <div className="text-4xl md:text-5xl font-black text-white tracking-wide">
            {currentCard.targetWord}
          </div>
          <div className="text-sm font-mono text-purple-300">{currentCard.phonetic}</div>

          {isFlipped ? (
            <div className="space-y-3 pt-4 border-t border-slate-800/80 animate-fadeIn">
              <div className="text-xl font-bold text-emerald-400">{currentCard.nativeWord}</div>
              <div className="text-xs text-slate-300 italic">"{currentCard.exampleSentence}"</div>
              <div className="text-xs text-slate-500">{currentCard.exampleTranslation}</div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 pt-6">Tap anywhere on card to reveal answer</div>
          )}
        </div>

        <div className="text-center text-[11px] text-slate-500 font-medium">
          Interval: {currentCard.intervalDays}d | Ease Factor: {currentCard.easeFactor.toFixed(1)}
        </div>
      </div>

      {/* SRS Rating Actions (shown after flip) */}
      {isFlipped && (
        <div className="space-y-3 pt-2 animate-fadeIn">
          <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider text-center">
            How well did you remember this item?
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => handleRateCard(1.2)}
              className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 hover:bg-rose-950/30 text-rose-300 font-bold text-sm transition"
            >
              <div>Again</div>
              <div className="text-[10px] text-slate-500 font-normal">&lt; 1 day</div>
            </button>
            <button
              onClick={() => handleRateCard(1.8)}
              className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 hover:bg-amber-950/30 text-amber-300 font-bold text-sm transition"
            >
              <div>Hard</div>
              <div className="text-[10px] text-slate-500 font-normal">+1 day</div>
            </button>
            <button
              onClick={() => handleRateCard(2.5)}
              className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 hover:bg-blue-950/30 text-blue-300 font-bold text-sm transition"
            >
              <div>Good</div>
              <div className="text-[10px] text-slate-500 font-normal">+3 days</div>
            </button>
            <button
              onClick={() => handleRateCard(3.2)}
              className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 hover:bg-emerald-950/30 text-emerald-300 font-bold text-sm transition"
            >
              <div>Easy</div>
              <div className="text-[10px] text-slate-500 font-normal">+6 days</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
