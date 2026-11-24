import "./Characters.css";

// Two original cartoon characters for the fireworks show.

// A cheerful girl with puffy pigtail buns, waving a sparkler. `tipRef` marks
// the sparkler's tip so the fireworks engine can emit sparks from it.
export function SparklerGirl({ tipRef, waving = false, className = "" }) {
  const skin = "#B97A4F";
  const hair = "#2B1B14";
  return (
    <svg viewBox="0 0 160 280" className={`char-girl ${waving ? "is-waving" : ""} ${className}`} aria-hidden="true">
      {/* legs + shoes */}
      <rect x="64" y="200" width="11" height="44" rx="5" fill={skin} />
      <rect x="85" y="200" width="11" height="44" rx="5" fill={skin} />
      <ellipse cx="68" cy="248" rx="12" ry="6.5" fill="#FFD166" stroke="#E0A23B" strokeWidth="2" />
      <ellipse cx="92" cy="248" rx="12" ry="6.5" fill="#FFD166" stroke="#E0A23B" strokeWidth="2" />

      {/* teal flared skirt + sunshine-yellow top */}
      <path d="M52 172 L108 172 L120 210 C 100 218, 60 218, 40 210 Z" fill="#2EC4B6" />
      <path d="M52 172 L108 172 L112 182 C 96 186, 64 186, 48 182 Z" fill="#25A99D" />
      <rect x="54" y="116" width="52" height="62" rx="18" fill="#FFC93C" />
      <circle cx="80" cy="134" r="3" fill="#F72585" />
      <circle cx="80" cy="148" r="3" fill="#F72585" />

      {/* resting arm */}
      <line x1="56" y1="126" x2="42" y2="168" stroke={skin} strokeWidth="11" strokeLinecap="round" />
      <circle cx="41" cy="171" r="6.5" fill={skin} />

      {/* waving arm with the sparkler */}
      <g className="char-girl__arm">
        <line x1="104" y1="126" x2="126" y2="86" stroke={skin} strokeWidth="11" strokeLinecap="round" />
        <circle cx="128" cy="82" r="6.5" fill={skin} />
        <line x1="128" y1="82" x2="146" y2="38" stroke="#8D99AE" strokeWidth="2.5" strokeLinecap="round" />
        <circle ref={tipRef} cx="146" cy="38" r="2.5" fill="#FFF3C4" />
      </g>

      {/* neck + head */}
      <rect x="74" y="104" width="12" height="16" rx="4" fill={skin} />
      <circle cx="48" cy="50" r="17" fill={hair} />
      <circle cx="112" cy="50" r="17" fill={hair} />
      <circle cx="48" cy="50" r="5" fill="#F72585" />
      <circle cx="112" cy="50" r="5" fill="#F72585" />
      <circle cx="80" cy="78" r="33" fill={skin} />
      <path d="M47 74 C 46 46, 114 46, 113 74 C 104 60, 88 58, 80 64 C 72 58, 56 60, 47 74 Z" fill={hair} />

      {/* face */}
      <ellipse cx="68" cy="82" rx="5.5" ry="7" fill="#FFFFFF" />
      <ellipse cx="92" cy="82" rx="5.5" ry="7" fill="#FFFFFF" />
      <circle cx="69" cy="84" r="3.6" fill="#1D1529" />
      <circle cx="93" cy="84" r="3.6" fill="#1D1529" />
      <circle cx="70.2" cy="82.6" r="1.2" fill="#FFFFFF" />
      <circle cx="94.2" cy="82.6" r="1.2" fill="#FFFFFF" />
      <ellipse cx="60" cy="94" rx="5" ry="3" fill="#F28482" opacity="0.6" />
      <ellipse cx="100" cy="94" rx="5" ry="3" fill="#F28482" opacity="0.6" />
      <path d="M71 96 Q 80 106 89 96 Z" fill="#7A2E2E" />
      <path d="M75 99.5 Q 80 103 85 99.5" fill="#F28482" />
    </svg>
  );
}

