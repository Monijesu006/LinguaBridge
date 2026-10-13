import React, { useState } from 'react';
import { Volume2, Sliders, CheckCircle2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { speakText, soundEffects } from '../../utils/audio';

interface RomanceEngineProps {
  currentLanguage: 'fr' | 'es' | 'it';
}

export const RomanceEngine: React.FC<RomanceEngineProps> = ({ currentLanguage }) => {
  // Gender agreement state
  const [selectedGender, setSelectedGender] = useState<'masculine' | 'feminine'>('masculine');
  const [selectedNumber, setSelectedNumber] = useState<'singular' | 'plural'>('singular');

  // Tense slider state: 0 = Past (Preterite/Passé Composé), 1 = Present, 2 = Future, 3 = Subjunctive
  const [tenseIndex, setTenseIndex] = useState<number>(1);

  // Subjunctive trigger selector
  const [selectedTrigger, setSelectedTrigger] = useState<string>('desire');

  const TENSES = [
    { id: 'past', label: 'Past / Preterite', descr: 'Completed past actions' },
    { id: 'present', label: 'Present Indicative', descr: 'Everyday factual reality' },
    { id: 'future', label: 'Future', descr: 'Predictions & plans' },
    { id: 'subjunctive', label: 'Subjunctive Mood', descr: 'Emotion, doubt, desire, hypothetical' },
  ];

  // Language specific conjugations
  const VERB_DATA = {
    fr: {
      verb: 'parler (to speak)',
      subject: 'Nous (We)',
      conjugations: [
        { tense: 'Passé Composé', text: 'avons parlé', explanation: 'Auxiliary avoir + past participle parlé' },
        { tense: 'Présent', text: 'parlons', explanation: 'Root parl- + 1st person plural ending -ons' },
        { tense: 'Futur Simple', text: 'parlerons', explanation: 'Full infinitive parler- + future ending -ons' },
        { tense: 'Subjonctif Présent', text: 'parlions', explanation: 'Triggered by doubt/emotion: "Il faut que nous parlions"' },
      ],
      agreementExamples: {
        masculineSingular: { article: 'Le', noun: 'chat', adj: 'élégant', translation: 'The elegant male cat' },
        masculinePlural: { article: 'Les', noun: 'chats', adj: 'élégants', translation: 'The elegant male cats' },
        feminineSingular: { article: 'La', noun: 'chatte', adj: 'élégante', translation: 'The elegant female cat' },
        femininePlural: { article: 'Les', noun: 'chattes', adj: 'élégantes', translation: 'The elegant female cats' },
      },
    },
    es: {
      verb: 'hablar (to speak)',
      subject: 'Nosotros (We)',
      conjugations: [
        { tense: 'Pretérito', text: 'hablamos', explanation: 'Completed specific action in the past' },
        { tense: 'Presente', text: 'hablamos', explanation: 'Present habitual action' },
        { tense: 'Futuro', text: 'hablaremos', explanation: 'Infinitive hablar- + stressed ending -emos' },
        { tense: 'Subjuntivo', text: 'hablemos', explanation: 'Opposite vowel ending -emos triggered by desire: "Quiero que hablemos"' },
      ],
      agreementExamples: {
        masculineSingular: { article: 'El', noun: 'gato', adj: 'blanco', translation: 'The white male cat' },
        masculinePlural: { article: 'Los', noun: 'gatos', adj: 'blancos', translation: 'The white male cats' },
        feminineSingular: { article: 'La', noun: 'gata', adj: 'blanca', translation: 'The white female cat' },
        femininePlural: { article: 'Las', noun: 'gatas', adj: 'blancas', translation: 'The white female cats' },
      },
    },
    it: {
      verb: 'parlare (to speak)',
      subject: 'Noi (We)',
      conjugations: [
        { tense: 'Passato Prossimo', text: 'abbiamo parlato', explanation: 'Auxiliary avere + past participle parlato' },
        { tense: 'Presente', text: 'parliamo', explanation: 'Present indicative ending -iamo' },
        { tense: 'Futuro Semplice', text: 'parleremo', explanation: 'Future stem parler- + ending -emo' },
        { tense: 'Congiuntivo', text: 'parliamo', explanation: 'Subjective reality: "Penso che noi parliamo"' },
      ],
      agreementExamples: {
        masculineSingular: { article: 'Il', noun: 'gatto', adj: 'bianco', translation: 'The white male cat' },
        masculinePlural: { article: 'I', noun: 'gatti', adj: 'bianchi', translation: 'The white male cats' },
        feminineSingular: { article: 'La', noun: 'gatta', adj: 'bianca', translation: 'The white female cat' },
        femininePlural: { article: 'Le', noun: 'gatte', adj: 'bianche', translation: 'The white female cats' },
      },
    },
  };

  const currentVerb = VERB_DATA[currentLanguage];
  const activeConj = currentVerb.conjugations[tenseIndex];

  // Key for agreement lookup
  const agreeKey = (selectedGender === 'masculine'
    ? selectedNumber === 'singular' ? 'masculineSingular' : 'masculinePlural'
    : selectedNumber === 'singular' ? 'feminineSingular' : 'femininePlural') as keyof typeof currentVerb.agreementExamples;

  const currentAgree = currentVerb.agreementExamples[agreeKey];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Gender & Agreement Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-semibold tracking-wide uppercase">
                A1 Foundation
              </span>
              <h3 className="text-xl font-bold text-white">Gender & Agreement Mapping (Accord en genre & nombre)</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              In Romance languages, articles and adjectives must harmonize with the noun's gender (masculine/feminine) and number.
            </p>
          </div>

          <button
            onClick={() => {
              const phrase = `${currentAgree.article} ${currentAgree.noun} ${currentAgree.adj}`;
              speakText(phrase, currentLanguage);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            <Volume2 className="w-4 h-4 text-rose-400" />
            Listen Agreement
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => { setSelectedGender('masculine'); soundEffects.playSnap(); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                selectedGender === 'masculine' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Masculine (♂)
            </button>
            <button
              onClick={() => { setSelectedGender('feminine'); soundEffects.playSnap(); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                selectedGender === 'feminine' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Feminine (♀)
            </button>
          </div>

          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => { setSelectedNumber('singular'); soundEffects.playSnap(); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                selectedNumber === 'singular' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Singular (1)
            </button>
            <button
              onClick={() => { setSelectedNumber('plural'); soundEffects.playSnap(); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                selectedNumber === 'plural' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Plural (2+)
            </button>
          </div>
        </div>

        {/* Live Synchronized Phrase Card */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-baseline gap-3 text-3xl font-bold">
            <span className={`px-3 py-1.5 rounded-lg border ${selectedGender === 'masculine' ? 'bg-blue-950/60 border-blue-500/40 text-blue-400' : 'bg-rose-950/60 border-rose-500/40 text-rose-400'}`}>
              {currentAgree.article}
            </span>
            <span className="text-white underline decoration-slate-600 underline-offset-8">
              {currentAgree.noun}
            </span>
            <span className={`px-3 py-1.5 rounded-lg border ${selectedGender === 'masculine' ? 'bg-blue-950/60 border-blue-500/40 text-blue-300' : 'bg-rose-950/60 border-rose-500/40 text-rose-300'}`}>
              {currentAgree.adj}
            </span>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-slate-300">{currentAgree.translation}</div>
            <div className="text-xs text-slate-500 mt-1">
              Harmonized in {selectedGender} {selectedNumber} form
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tense Slider & Subjunctive Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
                A2 → B1 Intermediate Transition
              </span>
              <h3 className="text-xl font-bold text-white">Interactive Tense & Mood Slider (Timeline Engine)</h3>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Drag across the timeline to see how {currentVerb.verb} conjugates across temporal reality and subjective mood.
            </p>
          </div>

          <button
            onClick={() => {
              const full = `${currentVerb.subject} ${activeConj.text}`;
              speakText(full, currentLanguage);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
          >
            <Volume2 className="w-4 h-4" />
            Listen Tense
          </button>
        </div>

        {/* Timeline Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {TENSES.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => { setTenseIndex(idx); soundEffects.playSnap(); }}
              className={`p-3 rounded-xl text-left border transition ${
                tenseIndex === idx
                  ? 'bg-indigo-950/60 border-indigo-500 shadow-lg'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-semibold text-slate-400">Step {idx + 1}</div>
              <div className="text-sm font-bold text-white mt-1">{t.label}</div>
              <div className="text-[10px] text-slate-500 mt-1">{t.descr}</div>
            </button>
          ))}
        </div>

        {/* Live Conjugated Display */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              {activeConj.tense} Form
            </span>
            <span className="text-xs text-slate-400 font-mono">Verb: {currentVerb.verb}</span>
          </div>

          <div className="text-3xl font-extrabold text-white flex items-center gap-3">
            <span className="text-slate-400">{currentVerb.subject}</span>
            <span className="text-indigo-400 underline decoration-indigo-500 underline-offset-4">
              {activeConj.text}
            </span>
          </div>

          <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            💡 <strong className="text-slate-300">Morphological rule:</strong> {activeConj.explanation}
          </p>
        </div>

        {/* Subjunctive Guidance Mode (B1 Bridge) */}
        {tenseIndex === 3 && (
          <div className="mt-6 p-5 bg-gradient-to-r from-purple-950/40 to-slate-950 rounded-xl border border-purple-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              Subjunctive Trigger Framework (WEIRDO: Wishes, Emotion, Impersonal, Recommendations, Doubt, Ojalá)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike English which often relies on modal verbs ("may/might"), Romance languages require the subjunctive whenever the statement is non-factual, expressing desire, uncertainty, or emotional reaction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-xs text-purple-400 font-bold block">1. Desire / Will</span>
                <span className="text-xs text-slate-300">
                  {currentLanguage === 'fr' && 'Je veux que...'}
                  {currentLanguage === 'es' && 'Quiero que...'}
                  {currentLanguage === 'it' && 'Voglio che...'}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-xs text-purple-400 font-bold block">2. Doubt / Uncertainty</span>
                <span className="text-xs text-slate-300">
                  {currentLanguage === 'fr' && 'Je doute que...'}
                  {currentLanguage === 'es' && 'Dudo que...'}
                  {currentLanguage === 'it' && 'Dubito che...'}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-xs text-purple-400 font-bold block">3. Necessity</span>
                <span className="text-xs text-slate-300">
                  {currentLanguage === 'fr' && 'Il faut que...'}
                  {currentLanguage === 'es' && 'Es necesario que...'}
                  {currentLanguage === 'it' && 'È necessario che...'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
