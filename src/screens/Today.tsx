import React from 'react';
import { useAppState } from '../context/AppState';
import { MascotIcon, StarGuide } from '../components/Mascots';
import { Check, ShieldAlert, Sparkles, User, MessageSquare, Compass } from 'lucide-react';


const ATOMIC_QUOTES = [
  "Every action you take is a vote for the person you want to become.",
  "Habits are the compound interest of self-improvement.",
  "You do not rise to the level of your goals. You fall to the level of your systems.",
  "Never miss twice. If you miss one day, try to get back on track as quickly as possible.",
  "Consistency > Intensity. Showing up, even in a tiny way, counts.",
  "An environment designed for good choices makes habits obvious, attractive, easy, and satisfying."
];

export const Today: React.FC = () => {
  const { state, completeQuest, calculateMomentum } = useAppState();

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // 1. Personalized Greeting based on active theme
  const greeting = state.settings.theme === 'day' 
    ? `Good Day, ${state.username || 'traveller'} ☀️` 
    : `Good Evening, ${state.username || 'traveller'} 🌌`;

  const quote = ATOMIC_QUOTES[Math.floor(Date.now() / 86400000) % ATOMIC_QUOTES.length];

  // 2. Filter today's active quests
  const dailyQuests = state.quests.filter((q) => !q.isBad);

  // 3. Check for missed quests to display Never Miss Twice alert
  const missedQuests = dailyQuests.filter((q) => {
    const hasPreviousEntries = q.completedDates.length > 0;
    const completedYesterday = q.completedDates.includes(yesterdayStr);
    const completedToday = q.completedDates.includes(todayStr);
    return hasPreviousEntries && !completedYesterday && !completedToday;
  });

  // 4. Calculate Best Next Vote
  // Find the selected identity with the lowest momentum rank
  const getRank = (mom: string) => {
    switch (mom) {
      case 'Legendary': return 6;
      case 'Thriving': return 5;
      case 'Strong': return 4;
      case 'Growing': return 3;
      case 'Recovering': return 2;
      default: return 1; // Dormant
    }
  };

  let recommendedIdentity = state.selectedIdentities[0] || 'Builder';
  let minRank = 99;

  state.selectedIdentities.forEach((idName) => {
    const mom = calculateMomentum(idName);
    const rank = getRank(mom);
    if (rank < minRank) {
      minRank = rank;
      recommendedIdentity = idName;
    }
  });

  // Find habit supporting the recommended identity
  const recommendedQuest = dailyQuests.find((q) => q.identity === recommendedIdentity && !q.completedDates.includes(todayStr));
  const fallbackQuest = dailyQuests.find((q) => !q.completedDates.includes(todayStr));
  const targetRecommendation = recommendedQuest || fallbackQuest;

  // Find Future Self letter for the recommended path
  const futureMessage = state.futureMessages.find((m) => m.includes(`Future ${recommendedIdentity}`)) || 
    `You are helping create me with every action you take. Keep voting. - Future ${recommendedIdentity}`;

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Header Hero Greeting */}
      <div 
        className="cozy-card"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--primary)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 30px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.9rem', color: 'var(--primary)', marginBottom: '8px' }}>
            {greeting}
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '480px', lineHeight: '1.4' }}>
            {quote}
          </p>
        </div>
        <div>
          <StarGuide size={80} floating />
        </div>
      </div>

      {/* Never Miss Twice Warning banner */}
      {missedQuests.length > 0 && (
        <div
          className="cozy-card"
          style={{
            border: '3px solid #ef4444',
            background: 'rgba(239, 68, 68, 0.06)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <ShieldAlert size={26} color="#ef4444" />
          <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
            <strong>Never Miss Twice Active!</strong> Yesterday slipped, but consistency is a system. 
            Complete a <strong>Tiny Win</strong> or your primary quest today to protect tomorrow!
          </div>
        </div>
      )}

      {/* 2. Split Screen: Left Stats / Recommendations | Right Quests List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* LEFT COLUMN: Identity Stats & Best Next Vote */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Identity Snapshot Card */}
          <div className="cozy-card">
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} /> Identity Momentum
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.selectedIdentities.map((idName) => {
                const info = state.identities[idName];
                const momentum = calculateMomentum(idName);
                let momColor = 'var(--text-muted)';
                if (momentum === 'Legendary') momColor = '#facc15';
                else if (momentum === 'Thriving') momColor = '#10b981';
                else if (momentum === 'Strong') momColor = '#3b82f6';
                else if (momentum === 'Growing') momColor = '#a855f7';
                else if (momentum === 'Recovering') momColor = '#fb923c';

                return (
                  <div key={idName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '100%', borderLeft: `3px solid ${info.color}`, paddingLeft: '6px', fontWeight: 'bold' }}>
                        {idName}
                      </div>
                    </div>
                    <span style={{ fontWeight: 'bold', color: momColor }}>
                      {momentum}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Next Vote Card */}
          {targetRecommendation && (
            <div 
              className="cozy-card" 
              style={{ 
                border: `3px solid ${state.identities[targetRecommendation.identity]?.color || 'var(--primary)'}`,
                background: 'var(--bg-card)'
              }}
            >
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={16} /> Best Next Vote
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Low momentum detected for the <strong>{targetRecommendation.identity}</strong>. Cast your next vote:
              </p>
              <div 
                style={{
                  background: 'var(--glass-tint)',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}
              >
                <MascotIcon name={state.identities[targetRecommendation.identity]?.mascot || 'beaver'} size={40} />
                <div>
                  <strong style={{ fontSize: '0.95rem', display: 'block' }}>{targetRecommendation.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trigger: {targetRecommendation.cue}</span>
                </div>
              </div>

              {/* Quick complete buttons directly in the card */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="cozy-btn cozy-btn-primary" 
                  onClick={() => completeQuest(targetRecommendation.id, false)}
                  style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px', background: state.identities[targetRecommendation.identity]?.color }}
                >
                  Complete Primary
                </button>
                {targetRecommendation.tinyName && (
                  <button 
                    className="cozy-btn cozy-btn-secondary" 
                    onClick={() => completeQuest(targetRecommendation.id, true)}
                    style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px' }}
                  >
                    Tiny Win
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Future Self Message */}
          <div className="cozy-card">
            <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} /> Letter from Future Self
            </h3>
            <div style={{ fontSize: '0.82rem', fontStyle: 'italic', lineHeight: '1.4', padding: '10px 14px', background: 'var(--glass-tint)', borderRadius: '10px', border: '1.5px solid var(--border-color)' }}>
              {futureMessage}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Today's Quests Panel */}
        <div className="cozy-card">
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '16px' }}>Today's Quest Log</h3>
          
          {dailyQuests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No quests set up. Go to the Quests Board to forge your blueprints!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {dailyQuests.map((quest) => {
                const info = state.identities[quest.identity];
                const doneToday = quest.completedDates.includes(todayStr);
                const isTinyDone = (quest.completedTinyDates || []).includes(todayStr);

                return (
                  <div 
                    key={quest.id}
                    style={{
                      border: `2px.5 solid ${doneToday ? '#22c55e' : 'var(--border-color)'}`,
                      background: doneToday ? 'rgba(34,197,94,0.03)' : 'var(--glass-tint)',
                      borderRadius: '16px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      opacity: doneToday ? 0.75 : 1,
                    }}
                  >
                    <button
                      onClick={() => completeQuest(quest.id, false)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        border: `3px solid ${doneToday ? '#22c55e' : 'var(--border-color)'}`,
                        background: doneToday ? '#22c55e' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      {doneToday && <Check size={16} strokeWidth={3} />}
                    </button>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                        {quest.name}
                      </div>
                      
                      {/* Subtitle helper showing tiny win option if not done */}
                      {!doneToday ? (
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Tiny Win option: {quest.tinyName || 'Show up for 1 minute'}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.74rem', color: '#22c55e', fontWeight: 'bold', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={10} /> Completed as {isTinyDone ? 'Tiny Win' : 'Primary Win'}!
                        </div>
                      )}
                    </div>

                    {/* Quick complete Tiny Win button */}
                    {!doneToday && quest.tinyName && (
                      <button
                        onClick={() => completeQuest(quest.id, true)}
                        className="cozy-btn"
                        style={{
                          fontSize: '0.7rem',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          borderColor: info?.color,
                          color: info?.color,
                        }}
                      >
                        Tiny Win
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
