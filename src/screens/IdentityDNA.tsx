import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import type { AvatarEquipment } from '../context/AppState';
import { PlayerAvatar } from '../components/Mascots';
import { playClick } from '../utils/sounds';
import { Award, Dna, User } from 'lucide-react';


export const IdentityDNA: React.FC = () => {
  const { state, equipAvatarItem } = useAppState();
  const [activeTab, setActiveTab] = useState<'avatar' | 'dna'>('avatar');

  // 1. Calculate Identity Votes Distribution
  const totalVotes = Object.values(state.identities).reduce((acc, curr) => acc + curr.votes, 0);
  const identityPercentages = Object.values(state.identities).map((ident) => {
    const percentage = totalVotes > 0 ? (ident.votes / totalVotes) * 100 : 0;
    return {
      name: ident.name,
      votes: ident.votes,
      percentage: Math.round(percentage),
      color: ident.color,
      mascot: ident.mascot,
    };
  }).filter((i) => i.votes > 0).sort((a, b) => b.votes - a.votes);

  // 2. Accumulate DNA Traits points from all identities
  const dnaTraits = {
    consistency: 0,
    health: 0,
    fitness: 0,
    knowledge: 0,
    creativity: 0,
    discipline: 0,
    mindfulness: 0,
    leadership: 0,
  };

  Object.values(state.identities).forEach((ident) => {
    Object.keys(ident.traits).forEach((trait) => {
      const key = trait as keyof typeof dnaTraits;
      // Weight by island level or votes
      dnaTraits[key] += ident.traits[key];
    });
  });

  const handleEquip = (category: keyof AvatarEquipment, item: string) => {
    playClick();
    equipAvatarItem(category, item);
  };

  // Render SVG Radial Identity Wheel using clean slices
  const renderIdentityWheel = () => {
    if (identityPercentages.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
          No votes cast yet. Complete daily quests to start spinning the Identity Wheel!
        </div>
      );
    }

    let accumulatedAngle = 0;
    const radius = 60;
    const cx = 100;
    const cy = 100;

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="70" fill="none" stroke="var(--border-color)" strokeWidth="12" />
          {identityPercentages.map((item, idx) => {
            const angle = (item.percentage / 100) * 360;
            const startAngle = accumulatedAngle;
            accumulatedAngle += angle;

            // Math to calculate circular coordinates
            const x1 = cx + radius * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = cy + radius * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = cx + radius * Math.cos((accumulatedAngle - 90) * Math.PI / 180);
            const y2 = cy + radius * Math.sin((accumulatedAngle - 90) * Math.PI / 180);

            const largeArc = angle > 180 ? 1 : 0;

            return (
              <path
                key={idx}
                d={`M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`}
                fill="none"
                stroke={item.color}
                strokeWidth="14"
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.15))' }}
              />
            );
          })}
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {identityPercentages.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
              <strong style={{ fontSize: '0.9rem' }}>{item.name}:</strong>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.percentage}% ({item.votes} Votes)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render SVG double helix animation for DNA representation
  const renderDNAHelix = () => {
    // Generate sine waves for double helix
    const points: number[] = [];

    const numPoints = 8;
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / (numPoints - 1)) * Math.PI * 2.5;
      points.push(angle);
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <svg width="600" height="160" viewBox="0 0 600 160" style={{ overflow: 'visible' }}>
          {/* Main helix lines */}
          {points.map((angle, idx) => {
            if (idx === 0) return null;
            const prevAngle = points[idx - 1];
            const prevX = (idx - 1) * 75 + 40;
            const prevY1 = 80 + Math.sin(prevAngle) * 40;
            const prevY2 = 80 - Math.sin(prevAngle) * 40;

            const x = idx * 75 + 40;
            const y1 = 80 + Math.sin(angle) * 40;
            const y2 = 80 - Math.sin(angle) * 40;

            return (
              <g key={`strand-${idx}`}>
                {/* Horizontal link bar */}
                <line x1={x} y1={y1} x2={x} y2={y2} stroke="rgba(168, 85, 247, 0.3)" strokeWidth="3" />
                {/* Strand curves */}
                <line x1={prevX} y1={prevY1} x2={x} y2={y1} stroke="#a855f7" strokeWidth="4" strokeLinecap="round" />
                <line x1={prevX} y1={prevY2} x2={x} y2={y2} stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
              </g>
            );
          })}

          {/* Node descriptors */}
          {points.map((angle, idx) => {
            const x = idx * 75 + 40;
            const y1 = 80 + Math.sin(angle) * 40;
            const traitsArray = Object.entries(dnaTraits);
            const currentTrait = traitsArray[idx % traitsArray.length];
            if (!currentTrait) return null;

            return (
              <g key={`node-${idx}`}>
                <circle cx={x} cy={y1} r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" className="glow-glow" />
                <text x={x} y={y1 - 14} textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--text-main)" style={{ textTransform: 'capitalize' }}>
                  {currentTrait[0]}
                </text>
                <text x={x} y={y1 + 22} textAnchor="middle" fontSize="9.5" fill="var(--primary)" fontWeight="bold">
                  {currentTrait[1]} pts
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Avatar Evolution & Identity DNA</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Customize your player appearance and audit your trait coordinates.
          </p>
        </div>

        {/* Tab triggers */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`cozy-btn ${activeTab === 'avatar' ? 'cozy-btn-primary' : 'cozy-btn-secondary'}`}
            onClick={() => { playClick(); setActiveTab('avatar'); }}
          >
            <User size={16} /> Customize Avatar
          </button>
          <button
            className={`cozy-btn ${activeTab === 'dna' ? 'cozy-btn-primary' : 'cozy-btn-secondary'}`}
            onClick={() => { playClick(); setActiveTab('dna'); }}
          >
            <Dna size={16} /> Identity DNA Wheel
          </button>
        </div>
      </div>

      {/* CUSTOMIZE AVATAR PANEL */}
      {activeTab === 'avatar' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Visual Display Center */}
          <div className="cozy-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
            <PlayerAvatar stage={state.avatar.stage} equipped={state.avatar.equipped} size={150} />
            <h3 style={{ fontSize: '1.3rem', marginTop: '16px', color: 'var(--text-main)' }}>
              {state.username || 'The Smith'}
            </h3>
            <div style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 'bold' }}>
              {state.avatar.equipped.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Transformation Stage: {state.avatar.stage} / 4
            </div>
          </div>

          {/* Equippable Items selections */}
          <div className="cozy-card">
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '16px' }}>Forge Equipment Wardrobe</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Unlock new visual items by raising your floating identity islands to Level 2 or higher!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Head gear options */}
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Headpiece / Hair:</strong>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'basic_hair', label: 'Basic Hair' },
                    { id: 'hardhat', label: 'Builder Hardhat' },
                    { id: 'sweatband', label: 'Athlete Sweatband' },
                    { id: 'laurel_crown', label: 'Leader Crown' },
                    { id: 'explorer_hat', label: 'Explorer Hat' },
                    { id: 'owl_glasses', label: 'Scholar Glasses' },
                    { id: 'wooden_beads', label: 'Monk Beads' },
                  ].map((h) => {
                    const isUnlocked = state.avatar.unlockedItems.includes(h.id);
                    const isEquipped = state.avatar.equipped.head === h.id;
                    return (
                      <button
                        key={h.id}
                        onClick={() => isUnlocked && handleEquip('head', h.id)}
                        disabled={!isUnlocked}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: isEquipped ? '2.5px solid var(--primary)' : '2px solid var(--border-color)',
                          background: isEquipped ? 'var(--primary-glow)' : 'var(--glass-tint)',
                          color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)',
                          fontSize: '0.8rem',
                          cursor: isUnlocked ? 'pointer' : 'not-allowed',
                          opacity: isUnlocked ? 1 : 0.4,
                        }}
                      >
                        {h.label} {!isUnlocked && '🔒'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body robe options */}
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Robe / Plate Armor:</strong>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'apprentice_robe', label: 'Apprentice Robe' },
                    { id: 'scholar_cloak', label: 'Scholar Cloak (Scholar Lvl 2+)' },
                    { id: 'master_plate', label: 'Forge Master Plate (Builder Lvl 2+)' },
                  ].map((b) => {
                    // Check logic based on level limits in case unlocks are needed
                    const isUnlocked = state.avatar.unlockedItems.includes(b.id) || b.id === 'apprentice_robe' || (b.id === 'scholar_cloak' && state.identities['Scholar'].level >= 2) || (b.id === 'master_plate' && state.identities['Builder'].level >= 2);
                    const isEquipped = state.avatar.equipped.body === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => isUnlocked && handleEquip('body', b.id)}
                        disabled={!isUnlocked}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: isEquipped ? '2.5px solid var(--primary)' : '2px solid var(--border-color)',
                          background: isEquipped ? 'var(--primary-glow)' : 'var(--glass-tint)',
                          color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)',
                          fontSize: '0.8rem',
                          cursor: isUnlocked ? 'pointer' : 'not-allowed',
                          opacity: isUnlocked ? 1 : 0.4,
                        }}
                      >
                        {b.label} {!isUnlocked && '🔒'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accessories options */}
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Offhand Accessory:</strong>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'none', label: 'None' },
                    { id: 'wrench_shield', label: 'Wrench Shield' },
                    { id: 'victory_medal', label: 'Athlete Medal' },
                    { id: 'lotus_halo', label: 'Monk Halo' },
                    { id: 'compass_cape', label: 'Explorer Cape' },
                    { id: 'golden_scepter', label: 'Leader Scepter' },
                  ].map((a) => {
                    const isUnlocked = state.avatar.unlockedItems.includes(a.id);
                    const isEquipped = state.avatar.equipped.accessory === a.id;
                    return (
                      <button
                        key={a.id}
                        onClick={() => isUnlocked && handleEquip('accessory', a.id)}
                        disabled={!isUnlocked}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: isEquipped ? '2.5px solid var(--primary)' : '2px solid var(--border-color)',
                          background: isEquipped ? 'var(--primary-glow)' : 'var(--glass-tint)',
                          color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)',
                          fontSize: '0.8rem',
                          cursor: isUnlocked ? 'pointer' : 'not-allowed',
                          opacity: isUnlocked ? 1 : 0.4,
                        }}
                      >
                        {a.label} {!isUnlocked && '🔒'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title options */}
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Equippable Title:</strong>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'Novice Smith', label: 'Novice Smith' },
                    { id: 'Builder Master', label: 'Builder Master' },
                    { id: 'Scholar Sage', label: 'Scholar Sage' },
                    { id: 'Iron Guardian', label: 'Iron Guardian' },
                    { id: 'Monk Ascendant', label: 'Monk Ascendant' },
                    { id: 'Creator Legend', label: 'Creator Legend' },
                    { id: 'Path Finder', label: 'Path Finder' },
                    { id: 'Sovereign Forge', label: 'Sovereign Forge' },
                  ].map((t) => {
                    const isUnlocked = state.avatar.unlockedItems.includes(t.id);
                    const isEquipped = state.avatar.equipped.title === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => isUnlocked && handleEquip('title', t.id)}
                        disabled={!isUnlocked}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: isEquipped ? '2.5px solid var(--primary)' : '2px solid var(--border-color)',
                          background: isEquipped ? 'var(--primary-glow)' : 'var(--glass-tint)',
                          color: isUnlocked ? 'var(--text-main)' : 'var(--text-muted)',
                          fontSize: '0.8rem',
                          cursor: isUnlocked ? 'pointer' : 'not-allowed',
                          opacity: isUnlocked ? 1 : 0.4,
                        }}
                      >
                        {t.label} {!isUnlocked && '🔒'}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* IDENTITY DNA & WHEEL PANEL */}
      {activeTab === 'dna' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Identity Wheel card */}
          <div className="cozy-card">
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} /> Identity Votes Balance
            </h3>
            {renderIdentityWheel()}
          </div>

          {/* DNA Helix card */}
          <div className="cozy-card" style={{ overflowX: 'auto' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Dna size={18} /> Interactive DNA Helix
            </h3>
            {renderDNAHelix()}
          </div>

        </div>
      )}

    </div>
  );
};
