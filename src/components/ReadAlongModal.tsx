import React, { useState, useEffect, useRef } from 'react';
import { AnimalItem } from '../types';
import { AnimalIllustration } from './AnimalIllustrations';
import { audioSystem } from '../utils/audioSystem';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  CheckCircle2,
  X,
  Volume1,
} from 'lucide-react';

interface ReadAlongModalProps {
  isOpen: boolean;
  items: AnimalItem[];
  onClose: () => void;
  onCompleteAll: (starsEarned: number) => void;
}

export const ReadAlongModal: React.FC<ReadAlongModalProps> = ({
  isOpen,
  items,
  onClose,
  onCompleteAll,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.8);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [spokenResult, setSpokenResult] = useState<string>('');
  const [starsAwarded, setStarsAwarded] = useState<number>(0);
  const [hasPracticed, setHasPracticed] = useState<boolean>(false);
  const [totalStarsCollected, setTotalStarsCollected] = useState(0);
  const [micSupported, setMicSupported] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (isOpen && currentItem) {
      setSpokenResult('');
      setStarsAwarded(0);
      setHasPracticed(false);
      // Auto play model pronunciation when step opens
      playTeacherVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentIndex]);

  // Check speech recognition capability
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicSupported(false);
    }
  }, []);

  if (!isOpen || !currentItem) return null;

  const playTeacherVoice = async (speed?: number) => {
    setIsPlayingAudio(true);
    audioSystem.playPop();
    const rateToUse = speed || speechSpeed;
    // Speak both the animal full phrase and the word
    await audioSystem.speak(`${currentItem.fullPhrase}`, rateToUse);
    setIsPlayingAudio(false);
  };

  const playChantVoice = async () => {
    setIsPlayingAudio(true);
    audioSystem.playPop();
    await audioSystem.speak(currentItem.chant, 0.85);
    setIsPlayingAudio(false);
  };

  const handleStartListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      // Fallback: reward child immediately with encouraging feedback
      rewardDirectly('Great reading! (Microphone unavailable in this browser)');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;

      setIsListening(true);
      audioSystem.playPop();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript = event.results[0][0].transcript.toLowerCase();
        setSpokenResult(transcript);
        evaluatePronunciation(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        // Encouraging fallback: allow them to pass easily
        rewardDirectly('Good effort! Keep practicing!');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      rewardDirectly('Well done!');
    }
  };

  const evaluatePronunciation = (transcript: string) => {
    const targetWord = currentItem.word.toLowerCase();
    const targetPhrase = currentItem.fullPhrase.toLowerCase();
    const targetSize = currentItem.size.toLowerCase();

    const containsWord = transcript.includes(targetWord);
    const containsSize = transcript.includes(targetSize);
    const containsFull = transcript.includes(targetPhrase);

    let stars = 2;
    if (containsFull || (containsWord && containsSize)) {
      stars = 3;
    } else if (containsWord || containsSize) {
      stars = 2;
    } else {
      stars = 1;
    }

    setStarsAwarded(stars);
    setHasPracticed(true);
    setTotalStarsCollected((prev) => prev + stars);

    // Audio & Visual celebratory fanfare
    audioSystem.playStarReward();
    confetti({
      particleCount: stars === 3 ? 50 : 25,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const rewardDirectly = (noteText?: string) => {
    setSpokenResult(noteText || currentItem.fullPhrase);
    setStarsAwarded(3);
    setHasPracticed(true);
    setTotalStarsCollected((prev) => prev + 3);
    audioSystem.playStarReward();
    confetti({
      particleCount: 45,
      spread: 65,
      origin: { y: 0.6 },
    });
  };

  const handleNextWord = () => {
    audioSystem.playPop();
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all items in read-along
      audioSystem.playFanfare();
      onCompleteAll(totalStarsCollected + starsAwarded);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-amber-50/90 to-white rounded-3xl p-6 md:p-8 border-4 border-amber-300 shadow-2xl flex flex-col items-center">
        {/* Top Exit & Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-amber-950 font-display font-bold px-3 py-1 rounded-full text-xs shadow-xs">
              Word {currentIndex + 1} of {items.length}
            </span>
            <span className="text-xs font-semibold text-amber-800">
              Listen &amp; Read Aloud · 跟读练习
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animal Illustration Card */}
        <div className="relative w-44 h-44 rounded-3xl bg-amber-100/60 border-2 border-amber-200 flex items-center justify-center p-2 mb-4 shadow-inner">
          <AnimalIllustration
            type={currentItem.type}
            size={currentItem.size}
            className="w-36 h-36"
          />
          <span className="absolute bottom-2 right-2 bg-white/90 text-amber-900 font-display font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-200">
            {currentItem.size.toUpperCase()}
          </span>
        </div>

        {/* Word, Phonics, Syllables */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 tracking-wide capitalize">
              {currentItem.fullPhrase}
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-amber-700 font-medium mt-1">
            <span className="bg-amber-100/80 px-2.5 py-0.5 rounded-md font-mono text-xs">
              {currentItem.phonetic}
            </span>
            <span>·</span>
            <span className="text-base text-slate-700 font-bold">
              {currentItem.chinese}
            </span>
          </div>

          {/* Syllables breakdown for kids */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {currentItem.syllables.map((syl, i) => (
              <span
                key={i}
                className="bg-white border border-amber-200 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs uppercase tracking-wider"
              >
                {syl}
              </span>
            ))}
          </div>

          {/* Rhyme Chant */}
          <div className="mt-3 px-4 py-2 bg-amber-50 rounded-xl border border-amber-200/80 text-xs md:text-sm text-amber-900 font-medium italic flex items-center justify-center gap-2">
            <span>&ldquo;{currentItem.chant}&rdquo;</span>
            <button
              onClick={playChantVoice}
              title="Play rhyme chant"
              className="p-1 rounded-full text-amber-700 hover:text-amber-900 hover:bg-amber-200/50 transition-colors"
            >
              <Volume1 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Teacher Model Controls */}
        <div className="w-full flex items-center justify-center gap-3 mb-5">
          <button
            onClick={() => playTeacherVoice(0.85)}
            disabled={isPlayingAudio}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-display font-bold text-sm shadow-md transition-all"
          >
            <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
            <span>Listen / 听示范</span>
          </button>

          <button
            onClick={() => {
              const newSpeed = speechSpeed === 0.8 ? 0.6 : 0.8;
              setSpeechSpeed(newSpeed);
              playTeacherVoice(newSpeed);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 text-xs font-bold shadow-2xs transition-colors"
          >
            <span>{speechSpeed === 0.8 ? '🐢 Slow (慢速 0.6x)' : '🐰 Normal (标准 0.8x)'}</span>
          </button>
        </div>

        {/* Follow-Along / Speak Area */}
        <div className="w-full flex flex-col items-center p-4 bg-white rounded-2xl border-2 border-amber-200 mb-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 mb-3">
            Now your turn: Tap the mic and read aloud! 孩子们跟着大声读:
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleStartListening}
              className={`relative flex items-center justify-center w-16 h-16 rounded-full font-display font-bold text-white transition-all shadow-lg active:scale-95 ${
                isListening
                  ? 'bg-rose-500 ring-4 ring-rose-300 animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-600 ring-4 ring-emerald-200'
              }`}
            >
              {isListening ? (
                <Mic className="w-8 h-8 animate-bounce" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            {/* Quick pass fallback for smartboards/classroom without mic */}
            <button
              onClick={() => rewardDirectly()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>I said it! / 我读好啦</span>
            </button>
          </div>

          {/* Sound Waves Animation when listening */}
          {isListening && (
            <div className="flex items-center gap-1 mt-3">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-7 bg-rose-500 rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-1.5 h-10 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:0.25s]" />
              <span className="text-xs font-bold text-rose-600 ml-2">Listening... 正在倾听</span>
            </div>
          )}

          {/* Stars & Feedback */}
          {hasPracticed && (
            <div className="flex flex-col items-center mt-3 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3].map((starIdx) => (
                  <Star
                    key={starIdx}
                    className={`w-6 h-6 transition-all ${
                      starIdx <= starsAwarded
                        ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-sm'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-display font-bold text-sm text-emerald-600">
                {starsAwarded === 3
                  ? '🌟 Perfect! Super English Star!'
                  : starsAwarded === 2
                  ? '🎉 Great Pronunciation!'
                  : '💪 Good Try! Keep Practicing!'}
              </span>
              {spokenResult && (
                <span className="text-xs text-slate-500 mt-0.5 italic">
                  Heard: &ldquo;{spokenResult}&rdquo;
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation Next Word Button */}
        <div className="w-full flex items-center justify-between">
          <button
            onClick={() => playTeacherVoice()}
            className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay / 重新听</span>
          </button>

          <button
            onClick={handleNextWord}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-display font-bold text-sm shadow-md transition-all"
          >
            <span>{currentIndex < items.length - 1 ? 'Next Word / 下一个' : 'Finish Stage / 完成本关'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
