import React from 'react';
import { WinterScene } from './WinterScene';

export const WinterModalBackdrop: React.FC = () => (
  <div className="winter-modal-backdrop" aria-hidden="true">
    <svg className="winter-modal-sky" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="modal-night-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#071321" />
          <stop offset="0.58" stopColor="#102938" />
          <stop offset="1" stopColor="#193541" />
        </linearGradient>
        <radialGradient id="modal-moon-glow">
          <stop offset="0" stopColor="#FFF4D3" stopOpacity="0.78" />
          <stop offset="0.38" stopColor="#FFE6AC" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFE6AC" stopOpacity="0" />
        </radialGradient>
        <filter id="modal-moon-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <linearGradient id="modal-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DCE8EE" />
          <stop offset="1" stopColor="#F5F9FB" />
        </linearGradient>
        <g id="modal-spruce">
          <path d="M48 0 20 56h19L6 104h22L-7 155h44v45h22v-45h44l-35-51h22L57 56h19Z" fill="#102B37" />
          <path d="M47 12 27 56h16L13 103h20L1 151m49-139 20 44H54l29 47H63l28 48" fill="none" stroke="#DCE8E9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.56" />
        </g>
        <g id="modal-spruce-front">
          <path d="M48 0 18 60h20L4 112h25L-9 168h47v48h22v-48h47l-38-56h25L58 60h20Z" fill="#0A202B" />
          <path d="M47 14 25 61h17L12 112h21L0 163m49-149 22 47H54l31 51H63l29 51" fill="none" stroke="#EAF2F2" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
        </g>
      </defs>

      <rect width="600" height="900" fill="url(#modal-night-sky)" />

      {/* Bright full moon high on the left */}
      <circle cx="108" cy="132" r="126" fill="url(#modal-moon-glow)" filter="url(#modal-moon-blur)" />
      <circle cx="108" cy="132" r="68" fill="#FFF4D6" />
      <circle cx="88" cy="113" r="9" fill="#E6D6B0" opacity="0.28" />
      <circle cx="127" cy="149" r="12" fill="#E6D6B0" opacity="0.2" />
      <circle cx="123" cy="100" r="5" fill="#E6D6B0" opacity="0.23" />

      {/* Stars over the night sky */}
      <g fill="#F5F1DF">
        <circle cx="248" cy="76" r="2" opacity="0.7" />
        <circle cx="322" cy="164" r="1.5" opacity="0.62" />
        <circle cx="495" cy="91" r="2" opacity="0.78" />
        <circle cx="428" cy="215" r="1.5" opacity="0.65" />
        <circle cx="223" cy="240" r="2" opacity="0.7" />
        <circle cx="542" cy="278" r="1.5" opacity="0.74" />
        <circle cx="42" cy="262" r="1.5" opacity="0.62" />
      </g>
      <g stroke="#F5F1DF" strokeWidth="2" opacity="0.65">
        <path d="M365 105v12m-6-6h12M520 167v10m-5-5h10M278 298v10m-5-5h10" />
      </g>

      {/* Snowy taiga ridge */}
      <path d="M0 510c85-43 155-6 231-38 96-39 147 7 229-20 47-16 89-19 140-9v390H0Z" fill="#102834" opacity="0.72" />
      <g opacity="0.68">
        <use href="#modal-spruce" transform="translate(-18 388) scale(0.92)" />
        <use href="#modal-spruce" transform="translate(95 421) scale(0.72)" />
        <use href="#modal-spruce" transform="translate(198 382) scale(0.98)" />
        <use href="#modal-spruce" transform="translate(310 416) scale(0.74)" />
        <use href="#modal-spruce" transform="translate(411 380) scale(0.96)" />
        <use href="#modal-spruce" transform="translate(516 418) scale(0.78)" />
      </g>
      <g>
        <use href="#modal-spruce-front" transform="translate(-15 548) scale(0.92)" />
        <use href="#modal-spruce-front" transform="translate(109 521) scale(1.02)" />
        <use href="#modal-spruce-front" transform="translate(238 557) scale(0.88)" />
        <use href="#modal-spruce-front" transform="translate(353 520) scale(1.02)" />
        <use href="#modal-spruce-front" transform="translate(486 547) scale(0.9)" />
      </g>
      <path d="M0 738c82-31 149 1 230-12 110-18 164-28 264-8 42 9 75 8 106 2v180H0Z" fill="url(#modal-snow)" />
      <path d="M0 768c82-23 152 7 230-4 103-14 171-23 269-5 43 8 70 6 101-1" fill="none" stroke="#FFFFFF" strokeWidth="7" opacity="0.75" />

      {/* Santa glides from right to left beneath the moon and above the trees */}
      <path d="M620 312c-122-26-205 12-314-2-89-11-142 2-218 17" fill="none" stroke="#E8C978" strokeWidth="2" strokeDasharray="2 13" strokeLinecap="round" opacity="0.42" />
      <g transform="translate(500 264)">
        <g className="winter-santa-flight">
          <path d="M36 77c26 16 82 18 131 2l18 4c-20 25-99 35-145 17-12-5-18-13-16-21Z" fill="#8D3E3D" stroke="#E7C878" strokeWidth="4" strokeLinejoin="round" />
          <path d="M28 106c38 18 108 17 157-5m-166 10c47 24 126 24 179-1" fill="none" stroke="#E7C878" strokeWidth="4" strokeLinecap="round" />
          <path d="M38 77c-18-6-29-18-25-31 14 7 25 7 36 2" fill="none" stroke="#E7C878" strokeWidth="4" strokeLinecap="round" />
          <path d="M87 69c-5-17 4-32 22-37 19-5 35 8 38 25l-7 19Z" fill="#9B4642" stroke="#281F24" strokeWidth="3" />
          <circle cx="119" cy="35" r="17" fill="#EFD8BD" />
          <path d="M102 30c3-16 24-23 39-12l10 11-29-4-13 9Z" fill="#A94541" stroke="#281F24" strokeWidth="3" />
          <path d="M145 17c10-1 13 4 8 10-5 4-10 1-12-3Z" fill="#F3E9D8" />
          <path d="M107 43c8 9 19 11 29 5l8 9c-8 12-27 14-40 5Z" fill="#F3E9D8" />
          <path d="M93 72c16 7 36 8 54 2l7 15c-21 13-48 12-68 1Z" fill="#8F3537" stroke="#E7C878" strokeWidth="3" />
          <path d="m108 61-8 26m29-28 8 28" stroke="#3C2B2B" strokeWidth="7" strokeLinecap="round" />
          <path d="M68 39c-17-12-36-3-34 13 2 12 18 22 35 20 14-2 19-16 10-26Z" fill="#547452" stroke="#2A342C" strokeWidth="3" />
          <path d="M43 44c10 6 23 7 34 2m-27 12 26-10" fill="none" stroke="#E7C878" strokeWidth="3" />
          <circle cx="54" cy="48" r="3" fill="#C95750" />
          <circle cx="67" cy="57" r="3" fill="#E7C878" />
        </g>
      </g>
    </svg>

    <WinterScene showMoon={false} className="winter-modal-ger" />
    <div className="winter-modal-tint" />
  </div>
);
