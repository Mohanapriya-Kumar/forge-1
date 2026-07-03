import React from 'react';

// Unified Mascot SVG Icons
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  glow?: boolean;
}

export const StarGuide: React.FC<IconProps & { floating?: boolean }> = ({ size = 64, glow = true, floating = true, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={floating ? 'floating-star' : ''}
    style={{ filter: glow ? 'drop-shadow(0 0 12px rgba(253, 224, 71, 0.8))' : 'none' }}
    {...props}
  >
    {/* Body */}
    <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#fde047" stroke="#ca8a04" strokeWidth="3" strokeLinejoin="round" />
    {/* Blush */}
    <circle cx="38" cy="48" r="4" fill="#f87171" opacity="0.6" />
    <circle cx="62" cy="48" r="4" fill="#f87171" opacity="0.6" />
    {/* Eyes */}
    <circle cx="42" cy="42" r="3" fill="#1e293b" />
    <circle cx="58" cy="42" r="3" fill="#1e293b" />
    {/* Smile */}
    <path d="M 46 50 Q 50 54 54 50" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const MascotIcon: React.FC<{ name: string; size?: number; glow?: boolean; className?: string }> = ({ name, size = 80, glow = false, className = '' }) => {
  const normName = name.toLowerCase();

  // Common wrapper styling
  const style = glow ? { filter: 'drop-shadow(0 0 8px currentColor)' } : undefined;

  switch (normName) {
    case 'beaver':
    case 'builder':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Beaver */}
          <circle cx="50" cy="50" r="40" fill="#a78bfa" stroke="#6d28d9" strokeWidth="3" />
          {/* Ears */}
          <circle cx="25" cy="20" r="10" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" />
          <circle cx="75" cy="20" r="10" fill="#7c3aed" stroke="#6d28d9" strokeWidth="2" />
          {/* Hard Hat */}
          <path d="M 28 35 Q 50 15 72 35 Z" fill="#fbbf24" stroke="#ca8a04" strokeWidth="2" />
          <rect x="46" y="22" width="8" height="15" fill="#f59e0b" />
          {/* Eyes */}
          <circle cx="40" cy="45" r="4" fill="#1e293b" />
          <circle cx="60" cy="45" r="4" fill="#1e293b" />
          {/* Teeth */}
          <rect x="47" y="58" width="6" height="6" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
          {/* Snout */}
          <ellipse cx="50" cy="52" rx="7" ry="5" fill="#ddd6fe" stroke="#6d28d9" strokeWidth="1.5" />
          <polygon points="48,50 52,50 50,52" fill="#1e293b" />
        </svg>
      );
    case 'owl':
    case 'scholar':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Owl Body */}
          <circle cx="50" cy="50" r="40" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="3" />
          {/* Ears / Tufts */}
          <polygon points="20,25 35,28 25,10" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
          <polygon points="80,25 65,28 75,10" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" />
          {/* Belly */}
          <ellipse cx="50" cy="65" rx="20" ry="15" fill="#eff6ff" />
          {/* Glasses */}
          <circle cx="40" cy="42" r="10" fill="none" stroke="#fbbf24" strokeWidth="3" />
          <circle cx="60" cy="42" r="10" fill="none" stroke="#fbbf24" strokeWidth="3" />
          <line x1="50" y1="42" x2="50" y2="42" stroke="#fbbf24" strokeWidth="3" />
          {/* Eyes inside glasses */}
          <circle cx="40" cy="42" r="3" fill="#1e293b" />
          <circle cx="60" cy="42" r="3" fill="#1e293b" />
          {/* Beak */}
          <polygon points="47,48 53,48 50,56" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1.5" />
        </svg>
      );
    case 'fox':
    case 'athlete':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Fox Body */}
          <circle cx="50" cy="55" r="36" fill="#fb923c" stroke="#c2410c" strokeWidth="3" />
          {/* Large Ears */}
          <polygon points="22,35 42,40 18,10" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
          <polygon points="78,35 58,40 82,10" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
          <polygon points="25,32 38,36 22,16" fill="#ffedd5" />
          <polygon points="75,32 62,36 78,16" fill="#ffedd5" />
          {/* White Snout */}
          <ellipse cx="50" cy="62" rx="16" ry="12" fill="#fff7ed" stroke="#c2410c" strokeWidth="2" />
          {/* Sweatband */}
          <rect x="25" y="42" width="50" height="8" fill="#ffffff" stroke="#c2410c" strokeWidth="2" />
          <rect x="45" y="42" width="10" height="8" fill="#ef4444" />
          {/* Eyes */}
          <circle cx="41" cy="54" r="3" fill="#1e293b" />
          <circle cx="59" cy="54" r="3" fill="#1e293b" />
          {/* Nose */}
          <circle cx="50" cy="62" r="4.5" fill="#1e293b" />
        </svg>
      );
    case 'turtle':
    case 'monk':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Turtle Shell */}
          <circle cx="50" cy="50" r="38" fill="#34d399" stroke="#047857" strokeWidth="3" />
          {/* Hexagon Pattern on Shell */}
          <polygon points="50,25 60,30 60,42 50,47 40,42 40,30" fill="none" stroke="#047857" strokeWidth="1.5" />
          <line x1="50" y1="25" x2="50" y2="15" stroke="#047857" strokeWidth="2" />
          <line x1="60" y1="30" x2="72" y2="25" stroke="#047857" strokeWidth="2" />
          <line x1="60" y1="42" x2="72" y2="48" stroke="#047857" strokeWidth="2" />
          <line x1="50" y1="47" x2="50" y2="60" stroke="#047857" strokeWidth="2" />
          <line x1="40" y1="42" x2="28" y2="48" stroke="#047857" strokeWidth="2" />
          <line x1="40" y1="30" x2="28" y2="25" stroke="#047857" strokeWidth="2" />
          {/* Head popping up */}
          <circle cx="50" cy="22" r="14" fill="#a7f3d0" stroke="#047857" strokeWidth="2" />
          <circle cx="45" cy="20" r="2" fill="#1e293b" />
          <circle cx="55" cy="20" r="2" fill="#1e293b" />
          <path d="M 47 26 Q 50 28 53 26" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'rabbit':
    case 'creator':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Bunny Body */}
          <circle cx="50" cy="56" r="34" fill="#f472b6" stroke="#be185d" strokeWidth="3" />
          {/* Long Ears */}
          <ellipse cx="38" cy="22" rx="8" ry="20" fill="#f472b6" stroke="#be185d" strokeWidth="2" transform="rotate(-10 38 22)" />
          <ellipse cx="62" cy="22" rx="8" ry="20" fill="#f472b6" stroke="#be185d" strokeWidth="2" transform="rotate(10 62 22)" />
          {/* Inner ears */}
          <ellipse cx="38" cy="22" rx="4" ry="14" fill="#fce7f3" transform="rotate(-10 38 22)" />
          <ellipse cx="62" cy="22" rx="4" ry="14" fill="#fce7f3" transform="rotate(10 62 22)" />
          {/* Snout */}
          <ellipse cx="50" cy="62" rx="8" ry="6" fill="#fdf2f8" stroke="#be185d" strokeWidth="1.5" />
          {/* Eyes */}
          <circle cx="42" cy="50" r="3" fill="#1e293b" />
          <circle cx="58" cy="50" r="3" fill="#1e293b" />
          {/* Nose */}
          <polygon points="48,60 52,60 50,62" fill="#be185d" />
        </svg>
      );
    case 'cat':
    case 'explorer':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Cat Body */}
          <circle cx="50" cy="54" r="36" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
          {/* Ears */}
          <polygon points="20,30 40,36 15,10" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          <polygon points="80,30 60,36 85,10" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
          {/* Snout */}
          <ellipse cx="50" cy="62" rx="10" ry="7" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
          {/* Whiskers */}
          <line x1="32" y1="62" x2="20" y2="60" stroke="#d97706" strokeWidth="1.5" />
          <line x1="32" y1="65" x2="18" y2="67" stroke="#d97706" strokeWidth="1.5" />
          <line x1="68" y1="62" x2="80" y2="60" stroke="#d97706" strokeWidth="1.5" />
          <line x1="68" y1="65" x2="82" y2="67" stroke="#d97706" strokeWidth="1.5" />
          {/* Eyes */}
          <ellipse cx="40" cy="50" rx="3.5" ry="5.5" fill="#1e293b" />
          <ellipse cx="60" cy="50" rx="3.5" ry="5.5" fill="#1e293b" />
          {/* Nose & Mouth */}
          <polygon points="48,60 52,60 50,62" fill="#d97706" />
          <path d="M 48 64 Q 50 66 52 64" fill="none" stroke="#1e293b" strokeWidth="1.5" />
        </svg>
      );
    case 'lion':
    case 'leader':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Mane */}
          <circle cx="50" cy="50" r="42" fill="#ea580c" stroke="#c2410c" strokeWidth="2" />
          {/* Face */}
          <circle cx="50" cy="52" r="32" fill="#fbbf24" stroke="#c2410c" strokeWidth="2" />
          {/* Crown */}
          <polygon points="35,28 42,16 50,26 58,16 65,28" fill="#facc15" stroke="#c2410c" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="41" cy="46" r="4.5" fill="#1e293b" />
          <circle cx="59" cy="46" r="4.5" fill="#1e293b" />
          {/* Nose */}
          <polygon points="46,55 54,55 50,60" fill="#c2410c" />
          {/* Mouth */}
          <path d="M 46 64 Q 50 67 54 64" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'squirrel':
    case 'entrepreneur':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Squirrel */}
          <circle cx="50" cy="52" r="36" fill="#14b8a6" stroke="#0f766e" strokeWidth="3" />
          {/* Tail */}
          <path d="M 76 76 C 96 66 96 36 76 46 C 66 51 66 71 76 76 Z" fill="#0d9488" stroke="#0f766e" strokeWidth="2" />
          {/* Ears */}
          <polygon points="26,26 38,30 22,10" fill="#0d9488" stroke="#0f766e" strokeWidth="2" />
          <polygon points="74,26 62,30 78,10" fill="#0d9488" stroke="#0f766e" strokeWidth="2" />
          {/* Cheeks */}
          <ellipse cx="36" cy="62" rx="8" ry="6" fill="#ccfbf1" />
          <ellipse cx="64" cy="62" rx="8" ry="6" fill="#ccfbf1" />
          {/* Eyes */}
          <circle cx="40" cy="48" r="3.5" fill="#1e293b" />
          <circle cx="60" cy="48" r="3.5" fill="#1e293b" />
          {/* Nose */}
          <circle cx="50" cy="54" r="3" fill="#1e293b" />
        </svg>
      );
    case 'spider':
    case 'deep worker':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Spider Body */}
          <circle cx="50" cy="50" r="32" fill="#6366f1" stroke="#4338ca" strokeWidth="3" />
          {/* Legs */}
          <path d="M 22 36 Q 10 32 6 44" fill="none" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" />
          <path d="M 20 50 Q 8 50 4 60" fill="none" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" />
          <path d="M 22 64 Q 12 70 8 80" fill="none" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" />
          <path d="M 78 36 Q 90 32 94 44" fill="none" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" />
          <path d="M 80 50 Q 92 50 96 60" fill="none" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" />
          <path d="M 78 64 Q 88 70 92 80" fill="none" stroke="#4338ca" strokeWidth="3" strokeLinecap="round" />
          {/* Cute Eyes (Spider gets 4 small eyes) */}
          <circle cx="40" cy="44" r="2.5" fill="#ffffff" />
          <circle cx="48" cy="40" r="3.5" fill="#ffffff" />
          <circle cx="58" cy="40" r="3.5" fill="#ffffff" />
          <circle cx="66" cy="44" r="2.5" fill="#ffffff" />
          <circle cx="48" cy="40" r="1.5" fill="#1e293b" />
          <circle cx="58" cy="40" r="1.5" fill="#1e293b" />
        </svg>
      );
    case 'koala':
    case 'reader':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Koala Body */}
          <circle cx="50" cy="54" r="36" fill="#0891b2" stroke="#0e7490" strokeWidth="3" />
          {/* Large Fluffy Ears */}
          <circle cx="20" cy="35" r="16" fill="#0891b2" stroke="#0e7490" strokeWidth="2.5" />
          <circle cx="80" cy="35" r="16" fill="#0891b2" stroke="#0e7490" strokeWidth="2.5" />
          <circle cx="20" cy="35" r="10" fill="#ecfeff" />
          <circle cx="80" cy="35" r="10" fill="#ecfeff" />
          {/* Big Nose */}
          <ellipse cx="50" cy="58" rx="7" ry="12" fill="#155e75" stroke="#0e7490" strokeWidth="1.5" />
          {/* Eyes */}
          <circle cx="39" cy="48" r="3" fill="#1e293b" />
          <circle cx="61" cy="48" r="3" fill="#1e293b" />
        </svg>
      );
    case 'wolf':
    case 'health guardian':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Wolf Body */}
          <circle cx="50" cy="54" r="36" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
          {/* Pointy Ears */}
          <polygon points="24,30 42,38 18,10" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
          <polygon points="76,30 58,38 82,10" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
          {/* Muzzle */}
          <polygon points="40,68 60,68 50,56" fill="#dcfce7" stroke="#15803d" strokeWidth="1.5" />
          {/* Eyes */}
          <circle cx="40" cy="48" r="3" fill="#1e293b" />
          <circle cx="60" cy="48" r="3" fill="#1e293b" />
          {/* Nose */}
          <circle cx="50" cy="68" r="3" fill="#1e293b" />
        </svg>
      );
    case 'parrot':
    case 'communicator':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={style} className={className}>
          {/* Parrot Body */}
          <circle cx="50" cy="54" r="36" fill="#f97316" stroke="#c2410c" strokeWidth="3" />
          {/* Crest */}
          <path d="M 50 18 Q 45 6 36 12" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
          <path d="M 50 18 Q 55 6 64 12" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="34" cy="56" r="6" fill="#fef08a" />
          <circle cx="66" cy="56" r="6" fill="#fef08a" />
          {/* Big Beak */}
          <path d="M 44 48 Q 50 36 56 48 Q 50 68 44 48 Z" fill="#fbbf24" stroke="#c2410c" strokeWidth="2" />
          {/* Eyes */}
          <circle cx="37" cy="42" r="3.5" fill="#1e293b" />
          <circle cx="63" cy="42" r="3.5" fill="#1e293b" />
        </svg>
      );
    default:
      // Generic happy star or circle
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
          <circle cx="50" cy="50" r="40" fill="#cccccc" stroke="#666666" strokeWidth="3" />
          <text x="50" y="58" fontSize="24" textAnchor="middle" fill="#666666">?</text>
        </svg>
      );
  }
};

