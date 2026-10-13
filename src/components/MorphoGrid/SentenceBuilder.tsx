import React, { useState } from 'react';
import { Volume2, CheckCircle2, AlertCircle, RotateCcw, Sparkles, Layers, Sliders, ArrowRight } from 'lucide-react';
import { MorphoGridExercise, GrammarBlock, LanguageCode } from '../../types';
import { speakText, soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface SentenceBuilderProps {
  exercise: MorphoGridExercise;
  language: LanguageCode;
  onComplete?: (xp: number) => void;
}

export const SentenceBuilder: React.FC<SentenceBuilderProps> = ({ exercise, language, onComplete }) => {
  // Available blocks in drawer
  const [availableBlocks, setAvailableBlocks] = useState<GrammarBlock[]>(() =>
    [...exercise.blocks].sort(() => Math.random() - 0.5)
  );
  // Slotted blocks in sequence
  const [slottedBlocks, setSlottedBlocks] = useState<GrammarBlock[]>([]);
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(0);

  const getBlockColor = (type: GrammarBlock['type']) => {
    switch (type) {
      case 'subject':
        return 'bg-blue-600/20 border-blue-500/40 text-blue-300';
      case 'verb':
        return 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300';
      case 'object':
        return 'bg-purple-600/20 border-purple-500/40 text-purple-300';
      case 'particle':
        return 'bg-amber-600/20 border-amber-500/40 text-amber-300';
      case 'modifier':
        return 'bg-cyan-600/20 border-cyan-500/40 text-cyan-300';
      case 'article':
        return 'bg-rose-600/20 border-rose-500/40 text-rose-300';
      default:
        return 'bg-slate-700/20 border-slate-600 text-slate-300';
    }
  };

  const handleAddBlock = (block: GrammarBlock) => {
    soundEffects.playSnap();
    setAvailableBlocks(availableBlocks.filter((b) => b.id !== block.id));
    setSlottedBlocks([...slottedBlocks, block]);
    setIsEvaluated(false);
  };

  const handleRemoveBlock = (block: GrammarBlock) => {
    soundEffects.playSnap();
    setSlottedBlocks(slottedBlocks.filter((b) => b.id !== block.id));
    setAvailableBlocks([...availableBlocks, block]);
    setIsEvaluated(false);
  };

  const handleReset = () => {
    soundEffects.playSnap();
    setAvailableBlocks([...exercise.blocks].sort(() => Math.random() - 0.5));
    setSlottedBlocks([]);
    setIsEvaluated(false);
    setIsCorrect(false);
  };

  const handleCheckSentence = () => {
    const currentSequence = slottedBlocks.map((b) => b.id);
    const correct =
      currentSequence.length === exercise.correctSequence.length &&
      currentSequence.every((val, index) => val === exercise.correctSequence[index]);

    setIsEvaluated(true);
    setIsCorrect(correct);

    if (correct) {
      soundEffects.playSuccess();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      speakText(exercise.targetTranslation, language, 0.9);
      if (onComplete) onComplete(30);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              Concept C: MorphoGrid Sentence Builder
            </span>
            <span className="text-xs text-slate-400 font-medium">🧩 Color-Coded Syntax Blocks</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">{exercise.prompt}</h2>
          <p className="text-xs text-slate-400 mt-1">{exercise.scenario}</p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset Blocks
        </button>
      </div>

      {/* Assembly Work Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
          <span>Your Constructed Sentence Slots:</span>
          <span>{slottedBlocks.length} / {exercise.blocks.length} Blocks</span>
        </div>

        <div className="min-h-24 p-5 bg-slate-950 rounded-2xl border-2 border-dashed border-slate-800 flex flex-wrap items-center gap-3">
          {slottedBlocks.length === 0 ? (
            <div className="text-slate-500 text-sm italic w-full text-center py-4">
              Tap color-coded building blocks below in grammatical sequence to assemble the sentence.
            </div>
          ) : (
            slottedBlocks.map((block) => (
              <div
                key={block.id}
                onClick={() => handleRemoveBlock(block)}
                className={`group px-4 py-3 rounded-xl border font-bold cursor-pointer transition transform hover:-translate-y-0.5 shadow-md flex items-center gap-2 ${getBlockColor(
                  block.type
                )}`}
              >
                <div>
                  <div className="text-base text-white">{block.text}</div>
                  <div className="text-[10px] opacity-75 font-normal">{block.translation}</div>
                </div>
                <span className="text-xs opacity-50 group-hover:opacity-100 font-bold ml-1 text-slate-400">×</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Available Blocks Drawer */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Available Grammar Blocks (Tap to place):
        </div>

        <div className="flex flex-wrap gap-2.5">
          {availableBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => handleAddBlock(block)}
              className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition transform hover:scale-105 active:scale-95 shadow ${getBlockColor(
                block.type
              )}`}
            >
              <div className="text-white">{block.text}</div>
              <div className="text-[10px] opacity-70 font-normal">{block.translation}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Subject</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Verb</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Object</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Particle / Prep</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Modifier</span>
      </div>

      {/* Validation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          onClick={handleCheckSentence}
          disabled={slottedBlocks.length === 0}
          className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold transition shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          Validate Syntax Order
        </button>

        {isEvaluated && (
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>Flawless Construction! (+30 XP)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                <AlertCircle className="w-5 h-5" />
                <span>Syntax error: Review word order or particle positions.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explanation & Target Answer */}
      {isEvaluated && isCorrect && (
        <div className="p-5 bg-gradient-to-r from-cyan-950/40 to-slate-950 rounded-xl border border-cyan-500/30 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-cyan-400">Native Structural Analysis</span>
            <button
              onClick={() => speakText(exercise.targetTranslation, language, 0.9)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-lg font-bold text-white">{exercise.targetTranslation}</div>
          <p className="text-xs text-slate-300 leading-relaxed">{exercise.explanation}</p>
        </div>
      )}

      {/* Politeness & Conjugation Matrix Slider */}
      {exercise.politenessVariants && exercise.politenessVariants.length > 0 && (
        <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Dynamic Politeness & Register Shift Matrix</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {exercise.politenessVariants.map((variant, idx) => (
              <button
                key={variant.level}
                onClick={() => setActiveVariantIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeVariantIndex === idx
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {variant.level}
              </button>
            ))}
          </div>

          {exercise.politenessVariants[activeVariantIndex] && (
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">
                  {exercise.politenessVariants[activeVariantIndex].sentence}
                </span>
                <button
                  onClick={() => speakText(exercise.politenessVariants![activeVariantIndex].sentence, language)}
                  className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                💡 {exercise.politenessVariants[activeVariantIndex].explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
