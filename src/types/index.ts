export type LanguageCode = 'fr' | 'de' | 'es' | 'it' | 'ko' | 'ja' | 'zh';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  family: 'Romance' | 'Germanic' | 'EastAsian';
  wordOrder: string;
  script: string;
  description: string;
  currentLevel: CEFRLevel;
}

export type RegisterType = 'casual' | 'polite' | 'formal' | 'humble';

export interface WordToken {
  text: string;
  translation: string;
  phonetic?: string;
  partOfSpeech?: 'subject' | 'verb' | 'object' | 'particle' | 'article' | 'modifier' | 'other';
  gender?: 'masculine' | 'feminine' | 'neuter';
  notes?: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole: string;
  avatar: string;
  text: string;
  tokens: WordToken[];
  fullTranslation: string;
  audioPrompt?: string;
  culturalNote?: string;
}

export interface DialogueChoice {
  id: string;
  text: string;
  tokens: WordToken[];
  translation: string;
  register: RegisterType;
  feedback: string;
  nextSceneId: string;
  scoreBonus: number;
}

export interface StoryScene {
  id: string;
  title: string;
  setting: string;
  backgroundTheme: string;
  characterImage?: string;
  lines: DialogueLine[];
  choices?: DialogueChoice[];
  isEnding?: boolean;
  outcomeText?: string;
}

export interface ContextShiftStory {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel;
  location: string;
  initialSceneId: string;
  scenes: Record<string, StoryScene>;
}

export interface AudioCraftScenario {
  id: string;
  title: string;
  level: CEFRLevel;
  duration: string;
  summary: string;
  audioText: string;
  translation: string;
  targetSpeed: number; // 0.75 or 1.0
  pitchContour: number[]; // normalized pitch frequency points 0.0 - 1.0
  wordBreakdown: {
    word: string;
    phonetic: string;
    translation: string;
    stressPattern: string; // e.g. "high-rising" or "stressed"
  }[];
  idioms: {
    phrase: string;
    literal: string;
    meaning: string;
  }[];
}

export interface GrammarBlock {
  id: string;
  text: string;
  translation: string;
  type: 'subject' | 'verb' | 'object' | 'particle' | 'article' | 'modifier';
  case?: 'nominativ' | 'akkusativ' | 'dativ' | 'genitiv';
  gender?: 'masculine' | 'feminine' | 'neuter';
}

export interface MorphoGridExercise {
  id: string;
  prompt: string;
  targetTranslation: string;
  scenario: string;
  blocks: GrammarBlock[];
  correctSequence: string[]; // block IDs in order
  explanation: string;
  politenessVariants?: {
    level: string;
    sentence: string;
    explanation: string;
  }[];
}

export interface SRSCard {
  id: string;
  targetWord: string;
  nativeWord: string;
  phonetic: string;
  exampleSentence: string;
  exampleTranslation: string;
  level: CEFRLevel;
  category: string;
  intervalDays: number;
  easeFactor: number;
  reviewCount: number;
  lastReviewed?: string;
  dueDate: string;
}

export interface ErrorJournalEntry {
  id: string;
  mistakePattern: string;
  frequency: number;
  language: LanguageCode;
  category: 'Grammar' | 'Vocabulary' | 'Nuance' | 'Pronunciation' | 'Particles';
  whyItHappens: string;
  exampleBad: string;
  exampleGood: string;
  drillQuestion: string;
  drillOptions: string[];
  drillCorrectIndex: number;
  drillExplanation: string;
}

export interface CulturalBriefing {
  id: string;
  title: string;
  language: LanguageCode;
  tag: string;
  summary: string;
  doTip: string;
  avoidTip: string;
  audioDialogue: string;
  audioTranslation: string;
}
