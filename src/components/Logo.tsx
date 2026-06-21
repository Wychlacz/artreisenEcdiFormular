import React from 'react';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`relative flex items-center select-none ${className}`} id="brand-logo-container">
      <svg 
        viewBox="0 0 200 170" 
        className="w-24 h-20 md:w-28 md:h-24 filter drop-shadow-sm hover:scale-105 transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Authentic 3-stop warm diagonal gradient for the sun stripes */}
          <linearGradient id="sunGrad" x1="0.10" y1="0.90" x2="0.85" y2="0.15">
            <stop offset="0%" stopColor="#ffd400" />    {/* Pure yellow bottom-left */}
            <stop offset="50%" stopColor="#f37021" />   {/* Orange middle */}
            <stop offset="100%" stopColor="#e30613" />  {/* Red top-right */}
          </linearGradient>

          {/* Semicircle mask for the sun: radius 53, centered at (100, 115) */}
          <clipPath id="sunClipPath">
            <path d="M 47,115 A 53,53 0 0,1 153,115 Z" />
          </clipPath>

          {/* Perfect circular text path arched over the sun (radius 75, center 100, 115) */}
          <path id="logoTextPath" d="M 25,115 A 75,75 0 0,1 175,115" fill="none" />
        </defs>

        {/* Tilted Sun Stripes */}
        <g clipPath="url(#sunClipPath)" id="logo-sun-group">
          <g transform="rotate(-7.5, 100, 115)">
            <rect x="15" y="45" width="170" height="5.2" fill="url(#sunGrad)" />
            <rect x="15" y="54" width="170" height="5.2" fill="url(#sunGrad)" />
            <rect x="15" y="63" width="170" height="5.2" fill="url(#sunGrad)" />
            <rect x="15" y="72" width="170" height="5.2" fill="url(#sunGrad)" />
            <rect x="15" y="81" width="170" height="5.2" fill="url(#sunGrad)" />
            <rect x="15" y="90" width="170" height="5.2" fill="url(#sunGrad)" />
            <rect x="15" y="99" width="170" height="5.2" fill="url(#sunGrad)" />
            <rect x="15" y="108" width="170" height="5.2" fill="url(#sunGrad)" />
            <rect x="15" y="117" width="170" height="5.2" fill="url(#sunGrad)" />
            <rect x="15" y="126" width="170" height="5.2" fill="url(#sunGrad)" />
          </g>
        </g>

        {/* Beautiful tapered royal blue wave curve under the sun */}
        <path 
          d="M 15,152 C 50,148 100,134 185,125 C 130,128 70,146 15,152 Z" 
          fill="#0082c3" 
          id="logo-swoosh-wave"
        />

        {/* Curved brand name font with authentic lowercase styling and a clear peak layout gap */}
        <g 
          fill="#0082c3" 
          fontSize="24" 
          fontWeight="700" 
          fontFamily='"Comfortaa", "Nunito", system-ui, sans-serif'
          letterSpacing="0.04em"
          id="logo-curved-text"
        >
          {/* Left word: "art" */}
          <text>
            <textPath href="#logoTextPath" startOffset="24%" textAnchor="middle">
              art
            </textPath>
          </text>
          
          {/* Right word: "reisen" */}
          <text>
            <textPath href="#logoTextPath" startOffset="76%" textAnchor="middle">
              reisen
            </textPath>
          </text>
        </g>
      </svg>
    </div>
  );
}

