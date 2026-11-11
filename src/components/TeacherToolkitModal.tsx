import React, { useState } from 'react';
import { STAGES_DATA } from '../data/stagesData';
import { AnimalIllustration } from './AnimalIllustrations';
import { audioSystem } from '../utils/audioSystem';
import {
  BookOpen,
  Volume2,
  Sparkles,
  Smile,
  X,
  Layers,
  HelpCircle,
  CheckCircle,
  Copy,
} from 'lucide-react';

interface TeacherToolkitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherToolkitModal: React.FC<TeacherToolkitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'flashcards' | 'chants'>('plan');
  const [selectedAnimalIdx, setSelectedAnimalIdx] = useState(0);
  const [copiedChant, setCopiedChant] = useState(false);

  if (!isOpen) return null;

  const allWords = [
    { word: 'bat', type: 'bat' as const, phonetic: '/bæt/', cn: '蝙蝠', sentence: 'A big bat flies at night.' },
    { word: 'fly', type: 'fly' as const, phonetic: '/flaɪ/', cn: '苍蝇', sentence: 'A small fly buzzes around.' },
    { word: 'kangaroo', type: 'kangaroo' as const, phonetic: '/ˌkæŋ.ɡəˈruː/', cn: '袋鼠', sentence: 'The big kangaroo jumps high.' },
    { word: 'panda', type: 'panda' as const, phonetic: '/ˈpæn.də/', cn: '熊猫', sentence: 'The big panda eats fresh bamboo.' },
    { word: 'rabbit', type: 'rabbit' as const, phonetic: '/ˈræb.ɪt/', cn: '兔子', sentence: 'A small rabbit has long soft ears.' },
  ];

  const currentFlashcard = allWords[selectedAnimalIdx];

  const handleCopyChants = () => {
    const text = `【小学英语动物单词趣味童谣与TPR教案】
1. Bat & Fly:
"Big bat, small bat! Flap flap flap!
Big fly, small fly! Buzz buzz buzz!
Who is in the sky? The bat and the fly!"

2. Kangaroo:
"Big kangaroo, jumps so high!
Small kangaroo, sleeps nearby!
Hop, hop, hop! Touch the sky!"

3. Panda:
"Big panda, chubby and bright!
Eating sweet bamboo day and night!
Small baby panda, roll and hug!"

4. Rabbit:
"Big rabbit with ears so tall!
Small bunny hops over the wall!
Hop hop hop, munch crunchy carrots!"`;

    navigator.clipboard.writeText(text);
    setCopiedChant(true);
    setTimeout(() => setCopiedChant(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 md:p-8 border-4 border-emerald-300 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-slate-900 leading-tight">
                Teacher&apos;s Lesson Assistant · 高级备课助手专区
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                教案要点、TPR动作律动指导、全屏闪卡与课堂歌谣
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 mb-4 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'plan'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Lesson Plan (教学设计)
          </button>
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'flashcards'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🃏 Smartboard Cards (闪卡投影)
          </button>
          <button
            onClick={() => setActiveTab('chants')}
            className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'chants'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎵 Chants &amp; TPR (律动与口诀)
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {activeTab === 'plan' && (
            <div className="space-y-4 text-xs md:text-sm text-slate-700">
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
                <h3 className="font-display font-bold text-emerald-900 text-sm mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  教学目标 (Teaching Objectives)
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-2">
                  <li>
                    <strong className="text-slate-800">核心词汇 (Vocabulary):</strong> bat (蝙蝠), fly (苍蝇), kangaroo (袋鼠), panda (熊猫), rabbit (兔子)。
                  </li>
                  <li>
                    <strong className="text-slate-800">形容词与大小概念 (Adjectives):</strong> big (大) 与 small (小)，能熟练表达 &quot;a big kangaroo&quot;, &quot;a small panda&quot;, &quot;big rabbit&quot; 等复合名词短语。
                  </li>
                  <li>
                    <strong className="text-slate-800">自然拼读与发音 (Phonics):</strong> 掌握短元音 /æ/ (b-a-t), 双元音 /aɪ/ (f-l-y), 多音节重音 /ˌkæŋ.ɡəˈruː/ 与爆破音 /p/。
                  </li>
                  <li>
                    <strong className="text-slate-800">交互目标 (Interactive Goals):</strong> 能够根据大小视觉特征，准确拖拽分类入大小两个盘子，并能大胆跟读发音。
                  </li>
                </ul>
              </div>

              {/* 4 Parts Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {STAGES_DATA.map((stg) => (
                  <div
                    key={stg.id}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-slate-900 text-sm">
                        {stg.titleCn}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Part {stg.order}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs">{stg.teachingNotes}</p>
                    <div className="bg-amber-50 p-2 rounded-xl text-[11px] text-amber-900 border border-amber-200">
                      <strong>TPR动作:</strong> {stg.tprHint}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'flashcards' && (
            <div className="flex flex-col items-center">
              {/* Animal picker tabs */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {allWords.map((item, idx) => (
                  <button
                    key={item.word}
                    onClick={() => {
                      setSelectedAnimalIdx(idx);
                      audioSystem.playPop();
                    }}
                    className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs capitalize transition-all ${
                      selectedAnimalIdx === idx
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.word} ({item.cn})
                  </button>
                ))}
              </div>

              {/* Large Projector Flashcard */}
              <div className="w-full max-w-md bg-gradient-to-b from-amber-50/50 to-white rounded-3xl p-6 border-3 border-emerald-200 shadow-md flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="flex flex-col items-center">
                    <AnimalIllustration
                      type={currentFlashcard.type}
                      size="big"
                      className="w-28 h-28"
                    />
                    <span className="text-xs font-bold text-amber-900 mt-1">
                      Big {currentFlashcard.word}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <AnimalIllustration
                      type={currentFlashcard.type}
                      size="small"
                      className="w-20 h-20"
                    />
                    <span className="text-xs font-bold text-orange-900 mt-1">
                      Small {currentFlashcard.word}
                    </span>
                  </div>
                </div>

                <h3 className="font-display font-extrabold text-3xl text-slate-900 capitalize tracking-wide mt-2">
                  {currentFlashcard.word}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mt-1">
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                    {currentFlashcard.phonetic}
                  </span>
                  <span>·</span>
                  <span className="text-base text-slate-800 font-bold">
                    {currentFlashcard.cn}
                  </span>
                </div>

                <p className="text-xs text-slate-600 italic mt-3 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200">
                  &ldquo;{currentFlashcard.sentence}&rdquo;
                </p>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => audioSystem.speak(currentFlashcard.word, 0.85)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Say Word (朗读单词)</span>
                  </button>
                  <button
                    onClick={() =>
                      audioSystem.speak(
                        `A big ${currentFlashcard.word} and a small ${currentFlashcard.word}`,
                        0.8
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Big &amp; Small Pair</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chants' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  课堂互动口诀与童谣（点击复制文本至课件PPT）：
                </p>
                <button
                  onClick={handleCopyChants}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-xs transition-colors"
                >
                  {copiedChant ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Copied! 已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All Chants 复制教案口诀</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <h4 className="font-display font-bold text-amber-950 text-sm mb-1 flex items-center gap-1.5">
                    🦇 Bat &amp; Fly Chant (蝙蝠与苍蝇)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono">
                    Big bat, big bat, flap flap flap!<br />
                    Small bat, small bat, take a little nap!<br />
                    Big fly, big fly, buzz buzz buzz!<br />
                    Zooming in the summer breeze!
                  </p>
                </div>

                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                  <h4 className="font-display font-bold text-emerald-950 text-sm mb-1 flex items-center gap-1.5">
                    🦘 Kangaroo Chant (袋鼠妈妈与宝宝)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono">
                    Big kangaroo, jumps so high!<br />
                    Touch the sun and touch the sky!<br />
                    Small kangaroo, in the pouch so tight!<br />
                    Peek-a-boo, day and night!
                  </p>
                </div>

                <div className="bg-lime-50 p-4 rounded-2xl border border-lime-200">
                  <h4 className="font-display font-bold text-lime-950 text-sm mb-1 flex items-center gap-1.5">
                    🐼 Panda Chant (熊猫爱竹子)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono">
                    Big panda, black and white!<br />
                    Eating bamboo day and night!<br />
                    Small baby panda, roll and play!<br />
                    Happy all the sunny day!
                  </p>
                </div>

                <div className="bg-pink-50 p-4 rounded-2xl border border-pink-200">
                  <h4 className="font-display font-bold text-pink-950 text-sm mb-1 flex items-center gap-1.5">
                    🐰 Rabbit Chant (兔子蹦蹦跳)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono">
                    Big rabbit, tall ears wiggle high!<br />
                    Crunching carrots, say bye-bye!<br />
                    Small rabbit, fluffy and sweet!<br />
                    Hop hop hop with tiny feet!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
