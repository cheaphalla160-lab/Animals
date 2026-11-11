import React from 'react';
import { AnimalSize } from '../types';

interface AnimalSvgProps {
  type: 'bat' | 'fly' | 'kangaroo' | 'panda' | 'rabbit';
  size: AnimalSize;
  className?: string;
  isAnimated?: boolean;
}

export const AnimalIllustration: React.FC<AnimalSvgProps> = ({
  type,
  size,
  className = 'w-24 h-24',
  isAnimated = true,
}) => {
  const isBig = size === 'big';

  switch (type) {
    case 'bat':
      return (
        <svg
          viewBox="0 0 160 140"
          className={`${className} ${isAnimated ? 'hover:scale-105 transition-transform duration-200' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bat Glow / Shadow */}
          <ellipse cx="80" cy="130" rx={isBig ? 45 : 30} ry="8" fill="#e2e8f0" />

          {/* Wings */}
          {isBig ? (
            <g className={isAnimated ? 'animate-pulse' : ''} style={{ animationDuration: '3s' }}>
              {/* Left Wing */}
              <path
                d="M 70 65 Q 40 20 10 38 C 15 55 25 75 40 85 C 50 82 62 76 70 70 Z"
                fill="#4338ca"
              />
              <path
                d="M 25 45 Q 38 60 42 78"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Right Wing */}
              <path
                d="M 90 65 Q 120 20 150 38 C 145 55 135 75 120 85 C 110 82 98 76 90 70 Z"
                fill="#4338ca"
              />
              <path
                d="M 135 45 Q 122 60 118 78"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          ) : (
            // Small Bat Cute Folded / Tiny Wings
            <g>
              <path
                d="M 72 70 Q 52 40 32 52 C 36 65 44 80 55 86 Z"
                fill="#6366f1"
              />
              <path
                d="M 88 70 Q 108 40 128 52 C 124 65 116 80 105 86 Z"
                fill="#6366f1"
              />
            </g>
          )}

          {/* Bat Body */}
          <ellipse
            cx="80"
            cy={isBig ? 85 : 90}
            rx={isBig ? 28 : 20}
            ry={isBig ? 32 : 24}
            fill="#312e81"
          />
          {/* Fluffy Tummy */}
          <ellipse
            cx="80"
            cy={isBig ? 90 : 92}
            rx={isBig ? 18 : 13}
            ry={isBig ? 20 : 15}
            fill="#4f46e5"
          />

          {/* Ears */}
          <polygon
            points={isBig ? "62,60 52,32 72,46" : "66,70 58,48 74,60"}
            fill="#312e81"
          />
          <polygon
            points={isBig ? "64,56 56,38 70,48" : "67,66 61,52 72,59"}
            fill="#f472b6"
          />
          <polygon
            points={isBig ? "98,60 108,32 88,46" : "94,70 102,48 86,60"}
            fill="#312e81"
          />
          <polygon
            points={isBig ? "96,56 104,38 90,48" : "93,66 99,52 88,59"}
            fill="#f472b6"
          />

          {/* Head */}
          <circle cx="80" cy={isBig ? 62 : 72} r={isBig ? 24 : 18} fill="#3730a3" />

          {/* Big Cartoon Eyes */}
          <circle cx={isBig ? 72 : 74} cy={isBig ? 60 : 70} r={isBig ? 6.5 : 5.5} fill="#ffffff" />
          <circle cx={isBig ? 88 : 86} cy={isBig ? 60 : 70} r={isBig ? 6.5 : 5.5} fill="#ffffff" />
          <circle cx={isBig ? 73 : 75} cy={isBig ? 60 : 70} r={isBig ? 3.5 : 3} fill="#0f172a" />
          <circle cx={isBig ? 89 : 87} cy={isBig ? 60 : 70} r={isBig ? 3.5 : 3} fill="#0f172a" />
          {/* Eye sparkles */}
          <circle cx={isBig ? 74.5 : 76} cy={isBig ? 58.5 : 68.5} r={isBig ? 1.5 : 1.2} fill="#ffffff" />
          <circle cx={isBig ? 90.5 : 88} cy={isBig ? 58.5 : 68.5} r={isBig ? 1.5 : 1.2} fill="#ffffff" />

          {/* Cheeks */}
          <ellipse cx={isBig ? 66 : 70} cy={isBig ? 66 : 75} rx="4" ry="2.5" fill="#f472b6" opacity="0.6" />
          <ellipse cx={isBig ? 94 : 90} cy={isBig ? 66 : 75} rx="4" ry="2.5" fill="#f472b6" opacity="0.6" />

          {/* Cute Mouth & Tiny Fangs */}
          <path
            d={isBig ? "M 75 68 Q 80 72 85 68" : "M 76 76 Q 80 79 84 76"}
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <polygon points={isBig ? "76,69 77.5,73 79,69" : "77,77 78,79.5 79,77"} fill="#ffffff" />
          <polygon points={isBig ? "81,69 82.5,73 84,69" : "81,77 82,79.5 83,77"} fill="#ffffff" />

          {/* Feet */}
          <ellipse cx="73" cy={isBig ? 116 : 112} rx="4" ry="3" fill="#1e1b4b" />
          <ellipse cx="87" cy={isBig ? 116 : 112} rx="4" ry="3" fill="#1e1b4b" />
        </svg>
      );

    case 'fly':
      return (
        <svg
          viewBox="0 0 160 140"
          className={`${className} ${isAnimated ? 'hover:scale-105 transition-transform duration-200' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fly Shadow */}
          <ellipse cx="80" cy="126" rx={isBig ? 32 : 20} ry="6" fill="#e2e8f0" />

          {/* Iridescent Wings with shimmer */}
          <g className={isAnimated ? 'animate-float' : ''}>
            {/* Left Wings */}
            <path
              d={isBig ? "M 72 55 C 45 25 15 35 30 65 C 40 75 65 68 72 60" : "M 75 65 C 55 45 35 50 45 70 C 52 78 70 73 75 68"}
              fill="#bae6fd"
              fillOpacity="0.85"
              stroke="#0284c7"
              strokeWidth="2"
            />
            {/* Right Wings */}
            <path
              d={isBig ? "M 88 55 C 115 25 145 35 130 65 C 120 75 95 68 88 60" : "M 85 65 C 105 45 125 50 115 70 C 108 78 90 73 85 68"}
              fill="#bae6fd"
              fillOpacity="0.85"
              stroke="#0284c7"
              strokeWidth="2"
            />
            {/* Wing Veins */}
            <path d={isBig ? "M 48 50 Q 62 58 70 60" : "M 58 60 Q 68 66 74 68"} stroke="#38bdf8" strokeWidth="1.5" />
            <path d={isBig ? "M 112 50 Q 98 58 90 60" : "M 102 60 Q 92 66 86 68"} stroke="#38bdf8" strokeWidth="1.5" />
          </g>

          {/* Fly Body with Cute Stripes */}
          <ellipse
            cx="80"
            cy={isBig ? 85 : 88}
            rx={isBig ? 20 : 14}
            ry={isBig ? 28 : 20}
            fill="#0284c7"
          />
          {/* Stripes */}
          <path
            d={isBig ? "M 63 76 Q 80 82 97 76" : "M 68 82 Q 80 86 92 82"}
            stroke="#38bdf8"
            strokeWidth={isBig ? 4 : 3}
            strokeLinecap="round"
          />
          <path
            d={isBig ? "M 64 88 Q 80 94 96 88" : "M 69 91 Q 80 95 91 91"}
            stroke="#38bdf8"
            strokeWidth={isBig ? 4 : 3}
            strokeLinecap="round"
          />

          {/* Antennas */}
          <path
            d={isBig ? "M 74 48 Q 66 32 58 35" : "M 76 56 Q 70 42 64 45"}
            stroke="#0369a1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx={isBig ? 58 : 64} cy={isBig ? 35 : 45} r="3" fill="#f59e0b" />
          <path
            d={isBig ? "M 86 48 Q 94 32 102 35" : "M 84 56 Q 90 42 96 45"}
            stroke="#0369a1"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx={isBig ? 102 : 96} cy={isBig ? 35 : 45} r="3" fill="#f59e0b" />

          {/* Head & Big Friendly Compound Eyes */}
          <circle cx="80" cy={isBig ? 58 : 68} r={isBig ? 18 : 13} fill="#0369a1" />

          {/* Left Eye */}
          <ellipse cx={isBig ? 70 : 73} cy={isBig ? 55 : 66} rx={isBig ? 9 : 6.5} ry={isBig ? 10 : 7.5} fill="#f43f5e" />
          <ellipse cx={isBig ? 72 : 74.5} cy={isBig ? 53 : 64.5} rx={isBig ? 3.5 : 2.5} ry={isBig ? 4 : 3} fill="#ffffff" />

          {/* Right Eye */}
          <ellipse cx={isBig ? 90 : 87} cy={isBig ? 55 : 66} rx={isBig ? 9 : 6.5} ry={isBig ? 10 : 7.5} fill="#f43f5e" />
          <ellipse cx={isBig ? 92 : 88.5} cy={isBig ? 53 : 64.5} rx={isBig ? 3.5 : 2.5} ry={isBig ? 4 : 3} fill="#ffffff" />

          {/* Cute smile */}
          <path
            d={isBig ? "M 76 64 Q 80 68 84 64" : "M 77 72 Q 80 75 83 72"}
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Tiny Cute Legs */}
          <path d="M 62 90 L 52 100" stroke="#075985" strokeWidth="2" strokeLinecap="round" />
          <path d="M 98 90 L 108 100" stroke="#075985" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'kangaroo':
      return (
        <svg
          viewBox="0 0 160 150"
          className={`${className} ${isAnimated ? 'hover:scale-105 transition-transform duration-200' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground shadow */}
          <ellipse cx="80" cy="142" rx={isBig ? 48 : 32} ry="7" fill="#d1fae5" />

          {/* Kangaroo Tail */}
          <path
            d={isBig ? "M 60 115 C 35 118 15 130 10 142 C 28 142 50 132 68 122 Z" : "M 66 118 C 48 120 32 130 26 140 C 38 140 54 132 72 124 Z"}
            fill="#d97706"
          />

          {/* Body */}
          <path
            d={isBig ? "M 70 65 C 60 75 58 110 65 125 C 75 138 105 138 110 120 C 115 105 108 75 92 65 Z" : "M 72 75 C 64 85 62 110 68 122 C 76 132 98 132 104 118 C 108 105 102 85 90 75 Z"}
            fill="#f59e0b"
          />

          {/* Big Belly / Pouch */}
          <ellipse
            cx={isBig ? 90 : 88}
            cy={isBig ? 102 : 104}
            rx={isBig ? 18 : 13}
            ry={isBig ? 20 : 15}
            fill="#fef3c7"
          />

          {/* Pouch Seam / Baby Joey Peeking if Big Kangaroo */}
          {isBig ? (
            <g>
              <path
                d="M 78 98 Q 90 108 102 98"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Baby Joey Head in Mama Pouch */}
              <circle cx="90" cy="94" r="8" fill="#f59e0b" />
              <polygon points="86,88 84,82 89,86" fill="#f59e0b" />
              <polygon points="94,88 96,82 91,86" fill="#f59e0b" />
              <circle cx="88" cy="93" r="1.5" fill="#0f172a" />
              <circle cx="92" cy="93" r="1.5" fill="#0f172a" />
              <circle cx="90" cy="96" r="1" fill="#f43f5e" />
            </g>
          ) : null}

          {/* Strong Hop Legs & Big Paws */}
          <ellipse cx={isBig ? 65 : 70} cy={isBig ? 128 : 126} rx={isBig ? 14 : 10} ry={isBig ? 9 : 7} fill="#d97706" />
          <ellipse cx={isBig ? 105 : 98} cy={isBig ? 128 : 126} rx={isBig ? 14 : 10} ry={isBig ? 9 : 7} fill="#d97706" />
          <path
            d={isBig ? "M 60 134 L 85 137" : "M 66 132 L 84 135"}
            stroke="#92400e"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d={isBig ? "M 100 134 L 125 137" : "M 94 132 L 112 135"}
            stroke="#92400e"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Cute Little Paws in front */}
          <ellipse cx={isBig ? 85 : 84} cy={isBig ? 82 : 86} rx="5" ry="4" fill="#fbbf24" />
          <ellipse cx={isBig ? 95 : 92} cy={isBig ? 82 : 86} rx="5" ry="4" fill="#fbbf24" />

          {/* Tall Ears */}
          <path
            d={isBig ? "M 82 45 C 75 22 68 12 72 10 C 78 8 84 25 86 42 Z" : "M 82 52 C 76 34 70 25 74 24 C 79 23 84 35 86 50 Z"}
            fill="#d97706"
          />
          <path
            d={isBig ? "M 75 32 C 73 20 74 15 76 15 C 78 15 80 22 82 30" : "M 76 40 C 74 30 75 27 77 27 C 78 27 80 32 82 38"}
            stroke="#fbcfe8"
            strokeWidth={isBig ? 3.5 : 2.5}
            strokeLinecap="round"
          />

          <path
            d={isBig ? "M 94 45 C 101 22 108 12 104 10 C 98 8 92 25 90 42 Z" : "M 94 52 C 100 34 106 25 102 24 C 97 23 92 35 90 50 Z"}
            fill="#d97706"
          />
          <path
            d={isBig ? "M 101 32 C 103 20 102 15 100 15 C 98 15 96 22 94 30" : "M 100 40 C 102 30 101 27 99 27 C 98 27 96 32 94 38"}
            stroke="#fbcfe8"
            strokeWidth={isBig ? 3.5 : 2.5}
            strokeLinecap="round"
          />

          {/* Head */}
          <circle cx="88" cy={isBig ? 50 : 58} r={isBig ? 18 : 14} fill="#f59e0b" />
          {/* Snout */}
          <ellipse cx="94" cy={isBig ? 54 : 61} rx={isBig ? 11 : 8} ry={isBig ? 8 : 6} fill="#fef3c7" />
          <polygon
            points={isBig ? "98,52 103,52 100.5,56" : "97,60 101,60 99,63"}
            fill="#78350f"
          />

          {/* Big Shiny Eye */}
          <circle cx="85" cy={isBig ? 47 : 56} r={isBig ? 4.5 : 3.8} fill="#ffffff" />
          <circle cx="86" cy={isBig ? 47 : 56} r={isBig ? 2.8 : 2.3} fill="#0f172a" />
          <circle cx="87" cy={isBig ? 46 : 55} r="1" fill="#ffffff" />

          {/* Rosy Cheek */}
          <ellipse cx="84" cy={isBig ? 53 : 61} rx="3" ry="2" fill="#f43f5e" opacity="0.6" />
        </svg>
      );

    case 'panda':
      return (
        <svg
          viewBox="0 0 160 150"
          className={`${className} ${isAnimated ? 'hover:scale-105 transition-transform duration-200' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground shadow */}
          <ellipse cx="80" cy="142" rx={isBig ? 48 : 32} ry="7" fill="#dcfce7" />

          {/* Black Arms & Legs */}
          {/* Back feet */}
          <ellipse cx={isBig ? 56 : 64} cy={isBig ? 130 : 126} rx={isBig ? 16 : 11} ry={isBig ? 12 : 9} fill="#0f172a" />
          <ellipse cx={isBig ? 104 : 96} cy={isBig ? 130 : 126} rx={isBig ? 16 : 11} ry={isBig ? 12 : 9} fill="#0f172a" />
          {/* Paw pads */}
          <circle cx={isBig ? 56 : 64} cy={isBig ? 130 : 126} r={isBig ? 4 : 3} fill="#f472b6" />
          <circle cx={isBig ? 104 : 96} cy={isBig ? 130 : 126} r={isBig ? 4 : 3} fill="#f472b6" />

          {/* Panda Round Chubby Body */}
          <ellipse
            cx="80"
            cy={isBig ? 105 : 106}
            rx={isBig ? 36 : 25}
            ry={isBig ? 32 : 23}
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          {/* Black Shoulder Vest / Sleeves */}
          <path
            d={isBig ? "M 48 85 C 44 98 44 116 54 118 C 65 120 72 108 74 95 Z" : "M 58 92 C 55 102 55 114 62 116 C 70 117 74 108 76 98 Z"}
            fill="#0f172a"
          />
          <path
            d={isBig ? "M 112 85 C 116 98 116 116 106 118 C 95 120 88 108 86 95 Z" : "M 102 92 C 105 102 105 114 98 116 C 90 117 86 108 84 98 Z"}
            fill="#0f172a"
          />

          {/* Green Bamboo Stick (Big Panda holds a fresh bamboo shoot) */}
          {isBig ? (
            <g className={isAnimated ? 'animate-float' : ''} style={{ animationDuration: '4s' }}>
              <rect x="106" y="60" width="8" height="60" rx="3" fill="#22c55e" />
              <line x1="106" y1="78" x2="114" y2="78" stroke="#15803d" strokeWidth="2" />
              <line x1="106" y1="96" x2="114" y2="96" stroke="#15803d" strokeWidth="2" />
              {/* Leaves */}
              <path d="M 114 64 Q 130 55 132 66 Q 122 72 114 68 Z" fill="#4ade80" />
              <path d="M 114 82 Q 132 75 135 85 Q 124 90 114 86 Z" fill="#4ade80" />
            </g>
          ) : (
            // Baby panda tiny bamboo leaf
            <path d="M 94 96 Q 108 90 106 102 Q 98 104 94 98 Z" fill="#4ade80" />
          )}

          {/* Panda Round Ears */}
          <circle cx={isBig ? 55 : 62} cy={isBig ? 42 : 52} r={isBig ? 13 : 9} fill="#0f172a" />
          <circle cx={isBig ? 105 : 98} cy={isBig ? 42 : 52} r={isBig ? 13 : 9} fill="#0f172a" />

          {/* Panda Big Round Head */}
          <circle
            cx="80"
            cy={isBig ? 62 : 68}
            r={isBig ? 28 : 20}
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="2"
          />

          {/* Iconic Drooping Black Eye Patches */}
          <ellipse
            cx={isBig ? 68 : 72}
            cy={isBig ? 60 : 66}
            rx={isBig ? 8.5 : 6}
            ry={isBig ? 10.5 : 7.5}
            fill="#0f172a"
            transform={isBig ? "rotate(-18 68 60)" : "rotate(-18 72 66)"}
          />
          <ellipse
            cx={isBig ? 92 : 88}
            cy={isBig ? 60 : 66}
            rx={isBig ? 8.5 : 6}
            ry={isBig ? 10.5 : 7.5}
            fill="#0f172a"
            transform={isBig ? "rotate(18 92 60)" : "rotate(18 88 66)"}
          />

          {/* Cute White Pupils with Highlights */}
          <circle cx={isBig ? 70 : 73} cy={isBig ? 59 : 65} r={isBig ? 3.5 : 2.5} fill="#ffffff" />
          <circle cx={isBig ? 90 : 87} cy={isBig ? 59 : 65} r={isBig ? 3.5 : 2.5} fill="#ffffff" />
          <circle cx={isBig ? 71 : 73.8} cy={isBig ? 58.5 : 64.5} r="1" fill="#0f172a" />
          <circle cx={isBig ? 89 : 86.2} cy={isBig ? 58.5 : 64.5} r="1" fill="#0f172a" />

          {/* Blushing Pink Cheeks */}
          <circle cx={isBig ? 59 : 66} cy={isBig ? 68 : 72} r={isBig ? 4.5 : 3.5} fill="#fda4af" opacity="0.6" />
          <circle cx={isBig ? 101 : 94} cy={isBig ? 68 : 72} r={isBig ? 4.5 : 3.5} fill="#fda4af" opacity="0.6" />

          {/* Cute Nose and W-shaped Mouth */}
          <polygon
            points={isBig ? "77,67 83,67 80,71" : "78,71 82,71 80,74"}
            fill="#0f172a"
          />
          <path
            d={isBig ? "M 76 72 Q 80 76 84 72" : "M 77 75 Q 80 78 83 75"}
            stroke="#0f172a"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'rabbit':
      return (
        <svg
          viewBox="0 0 160 150"
          className={`${className} ${isAnimated ? 'hover:scale-105 transition-transform duration-200' : ''}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground shadow */}
          <ellipse cx="80" cy="142" rx={isBig ? 46 : 30} ry="7" fill="#ffe4e6" />

          {/* Fluffy Cotton Tail */}
          <circle cx={isBig ? 42 : 52} cy={isBig ? 122 : 122} r={isBig ? 11 : 8} fill="#ffffff" stroke="#fecdd3" strokeWidth="2" />

          {/* Rabbit Body */}
          <ellipse
            cx="80"
            cy={isBig ? 108 : 110}
            rx={isBig ? 34 : 24}
            ry={isBig ? 28 : 20}
            fill="#ffffff"
            stroke="#fbcfe8"
            strokeWidth="2"
          />

          {/* Feet */}
          <ellipse cx={isBig ? 64 : 70} cy={isBig ? 134 : 129} rx={isBig ? 14 : 9} ry={isBig ? 8 : 6} fill="#ffffff" stroke="#fbcfe8" strokeWidth="2" />
          <ellipse cx={isBig ? 96 : 90} cy={isBig ? 134 : 129} rx={isBig ? 14 : 9} ry={isBig ? 8 : 6} fill="#ffffff" stroke="#fbcfe8" strokeWidth="2" />
          <circle cx={isBig ? 64 : 70} cy={isBig ? 134 : 129} r="3" fill="#f472b6" />
          <circle cx={isBig ? 96 : 90} cy={isBig ? 134 : 129} r="3" fill="#f472b6" />

          {/* Crunchy Carrot */}
          {isBig ? (
            <g className={isAnimated ? 'animate-float' : ''} style={{ animationDuration: '3.2s' }}>
              <polygon points="102,96 128,114 116,118" fill="#f97316" />
              <path d="M 124 112 Q 134 118 136 124" stroke="#ea580c" strokeWidth="1.5" />
              {/* Carrot leafy tops */}
              <path d="M 102 96 Q 96 85 90 88 Q 96 95 102 96 Z" fill="#22c55e" />
              <path d="M 104 94 Q 106 82 112 84 Q 108 92 104 94 Z" fill="#4ade80" />
            </g>
          ) : (
            // Baby bunny tiny baby carrot
            <g>
              <polygon points="94,106 108,116 102,118" fill="#f97316" />
              <path d="M 94 106 L 90 102" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Long Fluffy Ears */}
          <g className={isAnimated ? 'animate-bounce' : ''} style={{ animationDuration: '4s' }}>
            {/* Left Ear */}
            <path
              d={isBig ? "M 70 54 C 55 24 55 6 66 5 C 76 4 78 24 76 52 Z" : "M 74 62 C 64 38 64 22 72 21 C 79 20 80 38 78 60 Z"}
              fill="#ffffff"
              stroke="#fbcfe8"
              strokeWidth="2"
            />
            <path
              d={isBig ? "M 68 44 C 61 24 61 14 66 13 C 71 12 72 24 71 42" : "M 72 52 C 67 36 67 28 71 27 C 75 26 76 35 75 50"}
              fill="#f472b6"
            />
            {/* Right Ear */}
            <path
              d={isBig ? "M 90 54 C 105 24 105 6 94 5 C 84 4 82 24 84 52 Z" : "M 86 62 C 96 38 96 22 88 21 C 81 20 80 38 82 60 Z"}
              fill="#ffffff"
              stroke="#fbcfe8"
              strokeWidth="2"
            />
            <path
              d={isBig ? "M 92 44 C 99 24 99 14 94 13 C 89 12 88 24 89 42" : "M 88 52 C 93 36 93 28 89 27 C 85 26 84 35 85 50"}
              fill="#f472b6"
            />
          </g>

          {/* Head */}
          <circle
            cx="80"
            cy={isBig ? 68 : 74}
            r={isBig ? 24 : 18}
            fill="#ffffff"
            stroke="#fbcfe8"
            strokeWidth="2"
          />

          {/* Big Sparkling Bunny Eyes */}
          <circle cx={isBig ? 71 : 73} cy={isBig ? 65 : 72} r={isBig ? 5 : 4} fill="#0f172a" />
          <circle cx={isBig ? 89 : 87} cy={isBig ? 65 : 72} r={isBig ? 5 : 4} fill="#0f172a" />
          <circle cx={isBig ? 72.5 : 74} cy={isBig ? 63.5 : 71} r={isBig ? 2 : 1.5} fill="#ffffff" />
          <circle cx={isBig ? 90.5 : 88} cy={isBig ? 63.5 : 71} r={isBig ? 2 : 1.5} fill="#ffffff" />

          {/* Pink Twitching Nose */}
          <polygon
            points={isBig ? "78,72 82,72 80,75" : "78.5,77 81.5,77 80,79.5"}
            fill="#f43f5e"
          />

          {/* Cheerful Mouth */}
          <path
            d={isBig ? "M 76 77 Q 80 81 84 77" : "M 77 81 Q 80 84 83 81"}
            stroke="#0f172a"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Cute Whiskers */}
          <line x1={isBig ? "62" : "66"} y1={isBig ? "73" : "77"} x2={isBig ? "48" : "56"} y2={isBig ? "71" : "76"} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={isBig ? "62" : "66"} y1={isBig ? "77" : "80"} x2={isBig ? "48" : "56"} y2={isBig ? "79" : "82"} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={isBig ? "98" : "94"} y1={isBig ? "73" : "77"} x2={isBig ? "112" : "104"} y2={isBig ? "71" : "76"} stroke="#cbd5e1" strokeWidth="1.5" />
          <line x1={isBig ? "98" : "94"} y1={isBig ? "77" : "80"} x2={isBig ? "112" : "104"} y2={isBig ? "79" : "82"} stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Blushing Cheeks */}
          <ellipse cx={isBig ? 64 : 68} cy={isBig ? 72 : 77} rx="4" ry="2.5" fill="#fda4af" opacity="0.6" />
          <ellipse cx={isBig ? 96 : 92} cy={isBig ? 72 : 77} rx="4" ry="2.5" fill="#fda4af" opacity="0.6" />
        </svg>
      );

    default:
      return null;
  }
};