// Customizable player avatar renderer
interface AvatarProps {
  stage?: number;
  equipped?: {
    head: string;
    body: string;
    accessory: string;
    title: string;
  };
  size?: number;
}

export const PlayerAvatar: React.FC<AvatarProps> = ({ stage = 1, equipped, size = 120 }) => {
  const head = equipped?.head || 'basic_hair';
  const body = equipped?.body || 'apprentice_robe';
  const acc = equipped?.accessory || 'none';

  // Base colors derived from evolution stage
  // Stage 1: Orange/peach, Stage 2: Mint, Stage 3: Purple, Stage 4: Golden glow
  let bodyColor = '#fbcfe8'; // pink skin/underlayer
  let outfitColor = '#a78bfa'; // violet
  let accentColor = '#8b5cf6';

  if (stage === 2) {
    outfitColor = '#3b82f6'; // Scholar blue
    accentColor = '#1d4ed8';
  } else if (stage === 3) {
    outfitColor = '#10b981'; // Emerald
    accentColor = '#047857';
  } else if (stage === 4) {
    outfitColor = '#eab308'; // Gold
    accentColor = '#ca8a04';
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      style={{
        filter: stage === 4 ? 'drop-shadow(0 0 12px rgba(234, 179, 8, 0.8))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))'
      }}
    >
      {/* Background glow for Stage 4 */}
      {stage === 4 && (
        <circle cx="60" cy="60" r="54" fill="url(#goldGlow)" opacity="0.3" />
      )}

      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Robe/Body */}
      {body === 'apprentice_robe' && (
        <path d="M 30 110 C 30 75, 90 75, 90 110 Z" fill={outfitColor} stroke={accentColor} strokeWidth="3" />
      )}
      {body === 'scholar_cloak' && (
        <>
          <path d="M 30 110 C 30 75, 90 75, 90 110 Z" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="3" />
          {/* Gold neck lining */}
          <path d="M 45 84 Q 60 94 75 84" fill="none" stroke="#fbbf24" strokeWidth="4" />
        </>
      )}
      {body === 'master_plate' && (
        <>
          <path d="M 30 110 C 30 75, 90 75, 90 110 Z" fill="#64748b" stroke="#334155" strokeWidth="3" />
          <rect x="52" y="86" width="16" height="24" rx="2" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
        </>
      )}

      {/* Face/Head Base */}
      <circle cx="60" cy="55" r="28" fill={bodyColor} stroke="#be185d" strokeWidth="2.5" />
      {/* Eyes */}
      <circle cx="50" cy="52" r="3" fill="#1e293b" />
      <circle cx="70" cy="52" r="3" fill="#1e293b" />
      {/* Blush */}
      <circle cx="44" cy="58" r="2.5" fill="#f87171" opacity="0.6" />
      <circle cx="76" cy="58" r="2.5" fill="#f87171" opacity="0.6" />
      {/* Smile */}
      <path d="M 56 62 Q 60 66 64 62" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

      {/* Hair / Headgear */}
      {head === 'basic_hair' && (
        <path d="M 30 45 Q 60 20 90 45 Q 60 35 30 45" fill="#78350f" stroke="#451a03" strokeWidth="2" />
      )}
      {head === 'hardhat' && (
        <>
          <path d="M 32 40 Q 60 15 88 40 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2.5" />
          <rect x="54" y="24" width="12" height="16" fill="#eab308" />
        </>
      )}
      {head === 'sweatband' && (
        <>
          <path d="M 30 45 Q 60 20 90 45 Q 60 35 30 45" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <rect x="34" y="40" width="52" height="8" rx="2" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
        </>
      )}
      {head === 'laurel_crown' && (
        <>
          <path d="M 30 45 Q 60 20 90 45 Q 60 35 30 45" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <path d="M 32 44 C 40 34, 52 38, 54 44" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 88 44 C 80 34, 68 38, 66 44" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
        </>
      )}
      {head === 'explorer_hat' && (
        <>
          <ellipse cx="60" cy="38" rx="34" ry="8" fill="#d97706" stroke="#78350f" strokeWidth="2" />
          <path d="M 38 36 Q 60 12 82 36 Z" fill="#d97706" stroke="#78350f" strokeWidth="2" />
          <rect x="38" y="32" width="44" height="4" fill="#1e293b" />
        </>
      )}
      {head === 'owl_glasses' && (
        <>
          <path d="M 30 45 Q 60 20 90 45 Q 60 35 30 45" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <circle cx="50" cy="52" r="9" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="70" cy="52" r="9" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <line x1="59" y1="52" x2="61" y2="52" stroke="#f59e0b" strokeWidth="2" />
        </>
      )}
      {head === 'wooden_beads' && (
        <>
          <path d="M 30 45 Q 60 20 90 45 Q 60 35 30 45" fill="#78350f" stroke="#451a03" strokeWidth="2" />
          <circle cx="60" cy="22" r="10" fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="3 3" />
        </>
      )}

      {/* Accessories */}
      {acc === 'wrench_shield' && (
        <g transform="translate(10, 80)">
          <circle cx="10" cy="10" r="14" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
          <path d="M 6 4 L 14 16 M 14 4 L 6 16" stroke="#475569" strokeWidth="3" />
        </g>
      )}
      {acc === 'victory_medal' && (
        <g transform="translate(52, 76)">
          <polygon points="8,0 12,0 10,12" fill="#ef4444" />
          <circle cx="10" cy="15" r="6" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1.5" />
        </g>
      )}
      {acc === 'lotus_halo' && (
        <circle cx="60" cy="55" r="34" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
      )}
      {acc === 'compass_cape' && (
        <path d="M 28 88 L 18 116 L 36 116 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
      )}
      {acc === 'golden_scepter' && (
        <g transform="translate(90, 68)">
          <line x1="5" y1="40" x2="15" y2="10" stroke="#b45309" strokeWidth="3.5" />
          <circle cx="17" cy="6" r="6" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
};

// Bad Habit Monsters SVG Icon
export const MonsterIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 90, className = '' }) => {
  const norm = name.toLowerCase();

  if (norm.includes('scroll') || norm.includes('dragon')) {
    // Doomscroll Dragon
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="40" fill="#4c1d95" stroke="#2e1065" strokeWidth="3" />
        {/* Dragon Horns */}
        <polygon points="30,22 15,10 32,15" fill="#7c3aed" stroke="#2e1065" strokeWidth="2" />
        <polygon points="70,22 85,10 68,15" fill="#7c3aed" stroke="#2e1065" strokeWidth="2" />
        {/* Phone Screen center forehead */}
        <rect x="42" y="24" width="16" height="24" rx="2" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
        <circle cx="50" cy="40" r="2" fill="#ffffff" />
        {/* Glowing Eyes */}
        <polygon points="35,50 45,46 40,54" fill="#ef4444" />
        <polygon points="65,50 55,46 60,54" fill="#ef4444" />
        {/* Angry mouth */}
        <path d="M 38 68 Q 50 54 62 68" fill="none" stroke="#2e1065" strokeWidth="3" />
        {/* Sharp Teeth */}
        <polygon points="44,60 48,60 46,65" fill="#ffffff" />
        <polygon points="52,60 56,60 54,65" fill="#ffffff" />
      </svg>
    );
  } else if (norm.includes('slime') || norm.includes('procrastination')) {
    // Procrastination Slime
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        {/* Slime Blob */}
        <path d="M 15 80 C 15 40, 85 40, 85 80 C 85 92, 15 92, 15 80 Z" fill="#db2777" stroke="#9d174d" strokeWidth="3" />
        {/* Bubbles in Slime */}
        <circle cx="30" cy="65" r="4" fill="#fbcfe8" opacity="0.5" />
        <circle cx="70" cy="60" r="5" fill="#fbcfe8" opacity="0.5" />
        <circle cx="50" cy="70" r="3" fill="#fbcfe8" opacity="0.5" />
        {/* Sleepy Eyes */}
        <ellipse cx="40" cy="56" rx="6" ry="2" fill="#1e293b" />
        <ellipse cx="60" cy="56" rx="6" ry="2" fill="#1e293b" />
        {/* Derpy Drool */}
        <path d="M 48 64 Q 50 78 52 64" fill="#a3e635" stroke="#4d7c0f" strokeWidth="1" />
      </svg>
    );
  } else if (norm.includes('goblin') || norm.includes('sleep')) {
    // Sleep Goblin
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="40" fill="#1e3a8a" stroke="#172554" strokeWidth="3" />
        {/* Pointy Elf Ears */}
        <polygon points="15,40 2,30 20,48" fill="#1e40af" stroke="#172554" strokeWidth="2" />
        <polygon points="85,40 98,30 80,48" fill="#1e40af" stroke="#172554" strokeWidth="2" />
        {/* Sleepy ZZZ */}
        <text x="68" y="24" fontSize="16" fontWeight="bold" fill="#3b82f6" opacity="0.8">Z</text>
        <text x="76" y="16" fontSize="12" fontWeight="bold" fill="#60a5fa" opacity="0.6">z</text>
        {/* Closed Eyes */}
        <path d="M 32 50 Q 40 54 44 50" fill="none" stroke="#93c5fd" strokeWidth="2.5" />
        <path d="M 68 50 Q 60 54 56 50" fill="none" stroke="#93c5fd" strokeWidth="2.5" />
        {/* Snoring Mouth */}
        <circle cx="50" cy="62" r="6" fill="#1e293b" />
      </svg>
    );
  } else if (norm.includes('sugar') || norm.includes('monster')) {
    // Sugar Monster
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        {/* Spiky cookie body */}
        <circle cx="50" cy="50" r="40" fill="#b45309" stroke="#78350f" strokeWidth="3" />
        {/* Chocolate chips */}
        <circle cx="28" cy="38" r="5" fill="#451a03" />
        <circle cx="70" cy="34" r="6" fill="#451a03" />
        <circle cx="36" cy="68" r="5.5" fill="#451a03" />
        <circle cx="64" cy="66" r="4" fill="#451a03" />
        {/* Crazy Eyes */}
        <circle cx="40" cy="46" r="10" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
        <circle cx="60" cy="46" r="8" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
        <circle cx="42" cy="48" r="3.5" fill="#1e293b" />
        <circle cx="58" cy="45" r="2.5" fill="#1e293b" />
        {/* Hungry Mouth */}
        <path d="M 32 60 Q 50 82 68 60 Z" fill="#991b1b" stroke="#78350f" strokeWidth="2" />
        {/* Fangs */}
        <polygon points="38,60 42,60 40,64" fill="#ffffff" />
        <polygon points="58,60 62,60 60,64" fill="#ffffff" />
      </svg>
    );
  } else {
    // Distraction Imp / Generic Bad Habit Monster
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="50" r="40" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="3" />
        {/* Little Red Horns */}
        <polygon points="32,22 24,8 40,16" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
        <polygon points="68,22 76,8 60,16" fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
        {/* Big Yellow Eyes */}
        <ellipse cx="38" cy="44" rx="8" ry="6" fill="#facc15" stroke="#7f1d1d" strokeWidth="1.5" />
        <ellipse cx="62" cy="44" rx="8" ry="6" fill="#facc15" stroke="#7f1d1d" strokeWidth="1.5" />
        <circle cx="38" cy="44" r="3" fill="#1e293b" />
        <circle cx="62" cy="44" r="3" fill="#1e293b" />
        {/* Smug Grin */}
        <path d="M 34 62 Q 50 74 66 62" fill="none" stroke="#7f1d1d" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }
};