// A proud graduate in gown and mortarboard, holding her rolled certificate up
// high, with a travel suitcase beside her — degree done, next stop London.
export function GraduateWoman({ className = "" }) {
  const skin = "#B97A4F";
  const hair = "#1F140F";
  const gown = "#1F2A5A";
  return (
    <svg viewBox="0 0 190 300" className={`char-grad ${className}`} aria-hidden="true">
      {/* suitcase with a London sticker */}
      <g>
        <rect x="22" y="128" width="4" height="46" rx="2" fill="#6B6F80" />
        <rect x="44" y="128" width="4" height="46" rx="2" fill="#6B6F80" />
        <rect x="20" y="124" width="30" height="7" rx="3" fill="#6B6F80" />
        <rect x="8" y="172" width="54" height="88" rx="10" fill="#9478CF" />
        <rect x="8" y="172" width="54" height="88" rx="10" fill="none" stroke="#7A5BC0" strokeWidth="2" />
        <line x1="22" y1="178" x2="22" y2="254" stroke="#7A5BC0" strokeWidth="2" />
        <line x1="48" y1="178" x2="48" y2="254" stroke="#7A5BC0" strokeWidth="2" />
        <rect x="14" y="196" width="40" height="20" rx="4" fill="#FFF8EF" />
        <text x="34" y="210.5" textAnchor="middle" fontSize="10" fontWeight="800" fontFamily="Inter, sans-serif" fill="#C8102E">LDN</text>
        <circle cx="40" cy="236" r="7" fill="#F6C453" />
        <circle cx="18" cy="264" r="5" fill="#2B2B38" />
        <circle cx="52" cy="264" r="5" fill="#2B2B38" />
      </g>

      {/* hair falling behind the shoulders */}
      <path d="M78 70 C 70 110, 72 132, 82 144 L 128 144 C 138 132, 140 110, 132 70 Z" fill={hair} />

      {/* gown + gold stole */}
      <path d="M72 112 L138 112 L158 274 L52 274 Z" fill={gown} />
      <path d="M95 112 L84 112 L76 220 L90 220 Z" fill="#F6C453" />
      <path d="M115 112 L126 112 L134 220 L120 220 Z" fill="#F6C453" />
      <path d="M95 112 L105 128 L115 112 Z" fill={skin} />
      <ellipse cx="88" cy="278" rx="12" ry="5" fill="#2B1B14" />
      <ellipse cx="122" cy="278" rx="12" ry="5" fill="#2B1B14" />

      {/* left arm resting on the suitcase handle */}
      <path d="M76 120 C 60 132, 46 128, 36 128" stroke={gown} strokeWidth="16" strokeLinecap="round" fill="none" />
      <circle cx="35" cy="128" r="7" fill={skin} />

      {/* right arm raising the certificate */}
      <g className="char-grad__arm">
        <path d="M134 120 C 150 104, 156 84, 160 66" stroke={gown} strokeWidth="16" strokeLinecap="round" fill="none" />
        <circle cx="161" cy="60" r="7.5" fill={skin} />
        <g transform="rotate(-28 161 60)">
          <rect x="140" y="52" width="44" height="14" rx="7" fill="#FFF8EF" stroke="#E8DCC5" strokeWidth="1.5" />
          <ellipse cx="184" cy="59" rx="3" ry="7" fill="#EFE3CC" />
          <rect x="158" y="51" width="6" height="16" fill="#C8102E" />
          <circle cx="161" cy="70" r="4" fill="#F6C453" />
        </g>
        <path className="char-grad__sparkle" d="M178 22 Q 178 30 186 30 Q 178 30 178 38 Q 178 30 170 30 Q 178 30 178 22 Z" fill="#FFE38B" />
      </g>

      {/* head + face */}
      <rect x="99" y="96" width="12" height="16" rx="4" fill={skin} />
      <circle cx="105" cy="78" r="26" fill={skin} />
      <path d="M79 74 C 80 56, 130 52, 131 74 C 120 64, 104 62, 92 68 C 88 70, 82 72, 79 74 Z" fill={hair} />
      <rect x="88" y="73" width="13" height="10" rx="4" fill="none" stroke="#1D1529" strokeWidth="2" />
      <rect x="109" y="73" width="13" height="10" rx="4" fill="none" stroke="#1D1529" strokeWidth="2" />
      <line x1="101" y1="77" x2="109" y2="77" stroke="#1D1529" strokeWidth="2" />
      <circle cx="94.5" cy="78.5" r="2.6" fill="#1D1529" />
      <circle cx="115.5" cy="78.5" r="2.6" fill="#1D1529" />
      <ellipse cx="88" cy="90" rx="4.5" ry="2.6" fill="#F28482" opacity="0.55" />
      <ellipse cx="122" cy="90" rx="4.5" ry="2.6" fill="#F28482" opacity="0.55" />
      <path d="M98 92 Q 105 99 112 92" stroke="#7A2E2E" strokeWidth="2.4" fill="none" strokeLinecap="round" />

      {/* mortarboard with a swinging tassel */}
      <path d="M84 58 L126 58 L124 48 L86 48 Z" fill="#141022" />
      <path d="M64 46 L105 30 L146 46 L105 62 Z" fill="#1D1529" />
      <path d="M64 46 L105 30 L146 46 L105 36 Z" fill="#2C2342" />
      <circle cx="105" cy="46" r="3" fill="#F6C453" />
      <g className="char-grad__tassel">
        <path d="M105 46 L138 50 L140 70" stroke="#F6C453" strokeWidth="2" fill="none" />
        <rect x="136" y="68" width="8" height="12" rx="2" fill="#F6C453" />
      </g>
    </svg>
  );
}

