import React, { useState } from 'react';
import { Volume2, Sparkles, HelpCircle, Eye, EyeOff, Award, ChevronRight, RotateCcw } from 'lucide-react';
import { ContextShiftStory, DialogueChoice, WordToken, LanguageCode } from '../../types';
import { speakText, soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';

interface StoryPlayerProps {
  story: ContextShiftStory;
  language: LanguageCode;
  onComplete?: (xp: number) => void;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({ story, language, onComplete }) => {
  const [currentSceneId, setCurrentSceneId] = useState<string>(story.initialSceneId);
  const [fadingScaffold, setFadingScaffold] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<WordToken | null>(null);
  const [activeChoiceFeedback, setActiveChoiceFeedback] = useState<string | null>(null);
  const [accumulatedXP, setAccumulatedXP] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const scene = story.scenes[currentSceneId] || story.scenes[story.initialSceneId];

  const handleSelectChoice = (choice: DialogueChoice) => {
    soundEffects.playSnap();
    setActiveChoiceFeedback(choice.feedback);
    const newXP = accumulatedXP + choice.scoreBonus;
    setAccumulatedXP(newXP);

    if (choice.scoreBonus >= 20) {
      soundEffects.playSuccess();
    }

    setTimeout(() => {
      setActiveChoiceFeedback(null);
      if (story.scenes[choice.nextSceneId]) {
        setCurrentSceneId(choice.nextSceneId);
        if (story.scenes[choice.nextSceneId].isEnding) {
          setCompleted(true);
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          if (onComplete) onComplete(newXP);
        }
      }
    }, 1400);
  };

  const handleRestart = () => {
    setCurrentSceneId(story.initialSceneId);
    setCompleted(false);
    setActiveChoiceFeedback(null);
    setAccumulatedXP(0);
  };

  const getRegisterBadge = (reg: DialogueChoice['register']) => {
    switch (reg) {
      case 'polite':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'formal':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'casual':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-fadeIn">
      {/* Story Banner Header */}
      <div className={`p-6 bg-gradient-to-r ${scene.backgroundTheme} border-b border-slate-800`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                Concept A: ContextShift Immersion
              </span>
              <span className="text-xs text-slate-400 font-medium">📍 {story.location}</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">{story.title}</h2>
            <p className="text-xs text-slate-300 mt-1">{scene.title} — {scene.setting}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Fading Scaffold Toggle */}
            <button
              onClick={() => {
                setFadingScaffold(!fadingScaffold);
                soundEffects.playSnap();
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                fadingScaffold
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {fadingScaffold ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {fadingScaffold ? 'Fading Scaffold (A2/B1 Challenge)' : 'Full Scaffolding (A1 Mode)'}
            </button>

            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-bold text-amber-400">
              <Award className="w-4 h-4" />
              <span>+{accumulatedXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dialogue Stage */}
      <div className="p-6 md:p-8 space-y-6">
        {scene.lines.map((line) => (
          <div key={line.id} className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-2xl shadow-lg shrink-0">
                {line.avatar}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">{line.speaker}</span>
                    <span className="text-xs text-slate-400 ml-2">({line.speakerRole})</span>
                  </div>

                  <button
                    onClick={() => speakText(line.text, language, 0.9)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Listen to native pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Dual-Layer Subtitles with tap-to-translate tokens */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5 text-lg md:text-xl font-medium text-white leading-relaxed">
                    {line.tokens.map((token, idx) => (
                      <span
                        key={idx}
                        onClick={() => {
                          setSelectedToken(token);
                          soundEffects.playSnap();
                          speakText(token.text, language, 0.85);
                        }}
                        className={`cursor-pointer px-1.5 py-0.5 rounded-md transition border border-transparent hover:border-blue-500/50 hover:bg-blue-500/10 ${
                          token.gender === 'feminine' ? 'hover:text-rose-300' : ''
                        }`}
                      >
                        {token.text}
                      </span>
                    ))}
                  </div>

                  {/* Scaffolding Translation */}
                  {!fadingScaffold ? (
                    <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{line.fullTranslation}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-amber-400/80 italic border-t border-slate-800/80 pt-2">
                      Scaffolding faded: tap any word above to reveal its translation & grammar note.
                    </div>
                  )}

                  {line.culturalNote && (
                    <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{line.culturalNote}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Word Inspector Modal / Card */}
        {selectedToken && (
          <div className="p-4 bg-gradient-to-r from-slate-900 to-blue-950/40 rounded-xl border border-blue-500/30 flex items-center justify-between gap-4 animate-fadeIn">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">{selectedToken.text}</span>
                {selectedToken.gender && (
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md ${
                    selectedToken.gender === 'masculine' ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {selectedToken.gender}
                  </span>
                )}
                {selectedToken.partOfSpeech && (
                  <span className="text-[10px] text-slate-400 font-mono">[{selectedToken.partOfSpeech}]</span>
                )}
              </div>
              <p className="text-sm text-blue-300 font-medium mt-0.5">Translation: {selectedToken.translation}</p>
            </div>

            <button
              onClick={() => setSelectedToken(null)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
            >
              Close
            </button>
          </div>
        )}

        {/* Choice Feedback Alert */}
        {activeChoiceFeedback && (
          <div className="p-4 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-sm text-indigo-200 flex items-center gap-3 animate-fadeIn">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>{activeChoiceFeedback}</span>
          </div>
        )}

        {/* Branching Response Prompts */}
        {!scene.isEnding && scene.choices && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Choose your response (color-coded by register):
            </div>

            <div className="grid grid-cols-1 gap-3">
              {scene.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice)}
                  className="group p-4 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/40 text-left transition flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getRegisterBadge(choice.register)}`}>
                        {choice.register} register
                      </span>
                      <span className="text-xs text-slate-400">+{choice.scoreBonus} XP</span>
                    </div>
                    <div className="text-base font-bold text-white group-hover:text-blue-300 transition">
                      {choice.text}
                    </div>
                    {!fadingScaffold && (
                      <div className="text-xs text-slate-400">{choice.translation}</div>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Story Ending Card */}
        {scene.isEnding && (
          <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-950 border border-emerald-500/30 text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Scenario Mastered!</h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">{scene.outcomeText}</p>

            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-lg shadow-emerald-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              Replay & Explore Alternative Paths
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
