import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { playClick } from '../utils/sounds';
import { BookOpen, PenTool } from 'lucide-react';


interface LoreChapter {
  lvl: number;
  title: string;
  text: string;
}

const LORE_CHAPTERS: Record<string, LoreChapter[]> = {
  Builder: [
    { lvl: 1, title: 'The Blueprint Sparks', text: 'You standing before the empty plot, drawing lines in the dirt. The beaver hands you a wooden pencil. A small spark lights up your eyes.' },
    { lvl: 3, title: 'Constructing Foundations', text: 'Scaffolding rises. Your workbench is covered in plans. You write functions that hold, and scripts that resolve. The foundations are set.' },
    { lvl: 5, title: 'The Clockwork Spire', text: 'A central clockwork tower emerges on Builder Island. Gears turn in sync, echoing your disciplined daily schedule.' },
    { lvl: 7, title: 'A Flying Metropolis', text: 'Your island rises above the clouds, propelled by magnetic anchors. Engines hum—a testament to system building.' },
    { lvl: 8, title: 'Legendary Master Smith', text: 'Your designs are immortal. The beaver crowns you, as your floating cities sail the celestial winds.' },
  ],
  Scholar: [
    { lvl: 1, title: 'The Sparks of Curiosity', text: 'A single candle flickers. The wise owl sits on a pile of books, nodding. You turn the first dusty page.' },
    { lvl: 3, title: 'The Scribes Library', text: 'Shelves fill up with manuscripts. You begin to trace the links between concepts, compiling notes in your journal.' },
    { lvl: 5, title: 'The Observatories Lens', text: 'A glass telescope points to the stars. You decode patterns in the stars, understanding the systems of the cosmos.' },
    { lvl: 7, title: 'The Floating Academy', text: 'Students travel from far islands to read your archives. You teach the laws of compounding wisdom.' },
    { lvl: 8, title: 'Sage of the Cosmos', text: 'Total understanding. The owl bows as the stars speak directly to your library.' },
  ],
  Athlete: [
    { lvl: 1, title: 'The Forest Trail', text: 'Lacing up shoes on the dirt path. The fox runs ahead, looking back with a grin. The air feels cool.' },
    { lvl: 3, title: 'Strengthening the Pulse', text: 'Your breathing is steady now. You scale hills without stopping. Your heart pumps with raw energy.' },
    { lvl: 5, title: 'The Arena Spire', text: 'A running stadium is built on your island. You train in the rain, finding comfort in the friction.' },
    { lvl: 7, title: 'The Cloudrunner Athletics', text: 'You run across narrow sky arches. Gravity feels lighter, your movements are fluid and precise.' },
    { lvl: 8, title: 'Avatar of Vitality', text: 'Unstoppable endurance. You leave glowing trails on the trails, sprinting alongside the wind.' },
  ],
  Monk: [
    { lvl: 1, title: 'The Quiet Pool', text: 'Sitting cross-legged on a stone. The turtle closes its eyes. You breathe in, you breathe out.' },
    { lvl: 3, title: 'Stillness in Storms', text: 'Clouds gather and rain falls, but your mind is calm. The ripples on the water settle.' },
    { lvl: 5, title: 'The Bamboo Gardens', text: 'Wind chimes ring in the bamboo gardens. Your thoughts pass like clouds in a clear blue sky.' },
    { lvl: 7, title: 'The Lotus Levitation', text: 'A glowing circle surrounds you. You levitate above the quiet pool, completely centered.' },
    { lvl: 8, title: 'Zen Master of the Universe', text: 'Absolute focus. The turtle rests in your hand as your peace radiates across the entire archipelago.' },
  ],
  Creator: [
    { lvl: 1, title: 'The Blank Parchment', text: 'A white canvas sits on the easel. The rabbit holds a wooden paintbrush, urging you to make the first stroke.' },
    { lvl: 3, title: 'Blending Colors', text: 'Your card designs are vibrant. You write verses, draw characters, and sculpt clay. The studio is messy but alive.' },
    { lvl: 5, title: 'The Grand Gallery', text: 'Your island hosts an art museum. Visitors walk through, inspired by the stories you forge daily.' },
    { lvl: 7, title: 'Floating Masterpieces', text: 'Your sculptures float in the sky. Your words manifest as physical stars in the atmosphere.' },
    { lvl: 8, title: 'Architect of Imagination', text: 'Your thoughts paint reality. The rabbit paints a crown of stardust upon your brow.' },
  ],
};