// A cheerful little boy in a striped tee, blowing a party horn.
export function PartyBoy({ cheering = false, className = "" }) {
  const skin = "#D9A274";
  return (
    <svg viewBox="0 0 150 230" className={`char-boy ${cheering ? "is-cheering" : ""} ${className}`} aria-hidden="true">
      {/* legs + sneakers */}
      <rect x="56" y="172" width="12" height="36" rx="5" fill={skin} />
      <rect x="80" y="172" width="12" height="36" rx="5" fill={skin} />
      <path d="M48 206 h24 a6 6 0 0 1 0 12 h-24 z" fill="#FFFFFF" stroke="#4CC9F0" strokeWidth="2" />
      <path d="M78 206 h24 a6 6 0 0 1 0 12 h-24 z" fill="#FFFFFF" stroke="#4CC9F0" strokeWidth="2" />

      {/* navy shorts + striped tee */}
      <rect x="50" y="150" width="48" height="30" rx="8" fill="#2B3A67" />
      <rect x="46" y="96" width="56" height="62" rx="16" fill="#FFFFFF" />
      <rect x="46" y="106" width="56" height="8" fill="#2EC4B6" />
      <rect x="46" y="124" width="56" height="8" fill="#2EC4B6" />
      <rect x="46" y="142" width="56" height="8" fill="#2EC4B6" />

      {/* arm raised in a cheer */}
      <g className="char-boy__arm-up">
        <line x1="50" y1="106" x2="28" y2="72" stroke={skin} strokeWidth="10" strokeLinecap="round" />
        <circle cx="26" cy="68" r="7" fill={skin} />
      </g>
      {/* arm holding the party horn to his mouth */}
      <line x1="98" y1="108" x2="106" y2="80" stroke={skin} strokeWidth="10" strokeLinecap="round" />
      <circle cx="104" cy="76" r="6.5" fill={skin} />
      <path className="char-boy__horn" d="M96 70 L 136 52 L 138 62 Z" fill="#F72585" />
      <path d="M118 60 L 122 58 L 124 64 L 120 65 Z" fill="#FFD166" />

      {/* head with messy hair */}
      <circle cx="74" cy="62" r="30" fill={skin} />
      <path d="M44 58 C 42 30, 60 24, 74 28 C 86 20, 108 30, 104 56 C 98 46, 90 44, 84 48 C 80 40, 68 40, 62 48 C 56 42, 48 46, 44 58 Z" fill="#4A2C1A" />
      <path d="M72 30 C 70 20, 78 16, 82 22" stroke="#4A2C1A" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* face */}
      <circle cx="63" cy="64" r="4" fill="#1D1529" />
      <circle cx="85" cy="64" r="4" fill="#1D1529" />
      <circle cx="64.3" cy="62.6" r="1.3" fill="#FFFFFF" />
      <circle cx="86.3" cy="62.6" r="1.3" fill="#FFFFFF" />
      <ellipse cx="56" cy="74" rx="5" ry="3" fill="#F28482" opacity="0.55" />
      <ellipse cx="92" cy="74" rx="5" ry="3" fill="#F28482" opacity="0.55" />
      <path d="M66 76 Q 74 86 82 76 Z" fill="#7A2E2E" />
    </svg>
  );
}

