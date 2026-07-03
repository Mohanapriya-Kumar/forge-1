import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import type { HabitQuest } from '../context/AppState';
import { MascotIcon } from '../components/Mascots';
import { playClick } from '../utils/sounds';


export const BlueprintDeck: React.FC = () => {
  const { state, calculateMomentum } = useAppState();
  const [selectedCard, setSelectedCard] = useState<HabitQuest | null>(null);

  // Success rate calculator
  const calculateSuccessRate = (quest: HabitQuest): number => {
    if (quest.completedDates.length === 0) return 0;
    // Mock consistency or calculate based on total days (standardized)
    const base = Math.min(100, 60 + quest.completedDates.length * 8 - (quest.isBad ? 5 : 0));
    return Math.round(base);
  };

  const getCardStrength = (quest: HabitQuest): number => {
    const s = quest.scores;
    return s.obvious + s.attractive + s.easy + s.satisfying;
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Habit Blueprint Deck</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Your systems, compiled as collectible blueprint cards. Strengthen them through actions.
        </p>
      </div>

      {state.quests.length === 0 ? (
        <div className="cozy-card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          No blueprint cards forged yet. Visit the Quests Board to start building your deck.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {state.quests.map((quest) => {
            const info = state.identities[quest.identity];
            const rate = calculateSuccessRate(quest);
            const strength = getCardStrength(quest);

            return (
              <div
                key={quest.id}
                onClick={() => { playClick(); setSelectedCard(quest); }}
                className="cozy-card"
                style={{
                  border: `4px solid ${info?.color || 'var(--border-color)'}`,
                  background: 'var(--bg-card)',
                  padding: '0',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '340px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Header Band */}
                <div
                  style={{
                    background: info?.color || 'var(--border-color)',
                    color: 'white',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                  }}
                >
                  <span style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>{quest.identity}</span>
                  <span>Strength: {strength}/20</span>
                </div>

                {/* Card Center Illustration */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(rgba(255,255,255,0.02), ${info?.color}10)`,
                    padding: '16px',
                  }}
                >
                  {info && <MascotIcon name={info.mascot} size={70} glow />}
                  <h3 style={{ fontSize: '1.2rem', marginTop: '12px', textAlign: 'center', color: 'var(--text-main)' }}>
                    {quest.name}
                  </h3>
                  {quest.tinyName && (
                    <div style={{ fontSize: '0.7rem', color: '#a855f7', background: 'rgba(168,85,247,0.05)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', fontWeight: 'bold' }}>
                      Tiny Win: {quest.tinyName}
                    </div>
                  )}
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px', fontStyle: 'italic' }}>
                    "{quest.cue}"
                  </p>
                </div>

                {/* Footer Band Stats */}
                <div
                  style={{
                    borderTop: '2px solid var(--border-color)',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    background: 'var(--glass-tint)',
                  }}
                >
                  <div>
                    <span style={{ display: 'block', color: 'var(--text-muted)' }}>Success Rate</span>
                    <strong style={{ fontSize: '0.88rem', color: info?.color }}>{rate}%</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', color: 'var(--text-muted)' }}>Momentum</span>
                    <strong style={{ fontSize: '0.88rem', color: info?.color }}>{calculateMomentum(quest.identity)}</strong>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED CARD ZOOM MODAL */}
      {selectedCard && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
            zIndex: 150,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedCard(null)}
        >
          {/* Card Inspect frame */}
          <div
            className="cozy-card"
            style={{
              maxWidth: '440px',
              width: '100%',
              padding: '0',
              borderRadius: '24px',
              border: `5px solid ${state.identities[selectedCard.identity]?.color || 'var(--border-color)'}`,
              overflow: 'hidden',
              background: 'var(--bg-card)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Identity bar */}
            <div
              style={{
                background: state.identities[selectedCard.identity]?.color || 'var(--primary)',
                color: 'white',
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 'bold',
              }}
            >
              <span>{selectedCard.identity} Blueprint Card</span>
              <span>Lvl {state.identities[selectedCard.identity]?.level}</span>
            </div>

            {/* Content area */}
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <MascotIcon name={state.identities[selectedCard.identity]?.mascot || 'beaver'} size={90} glow />
              </div>

              <h3 style={{ textAlign: 'center', fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '16px' }}>
                {selectedCard.name}
              </h3>

              {/* The Four Laws Blueprint definitions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--glass-tint)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <strong>Cue (Obvious):</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{selectedCard.cue}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--glass-tint)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <strong>Craving (Attractive):</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{selectedCard.craving || 'Associated identity shift'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--glass-tint)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <strong>Response (Easy):</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{selectedCard.response || 'Perform action'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--glass-tint)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <strong>Reward (Satisfying):</strong>
                  <span style={{ color: 'var(--text-muted)' }}>{selectedCard.reward || 'Cast identity vote'}</span>
                </div>
                {selectedCard.tinyName && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(168,85,247,0.06)', padding: '6px 10px', border: '1px solid #a855f730', borderRadius: '6px', fontSize: '0.82rem' }}>
                    <strong style={{ color: '#a855f7' }}>Tiny Version:</strong>
                    <span style={{ color: '#a855f7', fontWeight: 'bold' }}>{selectedCard.tinyName}</span>
                  </div>
                )}
              </div>

              {/* Stats and ratings metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ border: '2px solid var(--border-color)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Success Integrity</div>
                  <strong style={{ fontSize: '1.1rem', color: state.identities[selectedCard.identity]?.color }}>
                    {calculateSuccessRate(selectedCard)}%
                  </strong>
                </div>
                <div style={{ border: '2px solid var(--border-color)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Identity Momentum</div>
                  <strong style={{ fontSize: '1.1rem', color: state.identities[selectedCard.identity]?.color }}>
                    {calculateMomentum(selectedCard.identity)}
                  </strong>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ background: 'var(--glass-tint)', padding: '14px 24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="cozy-btn cozy-btn-primary"
                onClick={() => setSelectedCard(null)}
                style={{ background: state.identities[selectedCard.identity]?.color }}
              >
                Close Blueprint Card
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
