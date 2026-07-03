import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { MascotIcon, PlayerAvatar, StarGuide } from '../components/Mascots';
import { playClick } from '../utils/sounds';
import { Mail, AlertCircle } from 'lucide-react';

const getLevelForMomentum = (mom: 'Dormant' | 'Recovering' | 'Growing' | 'Strong' | 'Thriving' | 'Legendary'): number => {
  switch (mom) {
    case 'Legendary': return 8;
    case 'Thriving': return 7;
    case 'Strong': return 5;
    case 'Growing': return 3;
    case 'Recovering': return 2;
    default: return 1;
  }
};

// Custom SVG Floating Island drawing helper
const IslandSVG: React.FC<{ level: number }> = ({ level }) => {
  // Level decorations:
  // 1: Rock
  // 2: Rock + Flowers (circles)
  // 3: Rock + Flowers + Trees (rect/triangle)
  // 4: Rock + Trees + Cabin (rect/house roof)
  // 5: Rock + Town (multiple cabins)
  // 6: Castle (stone gates)


  // 7: Flying City (propellers, gold rings)
  // 8: Legendary Kingdom (shining spires, halo)

  return (
    <svg width="110" height="90" viewBox="0 0 110 90" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`island-grad-${level}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
      </defs>

      {/* Floating Island Base Dirt Rock */}
      <polygon points="15,50 95,50 80,80 30,80" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
      <polygon points="30,80 80,80 55,90" fill="#451a03" />

      {/* Grassy Top */}
      <ellipse cx="55" cy="50" rx="42" ry="12" fill={`url(#island-grad-${level})`} stroke="#16a34a" strokeWidth="2" />

      {/* Level-based evolutions */}
      {/* Level 2: Flowers */}
      {level >= 2 && (
        <g>
          {/* Flower 1 */}
          <circle cx="28" cy="46" r="3" fill="#ec4899" />
          <circle cx="28" cy="46" r="1" fill="#facc15" />
          {/* Flower 2 */}
          <circle cx="82" cy="48" r="2.5" fill="#f43f5e" />
          <circle cx="82" cy="48" r="0.8" fill="#facc15" />
        </g>
      )}

      {/* Level 3: Trees */}
      {level >= 3 && (
        <g>
          {/* Tree 1 */}
          <rect x="22" y="32" width="3" height="12" fill="#78350f" />
          <polygon points="17,34 23.5,18 30,34" fill="#14532d" />
          {/* Tree 2 */}
          <rect x="85" y="34" width="3" height="10" fill="#78350f" />
          <polygon points="81,36 86.5,22 92,36" fill="#15803d" />
        </g>
      )}

      {/* Level 4: Simple Cabin */}
      {level >= 4 && (
        <g>
          <rect x="46" y="32" width="14" height="12" fill="#ffedd5" stroke="#7c2d12" strokeWidth="1" />
          <polygon points="43,32 53,22 63,32" fill="#b91c1c" stroke="#7c2d12" strokeWidth="1" />
          <rect x="52" y="38" width="3" height="6" fill="#7c2d12" />
        </g>
      )}

      {/* Level 5: Town */}
      {level >= 5 && (
        <g>
          <rect x="36" y="34" width="10" height="9" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1" />
          <polygon points="34,34 41,26 48,34" fill="#d97706" />

          <rect x="62" y="34" width="10" height="9" fill="#fef2f2" stroke="#991b1b" strokeWidth="1" />
          <polygon points="60,34 67,26 74,34" fill="#dc2626" />
        </g>
      )}

      {/* Level 6: Castle Spires */}
      {level >= 6 && (
        <g>
          <rect x="42" y="24" width="24" height="20" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
          <rect x="38" y="16" width="6" height="26" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          <polygon points="36,16 41,6 46,16" fill="#4f46e5" />
          <rect x="64" y="16" width="6" height="26" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
          <polygon points="62,16 67,6 72,16" fill="#4f46e5" />
        </g>
      )}

      {/* Level 7: Flying City details */}
      {level >= 7 && (
        <g>
          {/* Propeller or float balloons */}
          <circle cx="15" cy="65" r="7" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1" opacity="0.8" />
          <circle cx="95" cy="65" r="7" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1" opacity="0.8" />
          {/* Glowing pathway rings */}
          <ellipse cx="55" cy="52" rx="48" ry="18" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3 3" />
        </g>
      )}

      {/* Level 8: Legendary Golden Kingdom Spires & Halo */}
      {level >= 8 && (
        <g>
          <circle cx="55" cy="30" r="30" fill="none" stroke="#facc15" strokeWidth="2.5" strokeDasharray="4 4" opacity="0.8" />
          <path d="M 40 24 L 55 -6 L 70 24 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          <circle cx="55" cy="-8" r="4" fill="#fbbf24" />
        </g>
      )}
    </svg>
  );
};

export const WorldMap: React.FC = () => {
  const { state, triggerDriftCheck, generateFutureSelfMessage, calculateMomentum } = useAppState();
  const [selectedIsland, setSelectedIsland] = useState<string | null>(null);
  const [showCoach, setShowCoach] = useState(false);

  const activeIds = state.selectedIdentities;

  // Handle clicking guide star for Atomic Habits Coach logic
  const handleCoachClick = () => {
    playClick();
    triggerDriftCheck();
    setShowCoach(!showCoach);
  };

  const handleIslandClick = (idName: string) => {
    playClick();
    setSelectedIsland(idName);
  };

  const triggerFutureSelf = (idName: string) => {
    playClick();
    generateFutureSelfMessage(idName);
  };

  // Coordinates mapping for up to 12 islands floating in a circular path
  const getIslandCoords = (index: number, total: number) => {
    if (total === 1) return { top: '35%', left: '15%' };
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // offset by 90deg to start top
    const radiusX = 35; // % radius
    const radiusY = 30;
    const top = 50 + radiusY * Math.sin(angle);
    const left = 50 + radiusX * Math.cos(angle);
    return { top: `${top}%`, left: `${left}%` };
  };

  // Generate rain drops elements if rainy
  const renderRain = () => {
    if (state.weather !== 'rainy') return null;
    const drops = [];
    for (let i = 0; i < 40; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 1.5;
      const duration = 0.8 + Math.random() * 0.7;
      drops.push(
        <div
          key={i}
          className="rain-drop"
          style={{
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            top: '-40px',
          }}
        />
      );
    }
    return <div className="weather-rain-container">{drops}</div>;
  };

  const selectedIslandInfo = selectedIsland ? state.identities[selectedIsland] : null;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 120px)',
        overflow: 'hidden',
        background: 'var(--bg-main)',
        borderRadius: '24px',
        border: '3px solid var(--border-color)',
      }}
    >
      {/* Rain overlays */}
      {renderRain()}

      {/* Aurora glow overlay for Aurora weather */}
      {state.weather === 'aurora' && <div className="aurora-bg" />}

      {/* Weather Indicator widget */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 10,
          background: 'var(--bg-card)',
          border: '2.5px solid var(--border-color)',
          borderRadius: '12px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          boxShadow: 'var(--shadow-cozy)',
        }}
      >
        <span>Atmosphere:</span>
        <span style={{ textTransform: 'capitalize', color: 'var(--primary)' }}>
          {state.weather === 'aurora' && '🌈 Celestial Aurora'}
          {state.weather === 'sunny' && '☀️ Cozy Sunshine'}
          {state.weather === 'cloudy' && '☁️ Calm Clouds'}
          {state.weather === 'rainy' && '🌧️ Reflective Rain'}
        </span>
      </div>

      {/* Star Coach Guide floating */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 15,
          cursor: 'pointer',
        }}
        onClick={handleCoachClick}
      >
        <StarGuide size={70} />
      </div>

      {/* Star Coach speech bubble */}
      {showCoach && (
        <div
          className="cozy-card"
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '20px',
            maxWidth: '320px',
            zIndex: 15,
            padding: '16px',
            borderWidth: '2px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <AlertCircle size={16} color="var(--primary)" />
            <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)' }}>Star Guide Coach</h4>
          </div>
          <div style={{ fontSize: '0.85rem', lineHeight: '1.4', marginBottom: '10px' }}>
            {state.coachMessages[0] || 'Every action is a vote for the person you want to become.'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
            {state.futureMessages[0] || 'Keep forging ahead.'}
          </div>
        </div>
      )}

      {/* Main Map Elements */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        
        {/* CENTER ELEMENT: Player avatar homestead */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 8,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: '3px solid var(--border-color)',
            borderRadius: '24px',
            padding: '16px 20px',
            minWidth: '160px',
            boxShadow: 'var(--shadow-cozy)',
          }}
        >
          <PlayerAvatar stage={state.avatar.stage} equipped={state.avatar.equipped} size={110} />
          <h3 style={{ fontSize: '1.1rem', marginTop: '8px', color: 'var(--text-main)' }}>
            {state.username || 'The Smith'}
          </h3>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 'bold' }}>
            {state.avatar.equipped.title} (Lvl {state.level})
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Total Votes: {Math.floor(state.xp / 50)}
          </div>
        </div>

        {/* FLOATING ISLANDS */}
        {activeIds.map((idName, idx) => {
          const info = state.identities[idName];
          if (!info) return null;
          const coords = getIslandCoords(idx, activeIds.length);
          const animationClass = idx % 3 === 0 ? 'floating-island' : idx % 3 === 1 ? 'floating-island-offset-1' : 'floating-island-offset-2';
          const momentum = calculateMomentum(idName);

          return (
            <div
              key={idName}
              className={animationClass}
              onClick={() => handleIslandClick(idName)}
              style={{
                position: 'absolute',
                top: coords.top,
                left: coords.left,
                transform: 'translate(-50%, -50%)',
                zIndex: 6,
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'relative' }}>
                <IslandSVG level={getLevelForMomentum(momentum)} />
                <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)' }}>
                  <MascotIcon name={info.mascot} size={44} glow />
                </div>
              </div>
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: `2px solid ${info.color}`,
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  boxShadow: 'var(--shadow-cozy)',
                  color: 'var(--text-main)',
                  marginTop: '8px',
                  transition: 'transform 0.2s',
                }}
              >
                {idName} ({momentum})
              </div>
            </div>
          );
        })}
      </div>

      {/* ISLAND INSPECT MODAL */}
      {selectedIslandInfo && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedIsland(null)}
        >
          <div
            className="cozy-card"
            style={{
              maxWidth: '500px',
              width: '100%',
              border: `3px solid ${selectedIslandInfo.color}`,
              background: 'var(--bg-card)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
              <div style={{ border: `3px solid ${selectedIslandInfo.color}`, borderRadius: '50%', padding: '8px', background: `${selectedIslandInfo.color}15` }}>
                <MascotIcon name={selectedIslandInfo.mascot} size={64} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.6rem', color: selectedIslandInfo.color }}>
                  {selectedIslandInfo.name} Island
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Momentum: <strong style={{ color: selectedIslandInfo.color }}>{selectedIsland ? calculateMomentum(selectedIsland) : 'Dormant'}</strong> | {selectedIslandInfo.votes} Votes Cast
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '20px' }}>
              {selectedIslandInfo.description}
            </p>

            {/* DNA Trait Levels breakdown */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', color: selectedIslandInfo.color, marginBottom: '8px' }}>DNA Affinity Traits:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {Object.entries(selectedIslandInfo.traits).map(([trait, pts]) => {
                  if (pts === 0) return null;
                  return (
                    <div
                      key={trait}
                      style={{
                        background: 'var(--glass-tint)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ textTransform: 'capitalize' }}>{trait}:</span>
                      <span style={{ fontWeight: 'bold', color: selectedIslandInfo.color }}>+{pts} pts</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Future Self Messages inbox */}
            <div
              style={{
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                background: 'var(--glass-tint)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <Mail size={14} color={selectedIslandInfo.color} />
                  <span>Future Self Inbox</span>
                </div>
                <button
                  className="cozy-btn"
                  onClick={() => triggerFutureSelf(selectedIslandInfo.name)}
                  style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                >
                  Summon Letter
                </button>
              </div>

              <div style={{ fontSize: '0.8rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                {state.futureMessages.find((m) => m.includes(`Future ${selectedIslandInfo.name}`)) || (
                  <span style={{ color: 'var(--text-muted)' }}>No messages from the future yet. Complete quests or click "Summon Letter"!</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="cozy-btn cozy-btn-primary"
                onClick={() => setSelectedIsland(null)}
                style={{ background: selectedIslandInfo.color }}
              >
                Close Map Point
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
