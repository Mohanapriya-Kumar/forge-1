import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './context/AppState';
import { Onboarding } from './screens/Onboarding';
import { WorldMap } from './screens/WorldMap';
import { Quests } from './screens/Quests';
import { FourLawsLab } from './screens/FourLawsLab';
import { BlueprintDeck } from './screens/BlueprintDeck';
import { ConstellationGalaxy } from './screens/ConstellationGalaxy';
import { MuseumTimeline } from './screens/MuseumTimeline';
import { StoryBook } from './screens/StoryBook';
import { Settings } from './screens/Settings';
import { Today } from './screens/Today';
import { playClick } from './utils/sounds';
import {
  Compass,
  CheckSquare,
  Dna,
  FlaskConical,
  BookOpen,
  Trophy,
  Sliders,
  Sun,
  Moon,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  Calendar
} from 'lucide-react';

type Tab = 'today' | 'map' | 'quests' | 'dna' | 'lab' | 'deck' | 'galaxy' | 'museum' | 'stories' | 'settings';

const AppContent: React.FC = () => {
  const { state, toggleTheme, toggleSound } = useAppState();
  const [currentTab, setCurrentTab] = useState<Tab>('today');

  if (!state.isOnboarded) {
    return <Onboarding />;
  }

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'today':
        return <Today />;
      case 'map':
        return <WorldMap />;
      case 'quests':
        return <Quests />;
      case 'dna':
        return <IdentityDNA />;
      case 'lab':
        return <FourLawsLab />;
      case 'deck':
        return <BlueprintDeck />;
      case 'galaxy':
        return <ConstellationGalaxy />;
      case 'museum':
        return <MuseumTimeline />;
      case 'stories':
        return <StoryBook />;
      case 'settings':
        return <Settings />;
      default:
        return <WorldMap />;
    }
  };

  const handleTabChange = (tab: Tab) => {
    playClick();
    setCurrentTab(tab);
  };

  const navItems = [
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'map', label: 'World Map', icon: Compass },
    { id: 'quests', label: 'Quests', icon: CheckSquare },
    { id: 'dna', label: 'DNA & Avatar', icon: Dna },
    { id: 'lab', label: '4 Laws Lab', icon: FlaskConical },
    { id: 'deck', label: 'Blueprint Deck', icon: Layers },
    { id: 'galaxy', label: 'Galaxy', icon: Sparkles },
    { id: 'museum', label: 'Museum', icon: Trophy },
    { id: 'stories', label: 'Stories', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <div
      className={state.settings.theme === 'day' ? 'theme-day' : 'theme-night'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* HEADER SECTION */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '3px solid var(--border-color)',
          background: 'var(--bg-card)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.4rem',
              fontWeight: 'bold',
            }}
          >
            F
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', color: 'var(--text-main)', letterSpacing: '0.5px' }}>Forge 1%</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              "Every action is a vote."
            </p>
          </div>
        </div>

        {/* Global Controls & Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: '0.82rem',
              background: 'var(--primary-glow)',
              color: 'var(--primary)',
              borderRadius: '8px',
              padding: '4px 10px',
              fontWeight: 'bold',
            }}
          >
            Level {state.level} Identity Smith
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                padding: '6px',
              }}
              title="Toggle Theme"
            >
              {state.settings.theme === 'day' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                cursor: 'pointer',
                padding: '6px',
              }}
              title="Toggle Sound"
            >
              {state.settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* BODY SHELL SECTION */}
      <div style={{ flex: 1, display: 'flex', position: 'relative' }}>
        
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <nav
          className="desktop-only"
          style={{
            width: '240px',
            borderRight: '3px solid var(--border-color)',
            background: 'var(--bg-card)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 5,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as Tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: `2.5px solid ${active ? 'var(--primary)' : 'transparent'}`,
                  background: active ? 'var(--primary-glow)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-main)',
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* MAIN PANEL CONTENT */}
        <main
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            height: 'calc(100vh - 78px)',
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1 }}>
            {renderActiveScreen()}
          </div>
          <footer
            style={{
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '2px dashed var(--border-color)',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Developed by <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Mohanapriya Kumar</span>
          </footer>
        </main>
      </div>

      {/* BOTTOM NAVIGATION (Mobile/Tablet helper) */}
      <nav
        className="mobile-only"
        style={{
          borderTop: '3px solid var(--border-color)',
          background: 'var(--bg-card)',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id as Tab)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                background: 'transparent',
                border: 'none',
                color: active ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.7rem',
                flex: 1,
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: '0.65rem' }}>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>

      {/* RESPONSIVE CSS HELPERS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        @media (min-width: 769px) {
          .desktop-only { display: flex !important; }
          .mobile-only { display: none !important; }
        }
      `}</style>
    </div>
  );
};

// Main export wrapped with AppStateProvider
export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}

// Importing dynamic tab references inside wrapper
import { IdentityDNA } from './screens/IdentityDNA';
