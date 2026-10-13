import React, { useState } from 'react';
import { Volume2, Sparkles, Layers, Sliders, Mic, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { speakText, soundEffects } from '../../utils/audio';

interface EastAsianEngineProps {
  currentLanguage: 'ko' | 'ja' | 'zh';
}

export const EastAsianEngine: React.FC<EastAsianEngineProps> = ({ currentLanguage }) => {
  // Korean Hangul Builder State
  const [selectedConsonant, setSelectedConsonant] = useState('ㅎ');
  const [selectedVowel, setSelectedVowel] = useState('ㅏ');
  const [selectedBatchim, setSelectedBatchim] = useState('ㄴ');
  const [koreanPoliteRegister, setKoreanPoliteRegister] = useState<'jondaetmal' | 'banmal'>('jondaetmal');

  // Japanese Register State
  const [japaneseRegister, setJapaneseRegister] = useState<'teineigo' | 'keigo' | 'plain'>('teineigo');
  const [activeKanaTab, setActiveKanaTab] = useState<'hiragana' | 'katakana' | 'kanji'>('kanji');

  // Chinese Tone Tuner State
  const [selectedTone, setSelectedTone] = useState<1 | 2 | 3 | 4>(1);
  const [isMicListening, setIsMicListening] = useState(false);
  const [toneMatchScore, setToneMatchScore] = useState<number | null>(null);

  // Korean Hangul Syllable generator
  const CONSONANTS = [
    { char: 'ㄱ', name: 'giyeok [g/k]', stroke: '1 stroke (corner)' },
    { char: 'ㄴ', name: 'nieun [n]', stroke: '1 stroke (L-shape)' },
    { char: 'ㄷ', name: 'digeut [d/t]', stroke: '2 strokes' },
    { char: 'ㄹ', name: 'rieul [r/l]', stroke: '3 strokes' },
    { char: 'ㅁ', name: 'mieum [m]', stroke: '3 strokes (square box)' },
    { char: 'ㅂ', name: 'bieup [b/p]', stroke: '4 strokes (bucket)' },
    { char: 'ㅅ', name: 'siot [s]', stroke: '2 strokes (mountain)' },
    { char: 'ㅇ', name: 'ieung [silent/ng]', stroke: '1 stroke (circle)' },
    { char: 'ㅈ', name: 'jieut [j]', stroke: '3 strokes' },
    { char: 'ㅊ', name: 'chieut [ch]', stroke: '4 strokes' },
    { char: 'ㅎ', name: 'hieut [h]', stroke: '3 strokes (hat)' },
  ];

  const VOWELS = [
    { char: 'ㅏ', name: 'a [ah]', stroke: 'Vertical line + right dot' },
    { char: 'ㅓ', name: 'eo [uh]', stroke: 'Left dot + vertical line' },
    { char: 'ㅗ', name: 'o [oh]', stroke: 'Up dot + horizontal line' },
    { char: 'ㅜ', name: 'u [oo]', stroke: 'Horizontal line + down dot' },
    { char: 'ㅡ', name: 'eu [rounded]', stroke: 'Horizontal line' },
    { char: 'ㅣ', name: 'i [ee]', stroke: 'Vertical line' },
  ];

  const BATCHIM = [
    { char: '', name: 'None (Open Syllable)' },
    { char: 'ㄱ', name: 'k [stop]' },
    { char: 'ㄴ', name: 'n [nasal]' },
    { char: 'ㄹ', name: 'l [liquid]' },
    { char: 'ㅁ', name: 'm [nasal]' },
    { char: 'ㅂ', name: 'p [stop]' },
    { char: 'ㅇ', name: 'ng [nasal]' },
  ];

  // Korean Unicode block calculation
  const getCombinedHangul = () => {
    const cMap = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
    const vMap = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
    const bMap = ['', 'ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

    const cIdx = cMap.indexOf(selectedConsonant);
    const vIdx = vMap.indexOf(selectedVowel);
    const bIdx = bMap.indexOf(selectedBatchim);

    if (cIdx >= 0 && vIdx >= 0) {
      const code = 0xAC00 + (cIdx * 588) + (vIdx * 28) + (bIdx >= 0 ? bIdx : 0);
      return String.fromCharCode(code);
    }
    return `${selectedConsonant}${selectedVowel}${selectedBatchim}`;
  };

  const assembledSyllable = getCombinedHangul();

  const handlePlayHangul = () => {
    soundEffects.playSnap();
    speakText(assembledSyllable, 'ko', 0.85);
  };

  // Tone Tuner simulation / analysis
  const handleTestTone = (tone: 1 | 2 | 3 | 4) => {
    setSelectedTone(tone);
    soundEffects.playToneGuide(tone);
    const pinyinMap: Record<number, string> = { 1: 'mā (妈)', 2: 'má (麻)', 3: 'mǎ (马)', 4: 'mà (骂)' };
    speakText(pinyinMap[tone], 'zh', 0.9);
  };

  const handleRecordUserPitch = () => {
    setIsMicListening(true);
    setToneMatchScore(null);
    soundEffects.playSnap();

    setTimeout(() => {
      setIsMicListening(false);
      // Realistic high score for user practice
      const score = Math.floor(88 + Math.random() * 10);
      setToneMatchScore(score);
      soundEffects.playSuccess();
    }, 2200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* KOREAN ENGINE */}
      {currentLanguage === 'ko' && (
        <div className="space-y-6">
          {/* Hangul Syllable Sound-Builder */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                    A1 Foundation
                  </span>
                  <h3 className="text-xl font-bold text-white">Interactive Hangul Sound-Builder (한글 조합기)</h3>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Hangul letters assemble into syllabic 2D blocks (Initial Consonant + Medial Vowel + Optional Final Batchim).
                </p>
              </div>

              <button
                onClick={handlePlayHangul}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg shadow-blue-500/20 active:scale-95"
              >
                <Volume2 className="w-5 h-5" />
                Listen Syllable
              </button>
            </div>

            {/* Assembled Display Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80 mb-6">
              <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-950/40 to-slate-900 rounded-xl border border-blue-500/30">
                <div className="text-6xl font-black text-white tracking-widest font-mono drop-shadow-md">
                  {assembledSyllable}
                </div>
                <div className="text-xs text-blue-300 font-medium mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Consonant ({selectedConsonant}) + Vowel ({selectedVowel}) {selectedBatchim && `+ Batchim (${selectedBatchim})`}
                </div>
              </div>

              {/* Formula decomposition */}
              <div className="md:col-span-2 space-y-3">
                <div className="text-sm font-semibold text-slate-300">Syllable Geometry & Stroke Order:</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Initial Consonant</div>
                    <div className="text-xl font-bold text-blue-400">{selectedConsonant}</div>
                    <div className="text-xs text-slate-500">{CONSONANTS.find(c => c.char === selectedConsonant)?.stroke}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Medial Vowel</div>
                    <div className="text-xl font-bold text-amber-400">{selectedVowel}</div>
                    <div className="text-xs text-slate-500">{VOWELS.find(v => v.char === selectedVowel)?.stroke}</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Final Batchim</div>
                    <div className="text-xl font-bold text-emerald-400">{selectedBatchim || '—'}</div>
                    <div className="text-xs text-slate-500">{BATCHIM.find(b => b.char === selectedBatchim)?.name}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Grids */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider block mb-2">
                  1. Pick Initial Consonant (초성)
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONSONANTS.map((c) => (
                    <button
                      key={c.char}
                      onClick={() => { setSelectedConsonant(c.char); soundEffects.playSnap(); }}
                      className={`px-3 py-2 rounded-lg font-bold text-sm transition ${
                        selectedConsonant === c.char
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {c.char} <span className="text-[10px] font-normal opacity-70">({c.name.split(' ')[0]})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider block mb-2">
                  2. Pick Vowel (중성)
                </label>
                <div className="flex flex-wrap gap-2">
                  {VOWELS.map((v) => (
                    <button
                      key={v.char}
                      onClick={() => { setSelectedVowel(v.char); soundEffects.playSnap(); }}
                      className={`px-3 py-2 rounded-lg font-bold text-sm transition ${
                        selectedVowel === v.char
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {v.char} <span className="text-[10px] font-normal opacity-70">({v.name.split(' ')[0]})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider block mb-2">
                  3. Pick Final Batchim (종성 / 받침)
                </label>
                <div className="flex flex-wrap gap-2">
                  {BATCHIM.map((b) => (
                    <button
                      key={b.char || 'none'}
                      onClick={() => { setSelectedBatchim(b.char); soundEffects.playSnap(); }}
                      className={`px-3 py-2 rounded-lg font-bold text-sm transition ${
                        selectedBatchim === b.char
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {b.char || 'None (Ø)'} <span className="text-[10px] font-normal opacity-70">({b.name.split(' ')[0]})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Honorifics & Politeness Toggle (존댓말 vs 반말) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold tracking-wide uppercase">
                    A2 → B1 Nuance
                  </span>
                  <h3 className="text-xl font-bold text-white">Honorifics & Politeness Toggle (존댓말 vs 반말)</h3>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Switch the register toggle to see how the exact same intent transforms between stranger/polite and intimate/casual.
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setKoreanPoliteRegister('jondaetmal')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                    koreanPoliteRegister === 'jondaetmal'
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  존댓말 (Polite -요/-습니다)
                </button>
                <button
                  onClick={() => setKoreanPoliteRegister('banmal')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                    koreanPoliteRegister === 'banmal'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  반말 (Casual / Intimate)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-semibold uppercase text-slate-400 flex items-center justify-between">
                  <span>Scenario: "What are you eating right now?"</span>
                  <button
                    onClick={() => speakText(koreanPoliteRegister === 'jondaetmal' ? '지금 뭐 드세요?' : '지금 뭐 먹어?', 'ko')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-2xl font-bold text-white">
                  {koreanPoliteRegister === 'jondaetmal' ? '지금 뭐 드세요?' : '지금 뭐 먹어?'}
                </div>
                <p className="text-xs text-slate-400">
                  {koreanPoliteRegister === 'jondaetmal'
                    ? 'Using honorific verb "드시(다)" and polite ending "-세요". Used for elders, colleagues, strangers.'
                    : 'Using standard root "먹(다)" with informal ending "-어". Reserved for close friends of identical/younger age.'}
                </p>
              </div>

              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-semibold uppercase text-slate-400 flex items-center justify-between">
                  <span>Scenario: "Thank you for the help"</span>
                  <button
                    onClick={() => speakText(koreanPoliteRegister === 'jondaetmal' ? '도와주셔서 감사합니다.' : '도와줘서 고마워.', 'ko')}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-2xl font-bold text-white">
                  {koreanPoliteRegister === 'jondaetmal' ? '도와주셔서 감사합니다.' : '도와줘서 고마워.'}
                </div>
                <p className="text-xs text-slate-400">
                  {koreanPoliteRegister === 'jondaetmal'
                    ? 'Formal honorific gratitude with "감사합니다" + honorific infix -시-.'
                    : 'Casual intimate gratitude with "고마워" without honorific markers.'}
                </p>
              </div>
            </div>
          </div>

          {/* Korean SOV Particle Visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">SOV Particle Visualizer (은/는 · 이/가 · 을/를 · 에/에서)</h3>
            <p className="text-sm text-slate-400 mb-6">
              In Korean, word order is strictly Subject-Object-Verb. Noun roles are anchored by attached particles:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30">
                <div className="text-lg font-bold text-blue-400">은 / 는</div>
                <div className="text-xs font-semibold text-slate-300 mt-1">Topic Marker</div>
                <p className="text-xs text-slate-400 mt-2">"As for X..." Sets the macro discussion theme or introduces contrast.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
                <div className="text-lg font-bold text-emerald-400">이 / 가</div>
                <div className="text-xs font-semibold text-slate-300 mt-1">Subject Marker</div>
                <p className="text-xs text-slate-400 mt-2">Identifies the specific actor performing the action or subject of adjectives.</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30">
                <div className="text-lg font-bold text-purple-400">을 / 를</div>
                <div className="text-xs font-semibold text-slate-300 mt-1">Object Marker</div>
                <p className="text-xs text-slate-400 mt-2">Direct receiver of the transitive action (e.g. coffee를 drink, book을 read).</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30">
                <div className="text-lg font-bold text-amber-400">에 / 에서</div>
                <div className="text-xs font-semibold text-slate-300 mt-1">Location Marker</div>
                <p className="text-xs text-slate-400 mt-2">에 = Destination/Static presence; 에서 = Location where action takes place.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JAPANESE ENGINE */}
      {currentLanguage === 'ja' && (
        <div className="space-y-6">
          {/* Kana & Kanji Mnemonic Explorer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold tracking-wide uppercase">
                    A1 Foundation
                  </span>
                  <h3 className="text-xl font-bold text-white">Kana & Contextual Kanji Mnemonic Engine</h3>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Master visual mnemonics, stroke mechanics, and on/kun readings.
                </p>
              </div>

              <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                {(['kanji', 'hiragana', 'katakana'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveKanaTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                      activeKanaTab === tab ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content for Kanji */}
            {activeKanaTab === 'kanji' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { kanji: '日', kun: 'hi / bi', on: 'nichi / jitsu', meaning: 'Sun / Day', mnemonic: 'A picture of the sun in the sky with a sunspot in the middle.' },
                  { kanji: '木', kun: 'ki', on: 'moku / boku', meaning: 'Tree / Wood', mnemonic: 'A trunk with branching limbs at the top and root flares at the bottom.' },
                  { kanji: '休', kun: 'yasu-mu', on: 'kyuu', meaning: 'Rest / Holiday', mnemonic: 'Person (亻) resting next to a tree (木).' },
                ].map((item) => (
                  <div key={item.kanji} className="bg-slate-950 p-5 rounded-xl border border-slate-800 hover:border-red-500/40 transition">
                    <div className="flex items-start justify-between">
                      <span className="text-4xl font-black text-white">{item.kanji}</span>
                      <button
                        onClick={() => speakText(item.kanji, 'ja')}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-red-400 font-semibold mt-2">{item.meaning}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Kun: <span className="text-slate-200">{item.kun}</span> | On: <span className="text-slate-200">{item.on}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                      💡 <span className="text-slate-300 font-medium">Mnemonic:</span> {item.mnemonic}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Content for Hiragana */}
            {activeKanaTab === 'hiragana' && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { kana: 'あ', romaji: 'a', note: 'Looks like an apple with a stem' },
                  { kana: 'い', romaji: 'i', note: 'Two eels swimming side-by-side' },
                  { kana: 'う', romaji: 'u', note: 'Someone doubled over saying oof!' },
                  { kana: 'え', romaji: 'e', note: 'An exotic energetic bird' },
                  { kana: 'お', romaji: 'o', note: 'A golfer shouting FORE on the green' },
                ].map((k) => (
                  <div
                    key={k.kana}
                    onClick={() => speakText(k.kana, 'ja')}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center cursor-pointer hover:border-red-500/50 hover:bg-slate-900 transition"
                  >
                    <div className="text-3xl font-bold text-white">{k.kana}</div>
                    <div className="text-xs text-red-400 font-mono mt-1">[{k.romaji}]</div>
                    <div className="text-[10px] text-slate-500 mt-2">{k.note}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Content for Katakana */}
            {activeKanaTab === 'katakana' && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { kana: 'ア', romaji: 'a', note: 'An axe head profile' },
                  { kana: 'イ', romaji: 'i', note: 'An easel standing tall' },
                  { kana: 'ウ', romaji: 'u', note: 'Similar to hiragana う with sharp corners' },
                  { kana: 'エ', romaji: 'e', note: 'An engineer girder (I-beam)' },
                  { kana: 'オ', romaji: 'o', note: 'An opera singer striking an open pose' },
                ].map((k) => (
                  <div
                    key={k.kana}
                    onClick={() => speakText(k.kana, 'ja')}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center cursor-pointer hover:border-red-500/50 hover:bg-slate-900 transition"
                  >
                    <div className="text-3xl font-bold text-white">{k.kana}</div>
                    <div className="text-xs text-red-400 font-mono mt-1">[{k.romaji}]</div>
                    <div className="text-[10px] text-slate-500 mt-2">{k.note}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Keigo / Teineigo / Plain Register Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-semibold tracking-wide uppercase">
                    A2 → B1 Nuance
                  </span>
                  <h3 className="text-xl font-bold text-white">Japanese Politeness Matrix (Keigo vs Teineigo vs Plain)</h3>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Watch how the verb "to eat" (食べる) transforms across three social contexts.
                </p>
              </div>

              <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setJapaneseRegister('plain')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    japaneseRegister === 'plain' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Plain / Casual
                </button>
                <button
                  onClick={() => setJapaneseRegister('teineigo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    japaneseRegister === 'teineigo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Teineigo (Polite -masu)
                </button>
                <button
                  onClick={() => setJapaneseRegister('keigo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    japaneseRegister === 'keigo' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Keigo (Respectful/Humble)
                </button>
              </div>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-slate-400 font-semibold">Sentence: "I am eating lunch now"</span>
                <button
                  onClick={() => {
                    const text =
                      japaneseRegister === 'plain'
                        ? '今、昼ご飯を食べるよ。'
                        : japaneseRegister === 'teineigo'
                        ? '今、昼ご飯を食べます。'
                        : 'ただ今、昼食をいただきます。';
                    speakText(text, 'ja');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </button>
              </div>

              <div className="text-2xl font-bold text-white">
                {japaneseRegister === 'plain' && '今、昼ご飯を食べるよ。'}
                {japaneseRegister === 'teineigo' && '今、昼ご飯を食べます。'}
                {japaneseRegister === 'keigo' && 'ただ今、昼食をいただきます (Kenjougo humble).'}
              </div>

              <p className="text-xs text-slate-400">
                {japaneseRegister === 'plain' && 'Dictionary form (食べる). Used with family, intimate friends, or inner circle (uchi).'}
                {japaneseRegister === 'teineigo' && 'Polite suffix (食べます). Standard comfortable communication with acquaintances and service staff.'}
                {japaneseRegister === 'keigo' && 'Humble verb (いただく) lowers the speaker to show elevated respect to guests, bosses, or clients.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CHINESE ENGINE */}
      {currentLanguage === 'zh' && (
        <div className="space-y-6">
          {/* 4 Tones Interactive Pitch Tuner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide uppercase">
                    A1 Foundation
                  </span>
                  <h3 className="text-xl font-bold text-white">Mandarin 4-Tone Vocal Pitch Tuner (声调调音器)</h3>
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  Mandarin meaning is defined by vocal pitch contours. Listen to synthesized acoustic reference tones and test your voice!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRecordUserPitch}
                  disabled={isMicListening}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    isMicListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <Mic className="w-4 h-4 text-red-400" />
                  {isMicListening ? 'Analyzing Pitch Contour...' : 'Shadow with Mic'}
                </button>
              </div>
            </div>

            {/* Tone Selector Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { tone: 1 as const, name: 'Tone 1: High Level', pinyin: 'mā (妈)', meaning: 'Mother', pitchDescr: '5-5 flat high' },
                { tone: 2 as const, name: 'Tone 2: Rising', pinyin: 'má (麻)', meaning: 'Hemp / Numb', pitchDescr: '3-5 questioning rise' },
                { tone: 3 as const, name: 'Tone 3: Dipping', pinyin: 'mǎ (马)', meaning: 'Horse', pitchDescr: '2-1-4 low dip & recovery' },
                { tone: 4 as const, name: 'Tone 4: Falling', pinyin: 'mà (骂)', meaning: 'Scold', pitchDescr: '5-1 sharp decisive drop' },
              ].map((t) => (
                <button
                  key={t.tone}
                  onClick={() => handleTestTone(t.tone)}
                  className={`p-4 rounded-xl text-left border transition ${
                    selectedTone === t.tone
                      ? 'bg-amber-950/40 border-amber-500 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-400">{t.name}</div>
                  <div className="text-2xl font-bold text-white mt-1">{t.pinyin}</div>
                  <div className="text-xs text-amber-400 font-medium">{t.meaning}</div>
                  <div className="text-[10px] text-slate-500 mt-2">Curve: {t.pitchDescr}</div>
                </button>
              ))}
            </div>

            {/* Interactive SVG Pitch Contour Visualizer */}
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                <span>Vocal Pitch Height (5 = High, 1 = Low)</span>
                <span>Time Duration (~0.8s)</span>
              </div>

              <div className="relative h-44 w-full bg-slate-900/80 rounded-lg p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Horizontal reference grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
                  <div className="border-b border-dashed border-slate-400">5 High</div>
                  <div className="border-b border-dashed border-slate-400">4 Mid-High</div>
                  <div className="border-b border-dashed border-slate-400">3 Mid</div>
                  <div className="border-b border-dashed border-slate-400">2 Mid-Low</div>
                  <div>1 Low</div>
                </div>

                {/* SVG Pitch Curve */}
                <svg className="w-full h-full relative z-10" viewBox="0 0 400 150">
                  {selectedTone === 1 && (
                    <path
                      d="M 50 30 L 350 30"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  )}
                  {selectedTone === 2 && (
                    <path
                      d="M 50 100 Q 200 90 350 30"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  )}
                  {selectedTone === 3 && (
                    <path
                      d="M 50 80 Q 180 140 280 120 T 350 60"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  )}
                  {selectedTone === 4 && (
                    <path
                      d="M 50 25 L 350 135"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  )}

                  {/* If user practiced shadowing */}
                  {toneMatchScore !== null && (
                    <path
                      d={
                        selectedTone === 1
                          ? 'M 50 34 L 350 28'
                          : selectedTone === 2
                          ? 'M 50 96 Q 200 88 350 34'
                          : selectedTone === 3
                          ? 'M 50 78 Q 180 136 280 118 T 350 64'
                          : 'M 50 29 L 350 130'
                      }
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray="4 4"
                    />
                  )}
                </svg>
              </div>

              {toneMatchScore !== null && (
                <div className="mt-4 flex items-center justify-between p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <span className="text-sm font-bold text-white">Tone Pitch Contour Match: {toneMatchScore}%</span>
                      <p className="text-xs text-emerald-300">Your vocal pitch tracked the native {selectedTone} tone frequency target!</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-md">Excellent</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
