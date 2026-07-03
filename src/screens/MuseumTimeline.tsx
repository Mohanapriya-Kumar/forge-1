import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { Trophy, Calendar, Clock } from 'lucide-react';
import { playClick } from '../utils/sounds';


export const MuseumTimeline: React.FC = () => {
  const { state } = useAppState();
  const [panel, setPanel] = useState<'museum' | 'timeline'>('museum');

  // Hardcoded list of possible achievements for display reference
  const allAchievements = [
    { id: 'mus_first_vote', name: 'First Vote Cast', desc: 'Cast your first identity vote in the Forge.', icon: '🔥' },
    { id: 'mus_rec_', name: 'Recovery Guardian', desc: 'Successfully recovered a streak after missing a day.', icon: '🛡️' },
    { id: 'mus_mon_', name: 'Monster Slasher', desc: 'Defeated a Bad Habit Monster by adding friction steps.', icon: '🏆' },
    { id: 'mus_lvl_', name: 'Island Pioneer', desc: 'Evolved any island to level 4 or higher.', icon: '🏝️' },
    { id: 'mus_first_reflect', name: 'Self-Aware Smith', desc: 'Logged your very first daily reflection review.', icon: '🧘' },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Museum & Forge Timeline</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Revisit your transformation path. Celebrate milestones and trace history.
          </p>
        </div>
        
        {/* Toggle Controls */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`cozy-btn ${panel === 'museum' ? 'cozy-btn-primary' : 'cozy-btn-secondary'}`}
            onClick={() => { playClick(); setPanel('museum'); }}
          >
            <Trophy size={16} /> Identity Museum
          </button>
          <button
            className={`cozy-btn ${panel === 'timeline' ? 'cozy-btn-primary' : 'cozy-btn-secondary'}`}
            onClick={() => { playClick(); setPanel('timeline'); }}
          >
            <Clock size={16} /> Forge Timeline
          </button>
        </div>
      </div>

      {/* MUSEUM DISPLAY PANEL */}
      {panel === 'museum' && (
        <div className="cozy-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '8px' }}>Milestone Exhibition Hall</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Unique achievements unlocked through consistent action, monster slays, and recovery missions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {allAchievements.map((ach) => {
              // Find if this achievement matches any id pattern in our state's museum
              const unlocked = state.museum.some((m) => m.id.startsWith(ach.id));
              const match = state.museum.find((m) => m.id.startsWith(ach.id));

              return (
                <div
                  key={ach.id}
                  style={{
                    border: `3px solid ${unlocked ? 'var(--primary)' : 'var(--border-color)'}`,
                    background: unlocked ? 'var(--bg-card)' : 'rgba(0,0,0,0.15)',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                    opacity: unlocked ? 1 : 0.45,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: unlocked ? 'var(--shadow-cozy)' : 'none',
                    height: '180px',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{ach.icon}</div>
                  <h4 style={{ fontSize: '1rem', color: unlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {ach.name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.3' }}>
                    {ach.desc}
                  </p>
                  {unlocked && match && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '8px' }}>
                      Unlocked: {match.date}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TIMELINE DISPLAY PANEL */}
      {panel === 'timeline' && (
        <div className="cozy-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--primary)', marginBottom: '8px' }}>Chronological Forge Feed</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Every action and choice you have taken since starting your journey, sorted newest first.
          </p>

          <div
            style={{
              position: 'relative',
              paddingLeft: '30px',
              borderLeft: '3px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginLeft: '15px',
            }}
          >
            {state.timeline.slice().reverse().map((event) => (
              <div key={event.id} style={{ position: 'relative' }}>
                
                {/* Node icon dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-44px',
                    top: '2px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: '3px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    zIndex: 2,
                  }}
                >
                  {event.icon}
                </div>

                <div
                  style={{
                    background: 'var(--glass-tint)',
                    border: '2.5px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {event.date}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--primary)', textTransform: 'capitalize', fontWeight: 'bold' }}>
                      {event.type}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{event.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
