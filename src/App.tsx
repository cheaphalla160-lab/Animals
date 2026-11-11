/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimalItem, AnimalSize, LeaderboardEntry, StageId, StudentProfile } from './types';
import { STAGES_DATA, INITIAL_LEADERBOARD } from './data/stagesData';
import { AnimalIllustration } from './components/AnimalIllustrations';
import { PlateTarget } from './components/PlateTarget';
import { ReadAlongModal } from './components/ReadAlongModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { TeacherToolkitModal } from './components/TeacherToolkitModal';
import { audioSystem } from './utils/audioSystem';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Music,
  Trophy,
  Star,
  Sparkles,
  BookOpen,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export default function App() {
  // Current stage state
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const currentStage = STAGES_DATA[currentStageIndex];

  // Sorting state for current stage
  const [placedAnimals, setPlacedAnimals] = useState<Record<string, AnimalSize>>({});
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [draggedAnimalId, setDraggedAnimalId] = useState<string | null>(null);
  const [dragOverPlate, setDragOverPlate] = useState<AnimalSize | null>(null);

  // Score & Stars
  const [score, setScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [floatingFeedback, setFloatingFeedback] = useState<{ text: string; isSuccess: boolean } | null>(null);

  // Audio state
  const [isBgmOn, setIsBgmOn] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  // Modals
  const [isReadAlongOpen, setIsReadAlongOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);

  // Student Profile & Leaderboard
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('animal_game_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { name: 'Joy (快乐小学员)', avatar: '🐼' };
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('animal_game_leaderboard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_LEADERBOARD;
  });

  // Save profile to local storage
  useEffect(() => {
    localStorage.setItem('animal_game_profile', JSON.stringify(profile));
  }, [profile]);

  // Save leaderboard to local storage
  useEffect(() => {
    localStorage.setItem('animal_game_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Unplaced animals in current stage
  const unplacedAnimals = currentStage.animals.filter(
    (a) => !placedAnimals[a.id]
  );

  const bigPlacedAnimals = currentStage.animals.filter(
    (a) => placedAnimals[a.id] === 'big'
  );

  const smallPlacedAnimals = currentStage.animals.filter(
    (a) => placedAnimals[a.id] === 'small'
  );

  const totalRequiredBig = currentStage.animals.filter((a) => a.size === 'big').length;
  const totalRequiredSmall = currentStage.animals.filter((a) => a.size === 'small').length;

  const isStageFullyPlaced = unplacedAnimals.length === 0;

  // Background music autoplay check on first touch
  const handleFirstInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (!isBgmOn) {
        audioSystem.startBgm();
        setIsBgmOn(true);
      }
    }
  };

  // Toggle Background Music
  const handleToggleBgm = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFirstInteraction();
    const playing = audioSystem.toggleBgm();
    setIsBgmOn(playing);
  };

  // Stage Switch Handler
  const handleSelectStage = (idx: number) => {
    handleFirstInteraction();
    audioSystem.playPop();
    setCurrentStageIndex(idx);
    setPlacedAnimals({});
    setSelectedAnimalId(null);
    setIsReadAlongOpen(false);
  };

  // Animal Placement Logic
  const handlePlaceAnimal = (animal: AnimalItem, targetPlate: AnimalSize) => {
    handleFirstInteraction();
    const isCorrect = animal.size === targetPlate;

    if (isCorrect) {
      audioSystem.playCorrect();
      audioSystem.playPlateDrop();
      setStreak((prev) => prev + 1);
      const pointsEarned = 50 + streak * 10;
      setScore((prev) => prev + pointsEarned);

      setPlacedAnimals((prev) => ({
        ...prev,
        [animal.id]: targetPlate,
      }));
      setSelectedAnimalId(null);

      // Trigger floating feedback
      setFloatingFeedback({
        text: `+${pointsEarned} Excellent! ${animal.fullPhrase}!`,
        isSuccess: true,
      });
      setTimeout(() => setFloatingFeedback(null), 1800);

      // Check if all placed
      const newPlacedCount = Object.keys(placedAnimals).length + 1;
      if (newPlacedCount >= currentStage.animals.length) {
        audioSystem.playFanfare();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          setIsReadAlongOpen(true);
        }, 900);
      }
    } else {
      audioSystem.playWrong();
      setStreak(0);
      setFloatingFeedback({
        text: `Try again! That's a ${animal.size} animal!`,
        isSuccess: false,
      });
      setTimeout(() => setFloatingFeedback(null), 1800);
    }
  };

  // Handle Drag & Drop
  const handleDragStart = (e: React.DragEvent, animalId: string) => {
    handleFirstInteraction();
    setDraggedAnimalId(animalId);
    e.dataTransfer.setData('text/plain', animalId);
    audioSystem.playPop();
  };

  const handleDropOnPlate = (targetSize: AnimalSize) => {
    if (!draggedAnimalId) return;
    const animal = currentStage.animals.find((a) => a.id === draggedAnimalId);
    if (animal) {
      handlePlaceAnimal(animal, targetSize);
    }
    setDraggedAnimalId(null);
    setDragOverPlate(null);
  };

  // Click on unplaced animal: selects it
  const handleSelectAnimalToPlace = (animal: AnimalItem) => {
    handleFirstInteraction();
    audioSystem.playPop();
    // Also read the animal word out loud
    audioSystem.speak(animal.fullPhrase, 0.9);
    setSelectedAnimalId(animal.id === selectedAnimalId ? null : animal.id);
  };

  // Click on plate: if an animal is selected, drop it in!
  const handleClickPlate = (targetSize: AnimalSize) => {
    if (selectedAnimalId) {
      const animal = currentStage.animals.find((a) => a.id === selectedAnimalId);
      if (animal) {
        handlePlaceAnimal(animal, targetSize);
      }
    }
  };

  // Read-Along Completion
  const handleCompleteReadAlong = (starsEarned: number) => {
    setIsReadAlongOpen(false);
    setStars((prev) => prev + starsEarned);
    const bonus = starsEarned * 40;
    setScore((prev) => prev + bonus);

    // Update leaderboard with player's latest score
    updateUserScoreInLeaderboard(score + bonus, stars + starsEarned);

    if (currentStageIndex < STAGES_DATA.length - 1) {
      setCurrentStageIndex((prev) => prev + 1);
      setPlacedAnimals({});
      setSelectedAnimalId(null);
    } else {
      setIsGameCompleted(true);
      audioSystem.playFanfare();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
      });
    }
  };

  // Leaderboard updater
  const updateUserScoreInLeaderboard = (newScore: number, newStars: number) => {
    setLeaderboard((prev) => {
      const existingIdx = prev.findIndex((e) => e.name === profile.name);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          score: Math.max(updated[existingIdx].score, newScore),
          stars: Math.max(updated[existingIdx].stars, newStars),
          completedStages: Math.min(4, currentStageIndex + 1),
        };
        return updated;
      } else {
        const newEntry: LeaderboardEntry = {
          id: `player_${Date.now()}`,
          name: profile.name,
          avatar: profile.avatar,
          score: newScore,
          stars: newStars,
          accuracy: 95,
          completedStages: Math.min(4, currentStageIndex + 1),
          date: 'Just now',
        };
        return [newEntry, ...prev];
      }
    });
  };

  // Restart current stage
  const handleResetStage = () => {
    audioSystem.playPop();
    setPlacedAnimals({});
    setSelectedAnimalId(null);
  };

  // Play whole game again
  const handleRestartFullGame = () => {
    audioSystem.playPop();
    setCurrentStageIndex(0);
    setPlacedAnimals({});
    setSelectedAnimalId(null);
    setIsGameCompleted(false);
    setScore(0);
    setStars(0);
  };

  return (
    <div
      onClick={handleFirstInteraction}
      className="min-h-screen flex flex-col bg-[#fdfbf7] selection:bg-amber-200 selection:text-amber-900"
    >
      {/* =========================================================================
          TOP BAR CONTRACT (Section 2: 1-line brand wordmark - 4-5 single-line nav links - 1 primary action)
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleRestartFullGame();
            }}
            className="font-display font-extrabold text-lg md:text-xl text-amber-950 tracking-tight whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="text-2xl">🐾</span>
            <span>Animal Fun English · 趣味动物英语</span>
          </a>

          {/* Zone 2: 4 single-line nav links (The 4 Curriculum Stages) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {STAGES_DATA.map((stg, idx) => {
              const isActive = currentStageIndex === idx;
              return (
                <button
                  key={stg.id}
                  onClick={() => handleSelectStage(idx)}
                  className={`transition-colors whitespace-nowrap shrink-0 font-display font-semibold text-xs md:text-sm ${
                    isActive
                      ? 'text-amber-700 font-bold border-b-2 border-amber-500 pb-0.5'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {stg.title}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                handleFirstInteraction();
                setIsLeaderboardOpen(true);
              }}
              className="px-4 py-2 text-xs md:text-sm font-display font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Trophy className="w-4 h-4 text-amber-900" />
              <span>Scoreboard / 排行榜</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          WORKSPACE UTILITY CONTROLS BAR (Audio, Teacher Assistant, Profile, Score)
          ========================================================================= */}
      <section className="bg-gradient-to-r from-amber-100/60 via-orange-50/50 to-emerald-100/60 border-b border-amber-200/60 py-2.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Audio & Classroom Tools */}
          <div className="flex items-center gap-2">
            {/* Cheerful BGM Switcher */}
            <button
              onClick={handleToggleBgm}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                isBgmOn
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Nursery BGM (轻快儿歌背景音乐)"
            >
              <Music className={`w-3.5 h-3.5 ${isBgmOn ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <span>{isBgmOn ? 'BGM: Playing 🎵' : 'BGM: Music Off 🔇'}</span>
            </button>

            {/* Teacher Assistant Mode */}
            <button
              onClick={() => {
                handleFirstInteraction();
                setIsTeacherModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Teacher Mode / 备课助手</span>
            </button>
          </div>

          {/* Right: Student Avatar, Stars, Points */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-amber-200 hover:border-amber-400 transition-colors shadow-2xs"
            >
              <span className="text-base">{profile.avatar}</span>
              <span className="text-slate-800">{profile.name}</span>
            </button>

            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-2xs text-amber-900 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{stars} Stars</span>
            </div>

            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-2xs text-emerald-800 font-bold">
              <span>{score} pts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Stage Selector Strip */}
      <div className="lg:hidden flex overflow-x-auto gap-2 px-4 py-2 bg-amber-50 border-b border-amber-200">
        {STAGES_DATA.map((stg, idx) => (
          <button
            key={stg.id}
            onClick={() => handleSelectStage(idx)}
            className={`px-3 py-1 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
              currentStageIndex === idx
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            Part {stg.order}: {stg.title.replace('Part ' + stg.order + ': ', '')}
          </button>
        ))}
      </div>

      {/* =========================================================================
          MAIN INTERACTIVE LEARNING STAGE
          ========================================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col justify-between">
        {/* Stage Header Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 font-display font-bold text-xs px-3.5 py-1 rounded-full mb-2 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentStage.title} · {currentStage.titleCn}</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-4xl text-slate-900 tracking-tight">
            Separate into the Big &amp; Small Plates!
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            {currentStage.subtitle}
          </p>

          {/* Teacher TPR Hint Banner */}
          <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-[11px] md:text-xs text-orange-950 font-medium">
            <span>🤸 <strong>TPR动作提示:</strong> {currentStage.tprHint}</span>
          </div>
        </div>

        {/* Floating feedback alert */}
        {floatingFeedback && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in zoom-in-90 duration-150">
            <div
              className={`px-5 py-2.5 rounded-2xl font-display font-bold text-sm shadow-xl flex items-center gap-2 ${
                floatingFeedback.isSuccess
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              <span>{floatingFeedback.text}</span>
            </div>
          </div>
        )}

        {/* Animal Pen: Waiting to be Sorted */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-slate-800">
                Animals to Sort · 待分类动物
              </span>
              <span className="text-xs font-semibold text-slate-400">
                ({unplacedAnimals.length} remaining)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">
                💡 Tip: Drag animal or tap it, then tap a plate!
              </span>
              <button
                onClick={handleResetStage}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                title="Reset current stage animals"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {unplacedAnimals.length === 0 ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
              <CheckCircle className="w-12 h-12 text-emerald-600 mb-2" />
              <h3 className="font-display font-extrabold text-xl text-emerald-950">
                All Animals Sorted in Plates! 盘子装满啦！
              </h3>
              <p className="text-xs text-emerald-800 mt-1 mb-4">
                Now let&apos;s listen to teacher and read each animal out loud!
              </p>
              <button
                onClick={() => setIsReadAlongOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <Volume2 className="w-5 h-5" />
                <span>Start Follow-Along &amp; Read / 开始跟读 🎤</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-3xl bg-amber-100/40 border-2 border-amber-200 min-h-[170px] items-center">
              {unplacedAnimals.map((animal) => {
                const isSelected = selectedAnimalId === animal.id;
                return (
                  <div
                    key={animal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, animal.id)}
                    onClick={() => handleSelectAnimalToPlace(animal)}
                    className={`relative group flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white border-2 transition-all cursor-grab active:cursor-grabbing hover:scale-105 ${
                      isSelected
                        ? 'border-amber-500 ring-4 ring-amber-300 shadow-xl bg-amber-50/50'
                        : 'border-amber-200 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <AnimalIllustration
                      type={animal.type}
                      size={animal.size}
                      className={animal.size === 'big' ? 'w-24 h-24' : 'w-18 h-18'}
                    />
                    <div className="text-center mt-1">
                      <span className="font-display font-bold text-xs md:text-sm text-slate-800 capitalize block leading-tight">
                        {animal.fullPhrase}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {animal.chinese}
                      </span>
                    </div>

                    {/* Size tag */}
                    <span
                      className={`absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        animal.size === 'big'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-orange-200 text-orange-900'
                      }`}
                    >
                      {animal.size.toUpperCase()}
                    </span>

                    {/* Sound button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audioSystem.speak(animal.fullPhrase, 0.9);
                      }}
                      className="absolute top-2 right-2 p-1 rounded-full bg-slate-100 text-slate-600 hover:text-amber-700 hover:bg-amber-100 transition-colors"
                      title="Listen pronunciation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* The Two Plates: Big Plate & Small Plate */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Big Plate */}
          <PlateTarget
            size="big"
            title="Big Plate (大盘子)"
            titleCn="放置所有大体型的动物"
            items={bigPlacedAnimals}
            expectedTotal={totalRequiredBig}
            stageTheme={currentStage.themeColor}
            stageType={currentStage.animals[0]?.type || 'kangaroo'}
            isDragOver={dragOverPlate === 'big'}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverPlate('big');
            }}
            onDragLeave={() => setDragOverPlate(null)}
            onDrop={(e) => {
              e.preventDefault();
              handleDropOnPlate('big');
            }}
            onClickPlate={() => handleClickPlate('big')}
            onItemClick={(item) => audioSystem.speak(item.fullPhrase, 0.85)}
          />

          {/* Small Plate */}
          <PlateTarget
            size="small"
            title="Small Plate (小盘子)"
            titleCn="放置所有小体型的动物"
            items={smallPlacedAnimals}
            expectedTotal={totalRequiredSmall}
            stageTheme={currentStage.themeColor}
            stageType={currentStage.animals[0]?.type || 'kangaroo'}
            isDragOver={dragOverPlate === 'small'}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverPlate('small');
            }}
            onDragLeave={() => setDragOverPlate(null)}
            onDrop={(e) => {
              e.preventDefault();
              handleDropOnPlate('small');
            }}
            onClickPlate={() => handleClickPlate('small')}
            onItemClick={(item) => audioSystem.speak(item.fullPhrase, 0.85)}
          />
        </section>

        {/* Action Controls & Navigation Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Curriculum Progress: Part {currentStage.order} of {STAGES_DATA.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsReadAlongOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 text-amber-900 font-display font-bold text-xs md:text-sm shadow-xs transition-colors"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Practice Read-Along (跟读练习)</span>
            </button>

            {currentStageIndex < STAGES_DATA.length - 1 ? (
              <button
                onClick={() => handleSelectStage(currentStageIndex + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs md:text-sm shadow-md transition-all active:scale-95"
              >
                <span>Next Part / 下一关</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsGameCompleted(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs md:text-sm shadow-md transition-all active:scale-95"
              >
                <span>Final Summary / 查看总评 🏆</span>
              </button>
            )}
          </div>
        </div>
      </main>

      {/* =========================================================================
          GAME COMPLETION MODAL / CELEBRATION
          ========================================================================= */}
      {isGameCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 md:p-8 border-4 border-amber-400 shadow-2xl text-center flex flex-col items-center">
            <div className="text-5xl mb-2 animate-bounce">🏆</div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 mb-1">
              Super Animal Master!
            </h2>
            <p className="text-xs md:text-sm text-slate-600 mb-5">
              恭喜你完成了全部四个关卡的盘子分类与跟读练习！
            </p>

            {/* Score & Star Card */}
            <div className="w-full bg-amber-100/70 border border-amber-300 rounded-2xl p-4 mb-5 flex items-center justify-around">
              <div>
                <span className="text-xs text-slate-600 font-semibold block">Total Score</span>
                <span className="font-display font-black text-2xl text-amber-900">{score} pts</span>
              </div>
              <div className="h-8 w-px bg-amber-300" />
              <div>
                <span className="text-xs text-slate-600 font-semibold block">Stars Collected</span>
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  <span className="font-display font-black text-2xl text-amber-900">{stars}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRestartFullGame}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs md:text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again / 再玩一次</span>
              </button>

              <button
                onClick={() => {
                  setIsGameCompleted(false);
                  setIsLeaderboardOpen(true);
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-display font-bold text-xs md:text-sm shadow-md transition-all"
              >
                <Trophy className="w-4 h-4" />
                <span>View Rank / 查看排行榜</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <ReadAlongModal
        isOpen={isReadAlongOpen}
        items={currentStage.animals}
        onClose={() => setIsReadAlongOpen(false)}
        onCompleteAll={handleCompleteReadAlong}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboard}
        currentProfile={profile}
        currentScore={score}
        currentStars={stars}
        onUpdateProfile={(newProfile) => {
          setProfile(newProfile);
          updateUserScoreInLeaderboard(score, stars);
        }}
        onResetScores={() => setLeaderboard(INITIAL_LEADERBOARD)}
      />

      <TeacherToolkitModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-8 border-t border-amber-200/60 py-4 px-6 text-center text-xs text-slate-400">
        <p>
          Primary English Teaching Game · Bat, Fly, Kangaroo, Panda &amp; Rabbit · Big &amp; Small Phonics &amp; Sorting
        </p>
      </footer>
    </div>
  );
}
