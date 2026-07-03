import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import type { HabitQuest } from '../context/AppState';
import { MascotIcon } from '../components/Mascots';
import { Plus, Check, ShieldAlert, Trash2, Sparkles } from 'lucide-react';
import { playClick } from '../utils/sounds';

const getTinyWinMotto = (identityName: string): string => {
  switch (identityName) {
    case 'Scholar': return 'One page still counts.';
    case 'Reader': return 'One page still counts.';
    case 'Athlete': return 'One pushup is still a vote.';
    case 'Builder': return 'Showing up and opening VS Code matters.';
    case 'Monk': return 'One minute of breathing is still a vote.';
    default: return 'Showing up matters.';
  }
};



export const Quests: React.FC = () => {
  const { state, completeQuest, deleteHabit, addHabit } = useAppState();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [tinyName, setTinyName] = useState('');
  const [identity, setIdentity] = useState(state.selectedIdentities[0] || 'Builder');
  const [cue, setCue] = useState('');
  const [craving, setCraving] = useState('');
  const [response, setResponse] = useState('');
  const [reward, setReward] = useState('');
  const [prevHabitId, setPrevHabitId] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    playClick();

    addHabit({
      id: `quest_${identity.toLowerCase()}_${Date.now()}`,
      name,
      tinyName: tinyName || 'Show up for 1 minute',
      identity,
      isBad: false,
      cue: cue || `When I wake up`,
      craving: craving || `I want to build my ${identity} identity`,
      response: response || name,
      reward: reward || `Check off quest and cast a vote`,
      scores: { obvious: 4, attractive: 4, easy: 4, satisfying: 4 },
      stackPrevHabitId: prevHabitId || null,
      frictionSteps: [],
    });

    // Reset Form
    setName('');
    setTinyName('');
    setCue('');
    setCraving('');
    setResponse('');
    setReward('');
    setPrevHabitId('');
    setShowAddForm(false);
  };

  // Determine if a habit missed yesterday needs a "Never Miss Twice" Recovery Mission badge
  const isRecoveryMission = (quest: HabitQuest): boolean => {
    const hasPreviousEntries = quest.completedDates.length > 0;
    if (!hasPreviousEntries) return false;

    const completedYesterday = quest.completedDates.includes(yesterdayStr);
    const completedToday = quest.completedDates.includes(todayStr);

    // If it wasn't done yesterday, and hasn't been checked today yet (or was checked as a recovery today)
    return !completedYesterday && !completedToday;
  };

  // Sort quests by stack relationships to draw pipelines
  // Group non-stacked, and chained stacked together
  const renderQuests = () => {
    if (state.quests.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          No quests forged yet. Click "Forge Quest Blueprint" to begin casting votes!
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
        {state.quests.map((quest) => {
          const info = state.identities[quest.identity];

          const isCompletedToday = quest.completedDates.includes(todayStr);
          const needsRecovery = isRecoveryMission(quest);
          
          // Find if there is a next stacked habit linked to this one
          const hasNextStacked = state.quests.some((q) => q.stackPrevHabitId === quest.id);

          return (
            <div key={quest.id} style={{ position: 'relative' }}>
              {/* Cozy card container for quest */}
              <div
                className="cozy-card"
                style={{
                  border: isCompletedToday
                    ? `3px solid #22c55e`
                    : needsRecovery
                    ? `3px dashed #ef4444`
                    : `3px solid ${info?.color || 'var(--border-color)'}`,
                  background: isCompletedToday
                    ? 'rgba(34, 197, 94, 0.05)'
                    : needsRecovery
                    ? 'rgba(239, 68, 68, 0.02)'
                    : 'var(--bg-card)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  zIndex: 2,
                }}
              >
                {/* Completion Checkbox */}
                <button
                  onClick={() => completeQuest(quest.id)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: `3.5px solid ${isCompletedToday ? '#22c55e' : info?.color || 'var(--border-color)'}`,
                    background: isCompletedToday ? '#22c55e' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    outline: 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {isCompletedToday && <Check size={18} strokeWidth={3} />}
                </button>

                {/* Mascot Icon */}
                {info && <MascotIcon name={info.mascot} size={48} />}

                {/* Quest details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h4
                      style={{
                        fontSize: '1.15rem',
                        textDecoration: isCompletedToday ? 'line-through' : 'none',
                        color: isCompletedToday ? 'var(--text-muted)' : 'var(--text-main)',
                      }}
                    >
                      {quest.name}
                    </h4>
                    {needsRecovery && (
                      <span
                        style={{
                          background: '#ef444415',
                          color: '#ef4444',
                          border: '1.5px solid #ef4444',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          fontWeight: 'bold',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <ShieldAlert size={10} /> Recovery Mission
                      </span>
                    )}
                    {quest.streak > 0 && (
                      <span
                        style={{
                          background: 'var(--primary-glow)',
                          color: 'var(--primary)',
                          borderRadius: '8px',
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          fontWeight: 'bold',
                        }}
                      >
                        🔥 {quest.streak} Day Streak
                      </span>
                    )}
                  </div>
                  
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <strong>Cue Trigger:</strong> {quest.cue}
                  </div>
                  {quest.tinyName && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <strong>Tiny Win:</strong> {quest.tinyName}
                    </div>
                  )}
                  {isCompletedToday ? (
                    (quest.completedTinyDates || []).includes(todayStr) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(168,85,247,0.06)', padding: '6px 10px', borderRadius: '8px', border: '1px solid #a855f730', marginTop: '6px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={10} /> Completed as Tiny Win!
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          "{getTinyWinMotto(quest.identity)}"
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 'bold', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} /> Completed as Primary Win!
                      </div>
                    )
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        onClick={() => completeQuest(quest.id, false)}
                        className="cozy-btn"
                        style={{
                          fontSize: '0.7rem',
                          padding: '3px 8px',
                          background: info?.color || 'var(--primary)',
                          borderColor: info?.color || 'var(--primary)',
                          color: 'white',
                          borderRadius: '6px',
                        }}
                      >
                        Primary Complete
                      </button>
                      {quest.tinyName && (
                        <button
                          onClick={() => completeQuest(quest.id, true)}
                          className="cozy-btn cozy-btn-secondary"
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          ✨ Tiny Win
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <button
                  onClick={() => {
                    playClick();
                    deleteHabit(quest.id);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                  }}
                  title="Scrap Blueprint"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Habit Stacking pipeline connectors */}
              {hasNextStacked && (
                <div
                  className="stack-connector"
                  style={{
                    height: '24px',
                    top: '100%',
                    left: '38px', // aligned near checkbox / icon area
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '10px 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Active Quests Board</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Complete daily quests to cast votes and progress your identities.
          </p>
        </div>
        <button className="cozy-btn cozy-btn-primary" onClick={() => { playClick(); setShowAddForm(!showAddForm); }}>
          <Plus size={18} /> Forge Quest Blueprint
        </button>
      </div>

      {/* Never Miss Twice Banner at top */}
      {state.quests.some(isRecoveryMission) && (
        <div
          className="cozy-card"
          style={{
            border: '3px solid #ef4444',
            background: 'rgba(239, 68, 68, 0.08)',
            marginBottom: '24px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <ShieldAlert size={36} color="#ef4444" />
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#ef4444', marginBottom: '4px' }}>Protect tomorrow. Never miss twice!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
              You missed a habit yesterday. That's perfectly fine—momentum is built on systems, not perfection.
              <strong> Complete your recovery missions highlighted below today to protect your streak!</strong>
            </p>
          </div>
        </div>
      )}

      {/* Add habit blueprint form modal overlay */}
      {showAddForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            className="cozy-card"
            style={{ maxWidth: '500px', width: '100%', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '16px' }}>Forge Quest Blueprint</h3>
            <form onSubmit={handleCreateQuest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  Quest/Habit Name:
                </label>
                <input
                  type="text"
                  className="cozy-input"
                  placeholder="e.g. Read 10 pages, Code 30 mins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  Tiny Win Version (Consistency &gt; Intensity):
                </label>
                <input
                  type="text"
                  className="cozy-input"
                  placeholder="e.g. Read 1 page, 1 pushup"
                  value={tinyName}
                  onChange={(e) => setTinyName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  Supporting Identity:
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '3px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'var(--glass-tint)',
                    color: 'var(--text-main)',
                  }}
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                >
                  {state.selectedIdentities.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  The Trigger Cue (Obvious Law):
                </label>
                <input
                  type="text"
                  className="cozy-input"
                  placeholder="e.g. After I brew my morning tea"
                  value={cue}
                  onChange={(e) => setCue(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  The Immediate Reward (Satisfying Law):
                </label>
                <input
                  type="text"
                  className="cozy-input"
                  placeholder="e.g. Mark quest off & check island"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                />
              </div>

              {/* Habit Stacking selector */}
              {state.quests.length > 0 && (
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                    Stack immediately after: (Optional)
                  </label>
                  <select
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '3px solid var(--border-color)',
                      borderRadius: '8px',
                      background: 'var(--glass-tint)',
                      color: 'var(--text-main)',
                    }}
                    value={prevHabitId}
                    onChange={(e) => setPrevHabitId(e.target.value)}
                  >
                    <option value="">-- No stack connection --</option>
                    {state.quests.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  className="cozy-btn cozy-btn-secondary"
                  onClick={() => { playClick(); setShowAddForm(false); }}
                >
                  Cancel
                </button>
                <button type="submit" className="cozy-btn cozy-btn-primary">
                  Forge Blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Render Main Quests Checklist list */}
      {renderQuests()}
    </div>
  );
};
