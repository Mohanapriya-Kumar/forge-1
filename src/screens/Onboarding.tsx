import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { StarGuide, MascotIcon } from '../components/Mascots';
import { ArrowRight, Trophy } from 'lucide-react';
import { playClick } from '../utils/sounds';


export const Onboarding: React.FC = () => {
  const { state, setUsername, setOnboarded, setSelectedIdentities, addHabit } = useAppState();
  const [step, setStep] = useState(1);
  const [tempName, setTempName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [habitsSetup, setHabitsSetup] = useState<{
    [identityName: string]: {
      name: string;
      tinyName: string;
      cue: string;
      craving: string;
      response: string;
      reward: string;
      obvious: number;
      attractive: number;
      easy: number;
      satisfying: number;
    }
  }>({});

  const defaultIds = Object.keys(state.identities);

  const handleNextStep1 = () => {
    if (!tempName.trim()) return;
    playClick();
    setUsername(tempName);
    setStep(2);
  };

  const toggleIdentitySelection = (id: string) => {
    playClick();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleNextStep2 = () => {
    if (selectedIds.length === 0) return;
    playClick();
    setSelectedIdentities(selectedIds);
    
    // Initialize empty habit setups for selected identities
    const initialSetups: typeof habitsSetup = {};
    selectedIds.forEach((id) => {
      let defaultHabitName = 'Read 10 pages';
      if (id === 'Builder') defaultHabitName = 'Code for 30 minutes';
      if (id === 'Athlete') defaultHabitName = 'Exercise for 20 minutes';
      if (id === 'Monk') defaultHabitName = 'Meditate for 10 minutes';
      if (id === 'Creator') defaultHabitName = 'Write 200 words';
      if (id === 'Explorer') defaultHabitName = 'Learn one new concept';
      if (id === 'Leader') defaultHabitName = 'Help a team member';
      if (id === 'Entrepreneur') defaultHabitName = 'Review business stats';
      if (id === 'Deep Worker') defaultHabitName = '90-min focus block';
      if (id === 'Reader') defaultHabitName = 'Read 1 chapter';
      if (id === 'Health Guardian') defaultHabitName = 'Stretch & Hydrate';
      if (id === 'Communicator') defaultHabitName = 'Reach out to a friend';

      let defaultTinyName = 'Show up for 1 minute';
      if (id === 'Builder') defaultTinyName = 'Open VS Code';
      if (id === 'Scholar') defaultTinyName = 'Read 1 page';
      if (id === 'Athlete') defaultTinyName = '1 pushup';
      if (id === 'Monk') defaultTinyName = '1 minute focus';
      if (id === 'Creator') defaultTinyName = 'Write 1 sentence';
      if (id === 'Explorer') defaultTinyName = 'Look at 1 headline';
      if (id === 'Leader') defaultTinyName = 'Say thank you';
      if (id === 'Entrepreneur') defaultTinyName = 'Open dashboard';
      if (id === 'Deep Worker') defaultTinyName = 'Open document';
      if (id === 'Reader') defaultTinyName = 'Read 1 page';
      if (id === 'Health Guardian') defaultTinyName = 'Drink 1 glass of water';
      if (id === 'Communicator') defaultTinyName = 'Send 1 text';

      initialSetups[id] = {
        name: defaultHabitName,
        tinyName: defaultTinyName,
        cue: 'After I sit at my desk in the morning',
        craving: `I want to build my ${id} identity`,
        response: defaultHabitName,
        reward: `Check off quest and watch my ${id} island grow`,
        obvious: 4,
        attractive: 4,
        easy: 4,
        satisfying: 5,
      };
    });
    setHabitsSetup(initialSetups);
    setStep(3);
  };

  const handleHabitChange = (id: string, field: string, value: string | number) => {
    setHabitsSetup({
      ...habitsSetup,
      [id]: {
        ...habitsSetup[id],
        [field]: value,
      },
    });
  };

  const handleFinishOnboarding = () => {
    playClick();
    // Add all created habits to global state
    selectedIds.forEach((id) => {
      const h = habitsSetup[id];
      addHabit({
        id: `quest_${id.toLowerCase()}_${Date.now()}`,
        name: h.name,
        tinyName: h.tinyName,
        identity: id,
        isBad: false,
        cue: h.cue,
        craving: h.craving,
        response: h.response,
        reward: h.reward,
        scores: {
          obvious: Number(h.obvious),
          attractive: Number(h.attractive),
          easy: Number(h.easy),
          satisfying: Number(h.satisfying),
        },
        frictionSteps: [],
      });
    });

    setOnboarded(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        zIndex: 5,
      }}
    >
      <div style={{ maxWidth: '750px', width: '100%' }}>
        
        {/* Step 1: Username Entry */}
        {step === 1 && (
          <div className="cozy-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ marginBottom: '24px' }}>
              <StarGuide size={80} />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--primary)' }}>
              Welcome to the self-transformation Forge!
            </h2>
            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.6' }}>
              "Every action you take is a vote for the person you want to become."
              <br />
              I am your Guide Star. Let's begin by forging your name.
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
              <input
                type="text"
                className="cozy-input"
                placeholder="What shall I call you?"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNextStep1()}
                style={{ textAlign: 'center' }}
              />
              <button className="cozy-btn cozy-btn-primary" onClick={handleNextStep1} disabled={!tempName.trim()}>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Identities */}
        {step === 2 && (
          <div className="cozy-card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <StarGuide size={60} />
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Who do you want to become?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Select at least 3 identities to anchor your islands.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '16px',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '8px',
                marginBottom: '24px',
                border: '3px solid var(--border-color)',
                borderRadius: '12px',
                background: 'var(--glass-tint)',
              }}
            >
              {defaultIds.map((id) => {
                const info = state.identities[id];
                const selected = selectedIds.includes(id);
                return (
                  <div
                    key={id}
                    onClick={() => toggleIdentitySelection(id)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: `3px solid ${selected ? info.color : 'var(--border-color)'}`,
                      background: selected ? `${info.color}15` : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <MascotIcon name={info.mascot} size={60} glow={selected} />
                    <div style={{ fontWeight: 'bold', marginTop: '10px', color: selected ? info.color : 'var(--text-main)' }}>
                      {id}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {info.description}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {selectedIds.length} identities selected (Need at least 1, recommended 3+)
              </div>
              <button
                className="cozy-btn cozy-btn-primary"
                onClick={handleNextStep2}
                disabled={selectedIds.length === 0}
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Design Supporting Habits */}
        {step === 3 && (
          <div className="cozy-card" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <StarGuide size={60} />
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>Forge Habit Blueprints</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Let's wire a supportive action for each selected identity using the Four Laws.
                </p>
              </div>
            </div>

            <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '8px', marginBottom: '24px' }}>
              {selectedIds.map((id) => {
                const habit = habitsSetup[id];
                const info = state.identities[id];
                if (!habit) return null;
                return (
                  <div
                    key={id}
                    style={{
                      border: `3px solid ${info.color}`,
                      borderRadius: '16px',
                      padding: '20px',
                      marginBottom: '20px',
                      background: 'var(--glass-tint)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <MascotIcon name={info.mascot} size={48} />
                      <h4 style={{ color: info.color, fontSize: '1.2rem' }}>Path of the {id}</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                          Habit Action (The Quest):
                        </label>
                        <input
                          type="text"
                          className="cozy-input"
                          value={habit.name}
                          onChange={(e) => handleHabitChange(id, 'name', e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                          Tiny Win Version (Consistency &gt; Intensity):
                        </label>
                        <input
                          type="text"
                          className="cozy-input"
                          value={habit.tinyName}
                          onChange={(e) => handleHabitChange(id, 'tinyName', e.target.value)}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                            The Trigger Cue (Obvious):
                          </label>
                          <input
                            type="text"
                            className="cozy-input"
                            value={habit.cue}
                            onChange={(e) => handleHabitChange(id, 'cue', e.target.value)}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                            The Reward (Satisfying):
                          </label>
                          <input
                            type="text"
                            className="cozy-input"
                            value={habit.reward}
                            onChange={(e) => handleHabitChange(id, 'reward', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                          Is it Easy, Obvious, Attractive, and Satisfying? (Rate 1-5):
                        </label>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                          {['obvious', 'attractive', 'easy', 'satisfying'].map((law) => (
                            <div key={law} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{law}:</span>
                              <select
                                style={{
                                  background: 'var(--bg-card)',
                                  border: '2px solid var(--border-color)',
                                  borderRadius: '6px',
                                  padding: '4px',
                                  color: 'var(--text-main)',
                                }}
                                value={(habit as any)[law]}
                                onChange={(e) => handleHabitChange(id, law, Number(e.target.value))}
                              >
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="cozy-btn cozy-btn-secondary" onClick={() => setStep(2)}>
                Back
              </button>
              <button className="cozy-btn cozy-btn-primary" onClick={handleFinishOnboarding}>
                Forge My World <Trophy size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
