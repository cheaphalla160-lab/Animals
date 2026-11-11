import React from 'react';
import { AnimalItem, AnimalSize } from '../types';
import { AnimalIllustration } from './AnimalIllustrations';
import { Check, Sparkles } from 'lucide-react';

interface PlateTargetProps {
  size: AnimalSize;
  title: string;
  titleCn: string;
  items: AnimalItem[];
  expectedTotal: number;
  stageTheme: {
    bg: string;
    border: string;
    accent: string;
    plateBig: string;
    plateSmall: string;
  };
  stageType: 'bat' | 'fly' | 'kangaroo' | 'panda' | 'rabbit' | 'bat_fly';
  onDropItem?: (size: AnimalSize) => void;
  onItemClick?: (item: AnimalItem) => void;
  isDragOver?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  onClickPlate?: () => void;
}

export const PlateTarget: React.FC<PlateTargetProps> = ({
  size,
  title,
  titleCn,
  items,
  expectedTotal,
  stageTheme,
  stageType,
  onItemClick,
  isDragOver = false,
  onDragOver,
  onDragLeave,
  onDrop,
  onClickPlate,
}) => {
  const isBig = size === 'big';
  const isFull = items.length >= expectedTotal;

  // Thematic decorations for the plates
  const getDecorations = () => {
    switch (stageType) {
      case 'panda':
        return isBig ? '🎋 Bamboo Forest Treat' : '🌱 Tender Bamboo Leaf';
      case 'rabbit':
        return isBig ? '🥕 Crunchy Farm Carrots' : '🥕 Sweet Baby Carrot';
      case 'kangaroo':
        return isBig ? '🌿 Fresh Outback Leaves' : '🌼 Little Sunny Blossom';
      default:
        return isBig ? '🍉 Sweet Melon & Fruit' : '🫐 Little Berry Treat';
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClickPlate}
      className={`relative flex flex-col items-center justify-between p-6 rounded-3xl transition-all duration-300 border-4 cursor-pointer select-none ${
        isBig
          ? 'min-h-[340px] md:min-h-[380px] bg-amber-50/70'
          : 'min-h-[300px] md:min-h-[340px] bg-amber-50/50'
      } ${
        isDragOver
          ? 'border-emerald-500 scale-102 shadow-2xl ring-4 ring-emerald-300/60'
          : isFull
          ? 'border-emerald-400 bg-emerald-50/40 shadow-lg'
          : 'border-amber-200/90 hover:border-amber-400 shadow-md hover:shadow-xl'
      }`}
      style={{
        boxShadow: isDragOver
          ? '0 20px 35px -10px rgba(16, 185, 129, 0.25)'
          : '0 10px 25px -8px rgba(180, 83, 9, 0.08)',
      }}
    >
      {/* Plate Header Ribbon */}
      <div className="w-full flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`font-display font-bold tracking-wide rounded-full px-3.5 py-1 text-sm shadow-sm flex items-center gap-1.5 ${
              isBig
                ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
                : 'bg-orange-300 text-orange-950 ring-2 ring-orange-200'
            }`}
          >
            {isBig ? '🌟 BIG' : '✨ SMALL'}
          </span>
          <div className="text-left">
            <h3 className="font-display font-bold text-slate-800 text-base md:text-lg leading-tight">
              {title}
            </h3>
            <span className="text-xs font-medium text-slate-500">
              {titleCn}
            </span>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1 rounded-full border border-amber-200 shadow-xs">
          <span className="font-display font-bold text-xs text-amber-900">
            {items.length} / {expectedTotal}
          </span>
          {isFull && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
        </div>
      </div>

      {/* Plate Dish Oval Surface */}
      <div
        className={`relative w-full flex-1 flex flex-wrap items-center justify-center gap-4 rounded-full border-4 border-dashed transition-all duration-300 p-4 ${
          isFull
            ? 'border-emerald-300 bg-white/80'
            : isDragOver
            ? 'border-emerald-400 bg-emerald-100/50'
            : 'border-amber-300/80 bg-white/60 hover:bg-white/80'
        }`}
        style={{
          boxShadow: 'inset 0 4px 12px rgba(0, 0, 0, 0.04)',
        }}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div
              className={`rounded-full flex items-center justify-center mb-2 border-2 ${
                isBig
                  ? 'w-16 h-16 bg-amber-100 border-amber-300 text-amber-700'
                  : 'w-13 h-13 bg-orange-100 border-orange-300 text-orange-700'
              }`}
            >
              <Sparkles className={isBig ? 'w-8 h-8' : 'w-6 h-6'} />
            </div>
            <p className="font-display font-semibold text-slate-600 text-sm md:text-base">
              {isBig ? 'Put BIG animals here!' : 'Put SMALL animals here!'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {isBig ? '将大动物放在这个大盘子里' : '将小动物放在这个小盘子里'}
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                if (onItemClick) onItemClick(item);
              }}
              className="group relative flex flex-col items-center bg-white rounded-2xl p-3 border-2 border-amber-200 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <AnimalIllustration
                type={item.type}
                size={item.size}
                className={isBig ? 'w-24 h-24' : 'w-18 h-18'}
              />
              <span className="font-display font-bold text-xs md:text-sm text-slate-800 mt-1 capitalize">
                {item.fullPhrase}
              </span>
              <span className="text-[11px] text-slate-500 font-sans">
                {item.chinese}
              </span>
              <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Thematic Plate Base Decor */}
      <div className="w-full flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-amber-200/60 px-2">
        <span className="font-medium text-amber-900/80 flex items-center gap-1">
          {getDecorations()}
        </span>
        <span className="text-[11px] text-slate-400">
          {isFull ? '✅ Plate ready!' : 'Drag or click to place'}
        </span>
      </div>
    </div>
  );
};
