import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { playClick } from '../utils/sounds';


export const ConstellationGalaxy: React.FC = () => {
  const { state } = useAppState();
  const [zoomLevel, setZoomLevel] = useState(1);

  // Generate date history for the last 35 days (5 weeks)
  const getPast35Days = () => {
    const dates = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const pastDates = getPast35Days();

  // Helper to determine day completion status
  // Return 'good' if all quests done, 'partial' if some done, 'missed' if none done
  const getDayStatus = (dateStr: string): 'good' | 'partial' | 'missed' => {
    if (state.quests.length === 0) return 'missed';
    let completedCount = 0;
    state.quests.forEach((q) => {
      if (q.completedDates.includes(dateStr)) {
        completedCount++;
      }
    });

    if (completedCount === state.quests.length) return 'good';
    if (completedCount > 0) return 'partial';
    return 'missed';
  };

  // Determine star position coordinates in a beautiful wave-like galaxy stream
  const getStarCoordinates = (index: number) => {
    // 5 rows (representing day-of-week groupings or layout index)
    const row = index % 7;
    const col = Math.floor(index / 7);

    // Map to coordinate grid with custom offsets to feel organic rather than rigid
    const x = 60 + col * 120 + (row % 2 === 0 ? 15 : -15);
    const y = 80 + row * 60 + (col % 2 === 0 ? 10 : -10);

    return { x, y };
  };

  const handleZoom = (direction: 'in' | 'out') => {
    playClick();
    if (direction === 'in') {
      setZoomLevel((prev) => Math.min(2, prev + 0.2));
    } else {
      setZoomLevel((prev) => Math.max(0.6, prev - 0.2));
    }
  };

  // Build the list of stars and connection lines
  const stars = pastDates.map((date, index) => {
    const status = getDayStatus(date);
    const coords = getStarCoordinates(index);
    return {
      date,
      status,
      ...coords,
    };
  });

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Habit Constellation Galaxy</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            A universe forged by your actions. Each day of consistency creates a new star.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="cozy-btn" onClick={() => handleZoom('out')} style={{ padding: '8px' }}>
            <ZoomOut size={16} />
          </button>
          <button className="cozy-btn" onClick={() => handleZoom('in')} style={{ padding: '8px' }}>
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      <div
        className="cozy-card"
        style={{
          background: 'radial-gradient(circle at center, #09071c 0%, #03020b 100%)',
          border: '4px solid var(--border-color)',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          height: '500px',
        }}
      >
        {/* Constellation background grid */}
        <div
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            padding: '20px',
            position: 'relative',
          }}
        >
          <svg
            width="750"
            height="460"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top left',
              transition: 'transform 0.3s cubic-bezier(0.1, 0.8, 0.3, 1)',
            }}
          >
            {/* Draw celestial background lines */}
            <path d="M 0,230 Q 375,100 750,230" fill="none" stroke="rgba(99,102,241,0.06)" strokeWidth="4" />
            <path d="M 0,115 Q 375,30 750,115" fill="none" stroke="rgba(99,102,241,0.04)" strokeWidth="3" />
            <path d="M 0,345 Q 375,400 750,345" fill="none" stroke="rgba(99,102,241,0.04)" strokeWidth="3" />

            {/* Draw Constellation lines between consecutive good days */}
            {stars.map((star, idx) => {
              if (idx === 0) return null;
              const prevStar = stars[idx - 1];
              // Connect only if both are not 'missed' (connect partial and good days)
              const shouldConnect = star.status !== 'missed' && prevStar.status !== 'missed';
              if (!shouldConnect) return null;

              return (
                <line
                  key={`line-${idx}`}
                  x1={prevStar.x}
                  y1={prevStar.y}
                  x2={star.x}
                  y2={star.y}
                  stroke={star.status === 'good' && prevStar.status === 'good' ? '#fbbf24' : 'rgba(99, 102, 241, 0.5)'}
                  strokeWidth={star.status === 'good' && prevStar.status === 'good' ? '3' : '1.5'}
                  strokeDasharray={star.status === 'partial' || prevStar.status === 'partial' ? '4 4' : 'none'}
                  opacity={0.65}
                  style={{
                    filter: star.status === 'good' && prevStar.status === 'good' ? 'drop-shadow(0 0 4px #fbbf24)' : 'none'
                  }}
                />
              );
            })}

            {/* Draw Stars */}
            {stars.map((star, idx) => {
              const isGood = star.status === 'good';
              const isPartial = star.status === 'partial';

              // Visual properties

              const r = isGood ? 7 : isPartial ? 5.5 : 3.5;
              const starColor = isGood ? '#fde047' : isPartial ? '#a855f7' : '#475569';
              const glowRadius = isGood ? 10 : isPartial ? 5 : 0;

              return (
                <g key={`star-${idx}`}>
                  {/* Outer glowing aura */}
                  {(isGood || isPartial) && (
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r={r + glowRadius}
                      fill={starColor}
                      opacity={isGood ? 0.15 : 0.1}
                      className="glow-glow"
                    />
                  )}
                  {/* Star core */}
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={r}
                    fill={starColor}
                    stroke="#000000"
                    strokeWidth="1.5"
                    style={{
                      cursor: 'pointer',
                      filter: isGood ? 'drop-shadow(0 0 6px #fde047)' : 'none'
                    }}
                  />
                  {/* Little date text on hover */}
                  <text
                    x={star.x}
                    y={star.y - 12}
                    fill="#94a3b8"
                    fontSize="9"
                    textAnchor="middle"
                    opacity={0.5}
                    style={{ pointerEvents: 'none' }}
                  >
                    {star.date.split('-')[2]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            display: 'flex',
            gap: '16px',
            background: 'rgba(0,0,0,0.6)',
            border: '2px solid var(--border-color)',
            borderRadius: '12px',
            padding: '8px 14px',
            fontSize: '0.8rem',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <circle cx="6" cy="6" r="6" fill="#fde047" />
            <span>Perfect Day (All Quests)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <circle cx="6" cy="6" r="5" fill="#a855f7" />
            <span>Cast Votes (Some Quests)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <circle cx="6" cy="6" r="4" fill="#475569" />
            <span>Faded Star (Missed Day)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