export const StoryBook: React.FC = () => {
  const { state, saveReflection } = useAppState();
  const [activeTab, setActiveTab] = useState<'stories' | 'reflection'>('stories');
  const [selectedPath, setSelectedPath] = useState<string>('Builder');

  // Reflection form states
  const [well, setWell] = useState('');
  const [difficult, setDifficult] = useState('');
  const [identityName, setIdentityName] = useState(state.selectedIdentities[0] || 'Builder');
  const [tomorrow, setTomorrow] = useState('');

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!well.trim() || !difficult.trim() || !tomorrow.trim()) return;
    playClick();

    saveReflection(well, difficult, identityName, tomorrow);
    // Reset Form
    setWell('');
    setDifficult('');
    setTomorrow('');
  };

  const activePathLevel = state.identities[selectedPath]?.level || 1;
  const chapters = LORE_CHAPTERS[selectedPath] || [];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Story Mode & Reflections</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Read unlocked lore chapters of your transformation, and log your daily review.
          </p>
        </div>
        
        {/* Toggle tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`cozy-btn ${activeTab === 'stories' ? 'cozy-btn-primary' : 'cozy-btn-secondary'}`}
            onClick={() => { playClick(); setActiveTab('stories'); }}
          >
            <BookOpen size={16} /> Story Chapters
          </button>
          <button
            className={`cozy-btn ${activeTab === 'reflection' ? 'cozy-btn-primary' : 'cozy-btn-secondary'}`}
            onClick={() => { playClick(); setActiveTab('reflection'); }}
          >
            <PenTool size={16} /> Daily Reflection
          </button>
        </div>
      </div>

      {/* STORY BOOK CHAPTERS PANEL */}
      {activeTab === 'stories' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="cozy-card">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '16px' }}>Path Chapters</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {['Builder', 'Scholar', 'Athlete', 'Monk', 'Creator'].map((path) => (
                <button
                  key={path}
                  className="cozy-btn"
                  onClick={() => { playClick(); setSelectedPath(path); }}
                  style={{
                    background: selectedPath === path ? 'var(--primary)' : 'var(--glass-tint)',
                    color: selectedPath === path ? 'white' : 'var(--text-main)',
                    border: `2px solid ${selectedPath === path ? 'var(--primary)' : 'var(--border-color)'}`,
                    fontSize: '0.85rem',
                    padding: '8px 16px',
                  }}
                >
                  {path} (Lvl {state.identities[path]?.level || 1})
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {chapters.map((chap) => {
                const isUnlocked = activePathLevel >= chap.lvl;
                return (
                  <div
                    key={chap.lvl}
                    style={{
                      border: `3px solid ${isUnlocked ? 'var(--border-color)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius: '16px',
                      padding: '16px 20px',
                      background: isUnlocked ? 'var(--glass-tint)' : 'rgba(0,0,0,0.15)',
                      opacity: isUnlocked ? 1 : 0.45,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                        Lvl {chap.lvl} - {chap.title}
                      </h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isUnlocked ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {isUnlocked ? '✨ UNLOCKED' : '🔒 LOCKED'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.5', fontStyle: isUnlocked ? 'normal' : 'italic', color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {isUnlocked ? chap.text : 'Complete quests to level up this identity island and decode this lore chapter.'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DAILY REFLECTION JOURNAL PANEL */}
      {activeTab === 'reflection' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          
          {/* Form */}
          <div className="cozy-card">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '16px' }}>End of Day Review</h3>
            <form onSubmit={handleSaveReflection} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  What went well today?
                </label>
                <textarea
                  className="cozy-input"
                  placeholder="e.g. Coded for 30 minutes straight without checking my phone."
                  value={well}
                  onChange={(e) => setWell(e.target.value)}
                  required
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                  What felt difficult or caused friction?
                </label>
                <textarea
                  className="cozy-input"
                  placeholder="e.g. Struggled to start reading; spent 20 minutes doomscrolling instead."
                  value={difficult}
                  onChange={(e) => setDifficult(e.target.value)}
                  required
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                    Which identity did you strengthen most?
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
                    value={identityName}
                    onChange={(e) => setIdentityName(e.target.value)}
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
                    What will you improve tomorrow?
                  </label>
                  <input
                    type="text"
                    className="cozy-input"
                    placeholder="e.g. Put phone in other room before starting"
                    value={tomorrow}
                    onChange={(e) => setTomorrow(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="submit" className="cozy-btn cozy-btn-primary">
                  Seal Reflection
                </button>
              </div>
            </form>
          </div>

          {/* History */}
          <div className="cozy-card">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '16px' }}>Past Reflections</h3>
            {state.reflections.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                No reflections logged yet. Review your day above to start building self-awareness logs.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                {state.reflections.map((ref, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '2.5px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '16px',
                      background: 'var(--glass-tint)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <span style={{ color: 'var(--primary)' }}>Reflected on {ref.date}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Reinforced: {ref.identityName}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.4', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div><strong>What went well:</strong> {ref.well}</div>
                      <div><strong>Obstacles:</strong> {ref.difficult}</div>
                      <div><strong>Tomorrow's strategy:</strong> {ref.tomorrow}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
