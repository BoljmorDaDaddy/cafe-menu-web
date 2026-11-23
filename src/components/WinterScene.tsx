import React from 'react';

interface WinterSceneProps {
  showMoon?: boolean;
  className?: string;
}

export const WinterScene: React.FC<WinterSceneProps> = ({ showMoon = true, className = '' }) => (
  <div className={`winter-story-scene ${className}`} aria-hidden="true">
    <svg viewBox="0 0 1200 340" role="presentation" preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id="ger-felt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0DDB5" />
          <stop offset="1" stopColor="#CBB58F" />
        </linearGradient>
        <linearGradient id="ger-roof" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#E7D4AE" />
          <stop offset="1" stopColor="#BBA47E" />
        </linearGradient>

        <radialGradient id="lantern-glow">
          <stop offset="0" stopColor="#FFD88D" stopOpacity="0.7" />
          <stop offset="1" stopColor="#F5A855" stopOpacity="0" />
        </radialGradient>
        <filter id="moon-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      {showMoon && (
        <>
          {/* Quarter moon and winter stars */}
          <circle cx="112" cy="66" r="48" fill="#EFDDAF" opacity="0.2" filter="url(#moon-glow)" />
          <path d="M116 24a42 42 0 1 0 0 84 33 33 0 0 1 0-84Z" fill="#F4E7C4" />
          <circle cx="208" cy="54" r="2" fill="#F4E7C4" opacity="0.7" />
          <circle cx="262" cy="102" r="1.5" fill="#F4E7C4" opacity="0.6" />
          <circle cx="1007" cy="65" r="2" fill="#F4E7C4" opacity="0.65" />
          <circle cx="1080" cy="116" r="1.5" fill="#F4E7C4" opacity="0.7" />
        </>
      )}

      {/* Distant snowy hills */}
      <path d="M0 250 88 198l67 25 93-75 89 90 101-66 89 73 92-94 95 78 94-59 92 65 95-80 105 92v93H0Z" fill="#1A3340" opacity="0.85" />
      <path d="m154 223 94-75 89 90-22-17-19 8-22-23-22 6-16-16-22 8-22-12Z" fill="#A9BBC3" opacity="0.28" />
      <path d="m516 223 92-94 95 78-20-13-19 6-22-19-23 7-18-16-23 9-18-11Z" fill="#A9BBC3" opacity="0.24" />

      {/* Soft amber street-lamp pools */}
      <ellipse cx="132" cy="235" rx="115" ry="70" fill="url(#lantern-glow)" opacity="0.42" />
      <ellipse cx="1083" cy="239" rx="125" ry="70" fill="url(#lantern-glow)" opacity="0.36" />
      <g stroke="#53636A" strokeWidth="5" strokeLinecap="round">
        <path d="M132 155v133M115 157h34M120 157l5-15h14l5 15" />
        <path d="M1083 155v133M1066 157h34M1071 157l5-15h14l5 15" />
      </g>
      <path d="M122 157h20l-3 21h-14Z" fill="#F0BD69" stroke="#8B6740" strokeWidth="2" />
      <path d="M1073 157h20l-3 21h-14Z" fill="#F0BD69" stroke="#8B6740" strokeWidth="2" />
      <path d="M126 161h12v5h-12Z M1077 161h12v5h-12Z" fill="#FFF0C7" opacity="0.85" />

      {/* Mongolian ger */}
      <g transform="translate(-210 10)">
        <g transform="translate(1150 0) scale(-1 1)">
      <ellipse cx="575" cy="287" rx="194" ry="19" fill="#07151D" opacity="0.45" />
      <path d="M421 177c0-62 68-113 154-113s154 51 154 113v87c-101 23-207 23-308 0Z" fill="url(#ger-felt)" stroke="#493A32" strokeWidth="5" />
      <path d="M421 178c0-62 68-114 154-114s154 52 154 114c-28-23-81-36-154-36s-126 13-154 36Z" fill="url(#ger-roof)" stroke="#493A32" strokeWidth="5" />
      <path d="M542 61V16h22v47" fill="#465258" stroke="#302D2B" strokeWidth="4" strokeLinejoin="round" />
      <path d="M538 17h30v7h-30Z" fill="#78848A" stroke="#302D2B" strokeWidth="3" />
      <path d="M548 31v23" stroke="#AEB9BC" strokeWidth="3" opacity="0.55" />
      <path className="ger-smoke-wisp" d="M553 15c-18-9 10-19-3-30" fill="none" stroke="#D3DDE0" strokeWidth="5" strokeLinecap="round" />
      <path className="ger-smoke-wisp ger-smoke-wisp--two" d="M564 12c14-8-3-13 7-21" fill="none" stroke="#D3DDE0" strokeWidth="4" strokeLinecap="round" />
      <path className="ger-smoke-wisp ger-smoke-wisp--three" d="M549 10c-7-7 5-11 0-19" fill="none" stroke="#D3DDE0" strokeWidth="3" strokeLinecap="round" />
      <path d="M531 65c5-15 13-24 22-29 9 5 17 14 22 29Z" fill="#9A7658" stroke="#493A32" strokeWidth="4" />
      <ellipse cx="553" cy="66" rx="22" ry="7" fill="#D7C39E" stroke="#493A32" strokeWidth="3" />
      <path d="M424 178c87-25 171-25 302 0" fill="none" stroke="#8E3F3C" strokeWidth="8" />
      <path d="M424 187c88-22 171-22 302 0" fill="none" stroke="#E5BD6B" strokeWidth="3" />
      <path d="M433 200 452 222l-19 21m35-44 19 22-19 21m38-42 19 22-19 21m38-42 19 22-19 21m38-42 19 22-19 21m38-42 19 22-19 21m38-42 19 22-19 21m38-42 19 22-19 21" fill="none" stroke="#957D5F" strokeWidth="2" opacity="0.75" />
      <path d="M421 248c100 19 207 19 308 0" fill="none" stroke="#8E3F3C" strokeWidth="6" />
      <path d="M421 256c100 18 207 18 308 0" fill="none" stroke="#E5BD6B" strokeWidth="2" />
      <path d="M526 264v-52c0-17 12-30 27-30s27 13 27 30v58Z" fill="#49352D" stroke="#352925" strokeWidth="4" />
      <path d="M534 263v-49c0-11 8-20 19-20s19 9 19 20v52Z" fill="#D88D4F" />
      <path d="M542 261v-45c0-6 5-11 11-11s11 5 11 11v46Z" fill="#F8CA78" opacity="0.86" />
      <circle cx="566" cy="238" r="2.5" fill="#6B3E2D" />
      <circle cx="553" cy="198" r="9" fill="none" stroke="#57754D" strokeWidth="4" />
      <circle cx="547" cy="194" r="2" fill="#B94B47" />
      <circle cx="560" cy="201" r="2" fill="#B94B47" />
      <path d="M550 188l-5-4m5 4 4-5m-4 5 5 3" fill="none" stroke="#D9B65A" strokeWidth="2" strokeLinecap="round" />
      <g fill="#F5C86D">
        <circle cx="447" cy="165" r="4" /><circle cx="475" cy="151" r="4" />
        <circle cx="507" cy="143" r="4" /><circle cx="553" cy="140" r="4" />
        <circle cx="598" cy="143" r="4" /><circle cx="630" cy="151" r="4" />
        <circle cx="658" cy="165" r="4" />
      </g>
      <g fill="#B94B47">
        <circle cx="461" cy="157" r="3" /><circle cx="522" cy="142" r="3" />
        <circle cx="614" cy="147" r="3" /><circle cx="645" cy="157" r="3" />
      </g>
        </g>
      </g>

      {/* Snow-covered foreground */}
      <path d="M0 292c135-23 236 7 358-3 127-12 211-28 343-9 148 22 275 19 499-6v66H0Z" fill="#DDE9EF" opacity="0.82" />
      <path d="M0 309c120-19 222-1 336-5 141-5 249-24 380-10 177 19 322 15 484-4v50H0Z" fill="#F5F9FB" opacity="0.9" />
      <path d="M70 293c42-8 83-9 125-4m485 2c47-6 92-4 134 3m179-14c30-3 59-2 87 1" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
    </svg>
  </div>
);
