import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { MonsterIcon } from '../components/Mascots';
import { Sparkles, BookOpen, Target, Swords } from 'lucide-react';
import { playClick, playConfetti } from '../utils/sounds';

export const FourLawsLab: React.FC = () => {
  const { state, toggleEnvironmentItem, addFrictionStep, beatMonster, editHabit, addHabit } = useAppState();
  const [activeTab, setActiveTab] = useState<'audit' | 'environment' | 'monsters'>('audit');


  // Sub-feature 1: Audit states
  const [selectedAuditHabitId, setSelectedAuditHabitId] = useState<string>(state.quests[0]?.id || '');
  const auditHabit = state.quests.find((q) => q.id === selectedAuditHabitId);

  // Sub-feature 3: Monster combat states
  const [activeMonsterHabitId, setActiveMonsterHabitId] = useState<string>(
    state.quests.find((q) => q.isBad)?.id || ''
  );
  const [newMonsterName, setNewMonsterName] = useState('');
  const [newFrictionText, setNewFrictionText] = useState('');

  // 1. Calculations for Environment Score
  const activeItems = state.environmentItems.filter((i) => i.active);
  const badCuesCount = activeItems.filter((i) => !i.isGood).length;
  const totalCuesCount = activeItems.length;


  let environmentScore = 100;
  if (totalCuesCount > 0) {
    // Each bad item reduces score by 25%. Good items keep it high.
    environmentScore = Math.max(0, 100 - badCuesCount * 25);
  }

  // 2. Calculations for Monsters
  const badHabits = state.quests.filter((q) => q.isBad);
  const selectedMonsterHabit = state.quests.find((q) => q.id === activeMonsterHabitId);
  const monsterFrictionSteps = selectedMonsterHabit?.frictionSteps || [];
  // Monster HP starts at 100. Each friction step deals 25 DMG.
  const monsterHp = Math.max(0, 100 - monsterFrictionSteps.length * 25);

  const handleCreateBadHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonsterName.trim()) return;
    playClick();

    const id = `bad_habit_${Date.now()}`;
    addHabit({
      id,
      name: newMonsterName,
      identity: 'Health Guardian', // Default connection
      isBad: true,
      cue: 'Visual trigger details',
      craving: 'Urge details',
      response: 'Bad action',
      reward: 'Instant spike',
      scores: { obvious: 3, attractive: 4, easy: 4, satisfying: 4 },
      stackPrevHabitId: null,
      frictionSteps: [],
    });

    setActiveMonsterHabitId(id);
    setNewMonsterName('');
  };

  const handleAddFriction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrictionText.trim() || !activeMonsterHabitId) return;
    playClick();

    addFrictionStep(activeMonsterHabitId, newFrictionText);
    setNewFrictionText('');

    // If HP reaches 0 (this will be the 4th friction step)
    const currentStepsCount = selectedMonsterHabit?.frictionSteps.length || 0;
    if (currentStepsCount === 3) {
      setTimeout(() => {
        playConfetti();
        beatMonster(selectedMonsterHabit?.name || 'Bad Habit');
      }, 400);
    }
  };

  const handleAuditScoreChange = (law: 'obvious' | 'attractive' | 'easy' | 'satisfying', val: number) => {
    if (!auditHabit) return;
    const updated = {
      ...auditHabit,
      scores: {
        ...auditHabit.scores,
        [law]: val,
      },
    };
    editHabit(updated);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>The 4 Laws Lab</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Deconstruct, optimize, and build bulletproof habit systems.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '3px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          className="cozy-btn"
          onClick={() => { playClick(); setActiveTab('audit'); }}
          style={{
            borderBottom: activeTab === 'audit' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'audit' ? 'var(--primary)' : 'var(--text-muted)',
            borderRadius: '8px 8px 0 0',
            paddingBottom: '12px',
          }}
        >
          <Target size={16} /> 4 Laws Audit Scorecard
        </button>
        <button
          className="cozy-btn"
          onClick={() => { playClick(); setActiveTab('environment'); }}
          style={{
            borderBottom: activeTab === 'environment' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'environment' ? 'var(--primary)' : 'var(--text-muted)',
            borderRadius: '8px 8px 0 0',
            paddingBottom: '12px',
          }}
        >
          <BookOpen size={16} /> Environment Designer
        </button>
        <button
          className="cozy-btn"
          onClick={() => { playClick(); setActiveTab('monsters'); }}
          style={{
            borderBottom: activeTab === 'monsters' ? '3px solid var(--primary)' : 'none',
            color: activeTab === 'monsters' ? 'var(--primary)' : 'var(--text-muted)',
            borderRadius: '8px 8px 0 0',
            paddingBottom: '12px',
          }}
        >
          <Swords size={16} /> Friction vs. Monsters
        </button>
      </div>

      {/* TAB 1: 4 LAWS AUDIT */}
      {activeTab === 'audit' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="cozy-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', color: 'var(--primary)' }}>
              Habit Optimization Audit
            </h3>
            
            {state.quests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>You must create a habit blueprint card first.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                    Select Habit to Audit:
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
                    value={selectedAuditHabitId}
                    onChange={(e) => setSelectedAuditHabitId(e.target.value)}
                  >
                    {state.quests.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name} ({q.isBad ? 'Bad Habit Monster' : 'Quest'})
                      </option>
                    ))}
                  </select>
                </div>

                {auditHabit && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginTop: '12px' }}>
                    
                    {/* Score sliders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[
                        { law: 'obvious', title: '1st Law: Make It Obvious (Visual Cues)', desc: 'How visible is your trigger in your physical room?' },
                        { law: 'attractive', title: '2nd Law: Make It Attractive (Desire)', desc: 'Do you look forward to doing this? Is there temptation bundling?' },
                        { law: 'easy', title: '3rd Law: Make It Easy (Reduce Friction)', desc: 'Can this action be done in less than 2 minutes? Is it friction-free?' },
                        { law: 'satisfying', title: '4th Law: Make It Satisfying (Reward)', desc: 'Do you feel a sense of immediate reward upon finishing?' },
                      ].map((item) => {
                        const lawKey = item.law as 'obvious' | 'attractive' | 'easy' | 'satisfying';
                        const score = auditHabit.scores[lawKey] || 3;
                        return (
                          <div
                            key={item.law}
                            style={{
                              border: '2px solid var(--border-color)',
                              borderRadius: '12px',
                              padding: '14px',
                              background: 'var(--glass-tint)',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <strong>{item.title}</strong>
                              <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{score} / 5</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                              {item.desc}
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={score}
                              onChange={(e) => handleAuditScoreChange(lawKey, Number(e.target.value))}
                              style={{ width: '100%', accentColor: 'var(--primary)' }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Suggestions Box */}
                    <div
                      style={{
                        border: '3px solid var(--primary)',
                        background: 'var(--primary-glow)',
                        borderRadius: '16px',
                        padding: '16px 20px',
                      }}
                    >
                      <h4 style={{ color: 'var(--primary)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <Sparkles size={16} /> Star Guide Recommendations
                      </h4>
                      <ul style={{ fontSize: '0.85rem', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '14px' }}>
                        {auditHabit.scores.obvious < 4 && (
                          <li><strong>To make obvious:</strong> Design your environment. Place your books on your pillow or your yoga mat in the center of the floor.</li>
                        )}
                        {auditHabit.scores.attractive < 4 && (
                          <li><strong>To make attractive:</strong> Bundle with temptations. Listen to your favorite album only while performing this habit.</li>
                        )}
                        {auditHabit.scores.easy < 4 && (
                          <li><strong>To make easy:</strong> Apply the 2-minute rule. Don't workout for 1 hour—just commit to putting on your gym shoes.</li>
                        )}
                        {auditHabit.scores.satisfying < 4 && (
                          <li><strong>To make satisfying:</strong> Make completion immediate. Check off this card immediately to hear your sound chime!</li>
                        )}
                        {auditHabit.scores.obvious >= 4 && auditHabit.scores.attractive >= 4 && auditHabit.scores.easy >= 4 && auditHabit.scores.satisfying >= 4 && (
                          <li>This system is highly optimized. Maintain discipline and protect your streaks!</li>
                        )}
                      </ul>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ENVIRONMENT DESIGNER */}
      {activeTab === 'environment' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="cozy-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>Desk Layout Space</h3>
              <div style={{ background: 'var(--primary-glow)', border: '2.5px solid var(--primary)', borderRadius: '12px', padding: '6px 12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                Environment Score: {environmentScore}%
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Arrange cues in your virtual room to prime your habits. Activating distracting items (like your Phone or Snacks) will lower your Environment Score.
            </p>

            {/* Grid display representing room desk space */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gridTemplateRows: 'repeat(3, 90px)',
                gap: '12px',
                border: '3px solid var(--border-color)',
                borderRadius: '16px',
                background: 'rgba(0,0,0,0.1)',
                padding: '16px',
                position: 'relative',
                marginBottom: '24px',
              }}
            >
              {state.environmentItems.map((item) => {
                const active = item.active;
                return (
                  <div
                    key={item.id}
                    onClick={() => { playClick(); toggleEnvironmentItem(item.id); }}
                    style={{
                      gridColumnStart: item.x + 1,
                      gridRowStart: item.y + 1,
                      border: `3.5px solid ${active ? (item.isGood ? '#22c55e' : '#ef4444') : 'var(--border-color)'}`,
                      background: active ? (item.isGood ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'var(--bg-card)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.6rem',
                      position: 'relative',
                      boxShadow: active ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
                    }}
                    title={`${item.name} (${item.isGood ? 'Positive Cue' : 'Distraction'})`}
                  >
                    <span>{item.icon}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 'bold', marginTop: '4px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Analysis message */}
            <div style={{ border: '2px solid var(--border-color)', borderRadius: '12px', padding: '12px 16px', background: 'var(--glass-tint)', fontSize: '0.85rem', lineHeight: '1.4' }}>
              {environmentScore >= 80 && (
                <div style={{ color: '#22c55e' }}>
                  <strong>🏆 Ideal Environment Setup:</strong> Visual cues are prominent, and bad habits have high friction. Your physical space is aligned with your mind.
                </div>
              )}
              {environmentScore >= 50 && environmentScore < 80 && (
                <div style={{ color: 'var(--primary)' }}>
                  <strong>⚠️ Average Environment:</strong> You have a couple of distractions on your desk. Turn off your Phone or put the Chips/Snacks back in the cupboard to increase focus.
                </div>
              )}
              {environmentScore < 50 && (
                <div style={{ color: '#ef4444' }}>
                  <strong>🚨 High Friction Room:</strong> Your workspace is filled with active visual distractions. Clear these away to make focus the default action.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: FRICTION MONSTERS */}
      {activeTab === 'monsters' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          
          <div className="cozy-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--primary)' }}>
              Bad Habit Arena
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Cast a monster for bad habits you want to break. Defeat them by building friction layers (Make it Difficult!).
            </p>

            <form onSubmit={handleCreateBadHabit} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input
                type="text"
                className="cozy-input"
                placeholder="Bad habit monster (e.g. Doomscroll, Sugary Snacks)"
                value={newMonsterName}
                onChange={(e) => setNewMonsterName(e.target.value)}
                required
              />
              <button type="submit" className="cozy-btn cozy-btn-primary">
                Spawn Monster
              </button>
            </form>

            {badHabits.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                No bad habit monsters spawned. Spawn one above to begin the friction audit.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                
                {/* Monsters List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Target Monster:</label>
                  {badHabits.map((q) => {
                    const isSelected = q.id === activeMonsterHabitId;
                    const hp = Math.max(0, 100 - q.frictionSteps.length * 25);
                    return (
                      <div
                        key={q.id}
                        onClick={() => { playClick(); setActiveMonsterHabitId(q.id); }}
                        style={{
                          border: `3px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                          background: isSelected ? 'var(--primary-glow)' : 'var(--bg-card)',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <MonsterIcon name={q.name} size={48} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{q.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Friction: {q.frictionSteps.length * 25}%
                          </div>
                          
                          {/* HP Bar */}
                          <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                            <div style={{ width: `${hp}%`, height: '100%', background: hp > 50 ? '#22c55e' : hp > 25 ? '#fb923c' : '#ef4444', transition: 'width 0.3s ease' }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Combat Controls & Friction additions */}
                {selectedMonsterHabit && (
                  <div style={{ border: '2.5px solid var(--border-color)', borderRadius: '16px', padding: '16px', background: 'var(--glass-tint)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <MonsterIcon name={selectedMonsterHabit.name} size={76} />
                      <h4 style={{ marginTop: '8px' }}>{selectedMonsterHabit.name} Monster</h4>
                      <div style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 'bold' }}>
                        {monsterHp > 0 ? `HP: ${monsterHp} / 100` : '🏆 Slayed / Defeated'}
                      </div>
                    </div>

                    {monsterHp > 0 ? (
                      <form onSubmit={handleAddFriction} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Add Friction Shield Step (e.g. Delete App, Screen limit):</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            className="cozy-input"
                            placeholder="e.g. Put phone in other room"
                            value={newFrictionText}
                            onChange={(e) => setNewFrictionText(e.target.value)}
                            required
                            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                          />
                          <button type="submit" className="cozy-btn cozy-btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                            Weaken
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid #22c55e', borderRadius: '12px', padding: '10px', fontSize: '0.8rem', color: '#22c55e', textAlign: 'center' }}>
                        Fantastic! 4 layers of friction have completely neutralized this bad habit monster. Keep it up!
                      </div>
                    )}

                    {/* Friction logs */}
                    {monsterFrictionSteps.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <strong style={{ fontSize: '0.8rem', display: 'block', marginBottom: '6px' }}>Friction Shields Built:</strong>
                        <ul style={{ fontSize: '0.78rem', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {monsterFrictionSteps.map((step, sIdx) => (
                            <li key={sIdx} style={{ color: 'var(--text-muted)' }}>
                              🛡️ {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