// A soft honey-coloured teddy bear with a bow tie, party hat and balloon.
export function PartyBear({ cheering = false, className = "" }) {
  const fur = "#D4A05A";
  const light = "#F3D3A1";
  return (
    <svg viewBox="0 0 150 240" className={`char-bear ${cheering ? "is-cheering" : ""} ${className}`} aria-hidden="true">
      {/* balloon on a string */}
      <path d="M118 120 C 124 96, 112 80, 120 62" stroke="#9AA0A6" strokeWidth="1.5" fill="none" />
      <g className="char-bear__balloon">
        <ellipse cx="122" cy="40" rx="18" ry="22" fill="#B8A1E3" />
        <ellipse cx="116" cy="32" rx="5" ry="7" fill="#FFFFFF" opacity="0.5" />
        <path d="M119 61 L 125 61 L 122 66 Z" fill="#9478CF" />
      </g>

      {/* feet + body */}
      <ellipse cx="56" cy="212" rx="16" ry="12" fill={fur} />
      <ellipse cx="94" cy="212" rx="16" ry="12" fill={fur} />
      <ellipse cx="56" cy="214" rx="8" ry="6" fill={light} />
      <ellipse cx="94" cy="214" rx="8" ry="6" fill={light} />
      <ellipse cx="75" cy="168" rx="38" ry="44" fill={fur} />
      <ellipse cx="75" cy="176" rx="24" ry="28" fill={light} />

      {/* arms: one waving, one holding the balloon string */}
      <g className="char-bear__wave">
        <ellipse cx="34" cy="140" rx="11" ry="20" fill={fur} transform="rotate(35 34 140)" />
      </g>
      <ellipse cx="114" cy="140" rx="11" ry="20" fill={fur} transform="rotate(-30 114 140)" />

      {/* pink bow tie */}
      <path d="M75 126 L 58 116 L 58 136 Z" fill="#F72585" />
      <path d="M75 126 L 92 116 L 92 136 Z" fill="#F72585" />
      <circle cx="75" cy="126" r="5" fill="#FF8FAB" />

      {/* head, ears, face */}
      <circle cx="46" cy="66" r="15" fill={fur} />
      <circle cx="104" cy="66" r="15" fill={fur} />
      <circle cx="46" cy="66" r="8" fill={light} />
      <circle cx="104" cy="66" r="8" fill={light} />
      <circle cx="75" cy="88" r="38" fill={fur} />
      <ellipse cx="75" cy="102" rx="18" ry="14" fill={light} />
      <circle cx="62" cy="84" r="4.2" fill="#1D1529" />
      <circle cx="88" cy="84" r="4.2" fill="#1D1529" />
      <circle cx="63.4" cy="82.6" r="1.3" fill="#FFFFFF" />
      <circle cx="89.4" cy="82.6" r="1.3" fill="#FFFFFF" />
      <ellipse cx="75" cy="96" rx="5.5" ry="4" fill="#5A3A22" />
      <path d="M68 104 Q 75 112 82 104" stroke="#5A3A22" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="54" cy="98" rx="5" ry="3" fill="#F28482" opacity="0.5" />
      <ellipse cx="96" cy="98" rx="5" ry="3" fill="#F28482" opacity="0.5" />

      {/* party hat */}
      <path d="M62 56 L 75 20 L 88 56 Z" fill="#2EC4B6" />
      <path d="M66 46 L 84 46 L 86 52 L 64 52 Z" fill="#FFD166" />
      <circle cx="75" cy="19" r="5" fill="#F72585" />
    </svg>
  );
}

