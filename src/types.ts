export type StageId = 'bat_fly' | 'kangaroo' | 'panda' | 'rabbit';

export type AnimalSize = 'big' | 'small';

export interface AnimalItem {
  id: string;
  word: string;
  fullPhrase: string; // e.g. "big kangaroo" or "small panda"
  chinese: string;
  phonetic: string;
  size: AnimalSize;
  type: 'bat' | 'fly' | 'kangaroo' | 'panda' | 'rabbit';
  placedInPlate?: AnimalSize | null;
  sentence: string;
  chant: string;
  syllables: string[];
}

export interface StageConfig {
  id: StageId;
  order: number;
  title: string;
  titleCn: string;
  subtitle: string;
  themeColor: {
    bg: string;
    border: string;
    accent: string;
    plateBig: string;
    plateSmall: string;
  };
  animals: AnimalItem[];
  teachingNotes: string;
  tprHint: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  stars: number;
  accuracy: number;
  completedStages: number;
  date: string;
}

export interface StudentProfile {
  name: string;
  avatar: string;
}
