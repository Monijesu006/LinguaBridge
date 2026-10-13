import React, { useState } from 'react';
import {
  BookOpen,
  Headphones,
  Grid,
  Zap,
  Layers,
  AlertCircle,
  Globe,
  Map,
  Flame,
  Award,
  Sparkles,
  ChevronDown,
  Volume2,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { LanguageCode } from './types';
import {
  LANGUAGES,
  CONTEXT_SHIFT_STORIES,
  AUDIOCRAFT_SCENARIOS,
  MORPHOGRID_EXERCISES,
  SRS_CARDS,
  ERROR_JOURNAL,
  CULTURAL_BRIEFINGS,
} from './data/languages';
import { StoryPlayer } from './components/ContextShift/StoryPlayer';
import { ShadowingStudio } from './components/AudioCraft/ShadowingStudio';
import { SentenceBuilder } from './components/MorphoGrid/SentenceBuilder';
import { EastAsianEngine } from './components/SpecializedModules/EastAsianEngine';
import { RomanceEngine } from './components/SpecializedModules/RomanceEngine';
import { GermanicEngine } from './components/SpecializedModules/GermanicEngine';
import { SpacedRepetition } from './components/BridgeFeatures/SpacedRepetition';
import { ErrorJournal } from './components/BridgeFeatures/ErrorJournal';
import { CulturalBriefings } from './components/BridgeFeatures/CulturalBriefings';
import { MicroJournaling } from './components/BridgeFeatures/MicroJournaling';
import { CurriculumRoadmap } from './components/Roadmap/CurriculumRoadmap';
import { soundEffects } from './utils/audio';

type ActiveTab =
  | 'contextshift'
  | 'audiocraft'
  | 'morphogrid'
  | 'specialized'
  | 'srs'
  | 'errorjournal'
  | 'culture_voice'
  | 'roadmap';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('ko');
  const [activeTab, setActiveTab] = useState<ActiveTab>('contextshift');
  const [userXP, setUserXP] = useState<number>(340);
  const [streakDays, setStreakDays] = useState<number>(7);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);

  const langInfo = LANGUAGES[selectedLanguage];
  const story = CONTEXT_SHIFT_STORIES[selectedLanguage];
  const audioScenario = AUDIOCRAFT_SCENARIOS[selectedLanguage];
  const morphoExercise = MORPHOGRID_EXERCISES[selectedLanguage][0];
  const srsDeck = SRS_CARDS[selectedLanguage];
  const errorEntries = ERROR_JOURNAL[selectedLanguage];
  const culturalNotes = CULTURAL_BRIEFINGS[selectedLanguage];

  const handleGainXP = (amount: number) => {
    setUserXP((prev) => prev + amount);
  };

  const handleSelectLanguage = (lang: LanguageCode) => {
    setSelectedLanguage(lang);
    setIsLangDropdownOpen(false);
    soundEffects.playSnap();
  };

  const getSpecializedEngineTitle = () => {
    if (selectedLanguage === 'ko') return 'Hangul Builder & Politeness';
    if (selectedLanguage === 'ja') return 'Kana/Kanji & Keigo Matrix';
    if (selectedLanguage === 'zh') return 'Mandarin 4-Tone Tuner';
    if (selectedLanguage === 'de') return '4-Cases & Compound Splitter';
    return 'Gender Agreement & Subjunctive';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xl">
                LB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg text-white tracking-tight">LinguaBridge</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    A1 → B2 Bridge
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 hidden sm:block">
                  ContextShift • AudioCraft • MorphoGrid
                </div>
              </div>
            </div>

            {/* Language Selector & User Stats */}
            <div className="flex items-center gap-3">
              {/* Language Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-sm font-semibold transition"
                >
                  <span className="text-xl">{langInfo.flag}</span>
                  <span className="hidden sm:inline text-white font-bold">{langInfo.name}</span>
                  <span className="text-xs text-slate-400 hidden md:inline">({langInfo.nativeName})</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Select Target Language
                    </div>
                    {Object.values(LANGUAGES).map((l) => (
                      <button
                        key={l.code}
                        onClick={() => handleSelectLanguage(l.code)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-sm hover:bg-slate-800 transition ${
                          selectedLanguage === l.code ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{l.flag}</span>
                          <span>{l.name}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">{l.nativeName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <Flame className="w-4 h-4" />
                <span>{streakDays}d Streak</span>
              </div>

              {/* User XP */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                <Award className="w-4 h-4" />
                <span>{userXP} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Navigation Tabs */}
        <div className="border-t border-slate-800/80 bg-slate-900/60 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 py-1.5">
            <button
              onClick={() => { setActiveTab('contextshift'); soundEffects.playSnap(); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'contextshift'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>ContextShift (Story Immersion)</span>
            </button>

            <button
              onClick={() => { setActiveTab('audiocraft'); soundEffects.playSnap(); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'audiocraft'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>AudioCraft (Shadowing Engine)</span>
            </button>

            <button
              onClick={() => { setActiveTab('morphogrid'); soundEffects.playSnap(); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'morphogrid'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>MorphoGrid (Syntax Builder)</span>
            </button>

            <button
              onClick={() => { setActiveTab('specialized'); soundEffects.playSnap(); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'specialized'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{getSpecializedEngineTitle()}</span>
            </button>

            <button
              onClick={() => { setActiveTab('srs'); soundEffects.playSnap(); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'srs'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Smart SRS Flashcards</span>
            </button>

            <button
              onClick={() => { setActiveTab('errorjournal'); soundEffects.playSnap(); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'errorjournal'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span>Error Diagnosis Journal</span>
            </button>

            <button
              onClick={() => { setActiveTab('culture_voice'); soundEffects.playSnap(); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'culture_voice'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Culture & Voice Production</span>
            </button>

            <button
              onClick={() => { setActiveTab('roadmap'); soundEffects.playSnap(); }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === 'roadmap'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>A1 → B2 Roadmap</span>
            </button>
          </div>
        </div>
      </header>

      {/* Language Overview Pill Banner */}
      <div className="bg-slate-900/40 border-b border-slate-800/60 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>{langInfo.flag}</span>
              <span>{langInfo.name} Target Path</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-mono">Word Order: <strong className="text-blue-400">{langInfo.wordOrder}</strong></span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Family: <strong className="text-slate-200">{langInfo.family}</strong></span>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-slate-400 hidden md:inline">Script: <strong className="text-slate-200">{langInfo.script}</strong></span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>{langInfo.description}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: CONTEXTSHIFT */}
        {activeTab === 'contextshift' && (
          <StoryPlayer
            story={story}
            language={selectedLanguage}
            onComplete={(xp) => handleGainXP(xp)}
          />
        )}

        {/* TAB 2: AUDIOCRAFT */}
        {activeTab === 'audiocraft' && (
          <ShadowingStudio
            scenario={audioScenario}
            language={selectedLanguage}
          />
        )}

        {/* TAB 3: MORPHOGRID */}
        {activeTab === 'morphogrid' && (
          <SentenceBuilder
            exercise={morphoExercise}
            language={selectedLanguage}
            onComplete={(xp) => handleGainXP(xp)}
          />
        )}

        {/* TAB 4: SPECIALIZED ENGINE */}
        {activeTab === 'specialized' && (
          <div>
            {(selectedLanguage === 'ko' || selectedLanguage === 'ja' || selectedLanguage === 'zh') && (
              <EastAsianEngine currentLanguage={selectedLanguage} />
            )}
            {(selectedLanguage === 'fr' || selectedLanguage === 'es' || selectedLanguage === 'it') && (
              <RomanceEngine currentLanguage={selectedLanguage} />
            )}
            {selectedLanguage === 'de' && (
              <GermanicEngine />
            )}
          </div>
        )}

        {/* TAB 5: SMART SRS */}
        {activeTab === 'srs' && (
          <SpacedRepetition
            cards={srsDeck}
            language={selectedLanguage}
            onCardReviewed={() => handleGainXP(10)}
          />
        )}

        {/* TAB 6: ERROR JOURNAL */}
        {activeTab === 'errorjournal' && (
          <ErrorJournal
            entries={errorEntries}
            language={selectedLanguage}
            onDrillCompleted={(xp) => handleGainXP(xp)}
          />
        )}

        {/* TAB 7: CULTURE & VOICE PRODUCTION */}
        {activeTab === 'culture_voice' && (
          <div className="space-y-8">
            <MicroJournaling
              language={selectedLanguage}
              onSubmitted={(xp) => handleGainXP(xp)}
            />
            <CulturalBriefings
              briefings={culturalNotes}
              language={selectedLanguage}
            />
          </div>
        )}

        {/* TAB 8: CURRICULUM ROADMAP */}
        {activeTab === 'roadmap' && (
          <CurriculumRoadmap
            currentLevel="A1"
            language={selectedLanguage}
            onSelectMilestone={(mId) => {
              if (mId === 'm1') setActiveTab('contextshift');
              if (mId === 'm2') setActiveTab('morphogrid');
              if (mId === 'm3') setActiveTab('specialized');
              if (mId === 'm4') setActiveTab('audiocraft');
              if (mId === 'm5') setActiveTab('culture_voice');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-white">LinguaBridge</span>
            <span>— Functional A1 to B2 Interactive Immersion</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>French 🇫🇷</span>
            <span>German 🇩🇪</span>
            <span>Spanish 🇪🇸</span>
            <span>Italian 🇮🇹</span>
            <span>Korean 🇰🇷</span>
            <span>Japanese 🇯🇵</span>
            <span>Chinese 🇨🇳</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
