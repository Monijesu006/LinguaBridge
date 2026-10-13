import React from 'react';
import { CheckCircle2, Circle, ArrowRight, Sparkles, MapPin, Compass, Trophy } from 'lucide-react';
import { CEFRLevel, LanguageCode } from '../../types';

interface CurriculumRoadmapProps {
  currentLevel: CEFRLevel;
  language: LanguageCode;
  onSelectMilestone?: (milestoneId: string) => void;
}

export const CurriculumRoadmap: React.FC<CurriculumRoadmapProps> = ({ currentLevel, language, onSelectMilestone }) => {
  const MILESTONES = [
    {
      id: 'm1',
      phase: 'Phase 1: Absolute Beginner',
      level: 'A1' as CEFRLevel,
      title: 'Sound Foundations & Core Survival',
      goal: 'Order food, pronounce tones/scripts, and overcome early speaking anxiety.',
      status: 'completed',
      xpReward: 150,
      features: [
        'Interactive script / tone / gender mechanics',
        'Basic ordering & survival cafe scenarios',
        'Fading scaffold dual-layer tap-to-translate',
      ],
    },
    {
      id: 'm2',
      phase: 'Phase 1: Absolute Beginner',
      level: 'A1 → A2' as CEFRLevel,
      title: 'Expressing Preferences & Register Awareness',
      goal: 'Distinguish polite vs casual speech and assemble basic sentences without textbook paralysis.',
      status: 'in-progress',
      xpReward: 250,
      features: [
        'MorphoGrid color-coded syntax building blocks',
        'Politeness registers (존댓말, Keigo, Le/Tu, Lei/Tu)',
        'Smart SRS core vocabulary intervals',
      ],
    },
    {
      id: 'm3',
      phase: 'Phase 2: Intermediate Bridge',
      level: 'A2 → B1' as CEFRLevel,
      title: 'Contextual Comprehension & Sentence Architecture',
      goal: 'Transition from single-word recall to paragraph listening and syntax matrices.',
      status: 'upcoming',
      xpReward: 350,
      features: [
        'German 4-Cases matrix & compound word deconstruction',
        'Korean & Japanese SOV particle placement maps',
        'Error Diagnosis Journal for recurring blindspots',
      ],
    },
    {
      id: 'm4',
      phase: 'Phase 2: Intermediate Bridge',
      level: 'B1' as CEFRLevel,
      title: 'Native-Speed Listening & Speech Shadowing',
      goal: 'Ramp audio speed from 0.75x to 1.0x and shadow natural native pitch contours.',
      status: 'upcoming',
      xpReward: 450,
      features: [
        'AudioCraft 5-minute micro-podcasts',
        'Visual pitch contour and stress alignment',
        'Contextual idioms with literal vs figurative nuance',
      ],
    },
    {
      id: 'm5',
      phase: 'Phase 3: Intermediate Mastery',
      level: 'B1 → B2' as CEFRLevel,
      title: 'Nuance, Subjunctive Mood & Active Production',
      goal: 'Express emotions, doubts, hypothetical scenarios, and debate opinions.',
      status: 'upcoming',
      xpReward: 600,
      features: [
        'Romance subjunctive timeline slider (WEIRDO)',
        'Daily 30-second voice-to-text micro-journaling',
        'Branching social negotiation adventures',
      ],
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              A1 → B2 Curriculum Roadmap
            </span>
            <span className="text-xs text-slate-400">Functional Usage Progression</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Bridging the Chasm from Flashcards to Fluency</h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Current Target: A1 → B1</span>
        </div>
      </div>

      {/* Roadmap List */}
      <div className="space-y-4">
        {MILESTONES.map((milestone, idx) => {
          const isDone = milestone.status === 'completed';
          const isInProgress = milestone.status === 'in-progress';

          return (
            <div
              key={milestone.id}
              onClick={() => onSelectMilestone && onSelectMilestone(milestone.id)}
              className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                isInProgress
                  ? 'bg-gradient-to-r from-slate-950 to-blue-950/30 border-blue-500/50 shadow-lg ring-1 ring-blue-500/30'
                  : isDone
                  ? 'bg-slate-950/70 border-emerald-500/30'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {isDone ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : isInProgress ? (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center animate-pulse">
                      <Compass className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {milestone.phase}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-blue-300">
                      {milestone.level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{milestone.title}</h3>
                  <p className="text-xs text-slate-400">{milestone.goal}</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {milestone.features.map((feat) => (
                      <span
                        key={feat}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300"
                      >
                        • {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-amber-400 block">+{milestone.xpReward} XP</span>
                <span
                  className={`text-[10px] uppercase font-semibold mt-1 inline-block px-2.5 py-0.5 rounded-full ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : isInProgress
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? 'Completed' : isInProgress ? 'Active Learning' : 'Locked'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
