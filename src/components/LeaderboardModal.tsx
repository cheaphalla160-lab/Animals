import React, { useState } from 'react';
import { LeaderboardEntry, StudentProfile } from '../types';
import { Trophy, Medal, Star, X, User, RotateCcw, Award } from 'lucide-react';
import { audioSystem } from '../utils/audioSystem';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  currentProfile: StudentProfile;
  currentScore: number;
  currentStars: number;
  onUpdateProfile: (profile: StudentProfile) => void;
  onResetScores?: () => void;
}

const AVATARS = ['🐰', '🦘', '🐼', '🦇', '🪰', '🐨', '🦁', '🐻', '🦊', '🐯'];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  currentProfile,
  currentScore,
  currentStars,
  onUpdateProfile,
  onResetScores,
}) => {
  const [editingName, setEditingName] = useState(currentProfile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(currentProfile.avatar);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    audioSystem.playPop();
    const finalName = editingName.trim() || 'Star Learner';
    onUpdateProfile({
      name: finalName,
      avatar: selectedAvatar,
    });
    setIsEditing(false);
  };

  // Sort entries by score descending
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 md:p-8 border-4 border-amber-300 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-200/80 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
                Classroom Leaderboard
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                班级分数排行榜 · 明星小能手
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

        {/* Current Student Profile Bar */}
        <div className="bg-amber-100/70 border border-amber-200 rounded-2xl p-3.5 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-2xl bg-white p-2 rounded-xl border border-amber-300 shadow-2xs hover:scale-105 transition-transform"
              title="Change Avatar"
            >
              {currentProfile.avatar}
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-slate-900 text-base">
                  {currentProfile.name}
                </span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[11px] font-semibold text-amber-800 underline hover:text-amber-950"
                >
                  {isEditing ? 'Cancel' : 'Edit Name'}
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 mt-0.5">
                <span className="flex items-center gap-1 font-bold text-amber-900">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  {currentStars} Stars
                </span>
                <span>·</span>
                <span className="font-bold text-emerald-800">
                  {currentScore} Points
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
              Your Rank
            </span>
          </div>
        </div>

        {/* Edit Profile Form (if opened) */}
        {isEditing && (
          <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 mb-4 animate-in slide-in-from-top-2 duration-150">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Choose Animal Avatar:
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`text-xl p-1.5 rounded-xl border-2 transition-transform ${
                    selectedAvatar === av
                      ? 'border-amber-500 bg-amber-100 scale-110 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>

            <label className="block text-xs font-bold text-slate-700 mb-1">
              Student Name (英文名/学号):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                maxLength={20}
                placeholder="e.g. Lucas, Amy, 05"
                className="flex-1 px-3 py-1.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={handleSaveProfile}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Leaderboard List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {sortedEntries.map((entry, index) => {
            const isTop1 = index === 0;
            const isTop2 = index === 1;
            const isTop3 = index === 2;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-colors ${
                  isTop1
                    ? 'bg-amber-100/90 border-amber-300 shadow-xs'
                    : isTop2
                    ? 'bg-slate-100/80 border-slate-300'
                    : isTop3
                    ? 'bg-orange-50/80 border-orange-200'
                    : 'bg-white border-amber-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className="w-7 text-center font-display font-extrabold text-sm">
                    {isTop1 ? (
                      <span className="text-amber-600">🥇</span>
                    ) : isTop2 ? (
                      <span className="text-slate-500">🥈</span>
                    ) : isTop3 ? (
                      <span className="text-amber-700">🥉</span>
                    ) : (
                      <span className="text-slate-400">#{index + 1}</span>
                    )}
                  </div>

                  <span className="text-2xl p-1 bg-white/80 rounded-xl shadow-2xs">
                    {entry.avatar}
                  </span>

                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-800 leading-tight">
                      {entry.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {entry.completedStages} Stages Done · {entry.accuracy}% accuracy
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-display font-black text-amber-900 text-base leading-tight">
                    {entry.score} pts
                  </div>
                  <div className="flex items-center justify-end gap-1 text-xs text-amber-700">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>{entry.stars}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & Reset option */}
        <div className="pt-4 mt-3 border-t border-amber-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>Keep sorting &amp; speaking to earn more stars!</span>
          {onResetScores && (
            <button
              onClick={() => {
                if (window.confirm('Reset classroom scoreboard to defaults? 确定重置排行榜吗？')) {
                  onResetScores();
                }
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