// A cheeky monkey in a party hat who lights the crackers with a long fuse stick.
export function FuseMonkey({ lighting = false, className = "" }) {
  const fur = "#9C6B3F";
  const face = "#F1CFA0";
  return (
    <svg viewBox="0 0 170 230" className={`char-monkey ${lighting ? "is-lighting" : ""} ${className}`} aria-hidden="true">
      {/* curly tail */}
      <path d="M118 176 C 160 176, 164 128, 140 126 C 124 125, 128 144, 140 142" stroke={fur} strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* legs + feet */}
      <rect x="66" y="170" width="13" height="30" rx="6" fill={fur} />
      <rect x="91" y="170" width="13" height="30" rx="6" fill={fur} />
      <ellipse cx="70" cy="203" rx="11" ry="6" fill={face} />
      <ellipse cx="100" cy="203" rx="11" ry="6" fill={face} />

      {/* body + belly + scarf */}
      <ellipse cx="85" cy="144" rx="34" ry="38" fill={fur} />
      <ellipse cx="85" cy="150" rx="21" ry="25" fill={face} />
      <path d="M58 116 C 72 126, 98 126, 112 116 L 110 128 C 96 136, 74 136, 60 128 Z" fill="#7B2CBF" />
      <path d="M100 126 L 112 152 L 98 148 Z" fill="#7B2CBF" />

      {/* free arm, raised in a cheer */}
      <line x1="56" y1="132" x2="36" y2="106" stroke={fur} strokeWidth="10" strokeLinecap="round" />
      <circle cx="34" cy="103" r="7" fill={face} />

      {/* arm holding the glowing fuse stick */}
      <g className="char-monkey__arm">
        <line x1="112" y1="132" x2="140" y2="150" stroke={fur} strokeWidth="10" strokeLinecap="round" />
        <circle cx="143" cy="152" r="7" fill={face} />
        <line x1="143" y1="152" x2="162" y2="176" stroke="#6B4F3A" strokeWidth="2.5" strokeLinecap="round" />
        <circle className="char-monkey__ember" cx="162" cy="176" r="3.2" fill="#FF7B3B" />
      </g>

      {/* head, ears, face */}
      <circle cx="48" cy="80" r="13" fill={fur} />
      <circle cx="122" cy="80" r="13" fill={fur} />
      <circle cx="48" cy="80" r="7" fill={face} />
      <circle cx="122" cy="80" r="7" fill={face} />
      <circle cx="85" cy="82" r="35" fill={fur} />
      <ellipse cx="85" cy="92" rx="25" ry="21" fill={face} />
      <ellipse cx="74" cy="74" rx="9" ry="10" fill={face} />
      <ellipse cx="96" cy="74" rx="9" ry="10" fill={face} />
      <ellipse cx="74" cy="76" rx="5" ry="6" fill="#FFFFFF" />
      <ellipse cx="96" cy="76" rx="5" ry="6" fill="#FFFFFF" />
      <circle cx="75" cy="78" r="3.2" fill="#1D1529" />
      <circle cx="97" cy="78" r="3.2" fill="#1D1529" />
      <circle cx="76" cy="76.8" r="1" fill="#FFFFFF" />
      <circle cx="98" cy="76.8" r="1" fill="#FFFFFF" />
      <ellipse cx="85" cy="90" rx="3.5" ry="2.2" fill="#5A3A22" />
      <path d="M72 98 Q 85 112 98 98 Z" fill="#5A2A1A" />
      <path d="M78 103 Q 85 108 92 103" fill="#F28482" />

      {/* party hat */}
      <path d="M70 52 L 85 14 L 100 52 Z" fill="#F72585" />
      <path d="M75 40 L 95 40 L 98 48 L 72 48 Z" fill="#FFD166" />
      <circle cx="85" cy="13" r="5" fill="#4CC9F0" />
    </svg>
  );
}
