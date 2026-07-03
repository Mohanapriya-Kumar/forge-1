import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { playClick } from '../utils/sounds';
import { Volume2, VolumeX, Moon, Sun, Download, Upload, Trash2, ShieldAlert } from 'lucide-react';

export const Settings: React.FC = () => {
  const { state, toggleTheme, toggleSound, toggleMotion, importBackupData, resetAllProgress } = useAppState();
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExport = () => {
    playClick();
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forge-1percent-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;
    playClick();

    const success = importBackupData(importJson);
    if (success) {
      setImportSuccess(true);
      setImportError(false);
      setImportJson('');
    } else {
      setImportError(true);
      setImportSuccess(false);
    }
  };

  const handleReset = () => {
    playClick();
    resetAllProgress();
    setConfirmReset(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)' }}>Settings & Controls</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manage your interface, sound modules, and local backup configurations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        {/* Toggles */}
        <div className="cozy-card">
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '16px' }}>Interface Preferences</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Theme Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>Global Themes:</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Day Theme (Cozy Cartoon pastel) or Night Theme (Celestial dark).
                </div>
              </div>
              <button className="cozy-btn cozy-btn-secondary" onClick={toggleTheme}>
                {state.settings.theme === 'day' ? <Sun size={18} /> : <Moon size={18} />}
                <span style={{ textTransform: 'capitalize' }}>{state.settings.theme} Theme</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-color)', paddingTop: '16px' }}>
              <div>
                <strong>Web Audio Synthesizer:</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Synthesizes chime tones for quest completions, level ups, and recoveries.
                </div>
              </div>
              <button className="cozy-btn cozy-btn-secondary" onClick={toggleSound}>
                {state.settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                <span>{state.settings.soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}</span>
              </button>
            </div>

            {/* Reduce Motion */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-color)', paddingTop: '16px' }}>
              <div>
                <strong>Reduce Motion:</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Disables background atmospheric rain drop cycles and drifting island animations.
                </div>
              </div>
              <button className="cozy-btn cozy-btn-secondary" onClick={toggleMotion}>
                <span>{state.settings.reduceMotion ? 'Animations Off' : 'Animations On'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Data Backup & Recover */}
        <div className="cozy-card">
          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '16px' }}>Import & Export Save Data</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Forge 1% operates fully offline. Your records live in localStorage. Export files below to back up progress or synchronize to another browser.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
            
            {/* Export */}
            <div style={{ border: '2px solid var(--border-color)', borderRadius: '12px', padding: '16px', background: 'var(--glass-tint)' }}>
              <strong>Save File Backup</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 16px' }}>
                Download a `.json` copy containing all current quest sheets, custom avatar equipment, and milestones.
              </div>
              <button className="cozy-btn cozy-btn-primary" onClick={handleExport} style={{ width: '100%' }}>
                <Download size={16} /> Download Backup
              </button>
            </div>

            {/* Import */}
            <div style={{ border: '2px solid var(--border-color)', borderRadius: '12px', padding: '16px', background: 'var(--glass-tint)' }}>
              <strong>Restore Backup Save</strong>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 12px' }}>
                Paste backup contents in the input field below:
              </div>
              <form onSubmit={handleImport}>
                <textarea
                  className="cozy-input"
                  placeholder="Paste JSON string here..."
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  style={{ minHeight: '60px', fontSize: '0.75rem', resize: 'vertical', marginBottom: '10px' }}
                />
                <button type="submit" className="cozy-btn cozy-btn-secondary" style={{ width: '100%' }}>
                  <Upload size={16} /> Load Backup
                </button>
              </form>
              
              {importSuccess && (
                <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '8px', fontWeight: 'bold' }}>
                  Successfully restored save data!
                </div>
              )}
              {importError && (
                <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '8px', fontWeight: 'bold' }}>
                  Restoration failed. Invalid backup JSON.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Hard Reset */}
        <div className="cozy-card" style={{ borderColor: '#ef4444' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#ef4444', marginBottom: '8px' }}>Danger Zone</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Wipes all records. This deletes all habits, achievements, timeline archives, and avatar gear unlocks forever.
          </p>

          {!confirmReset ? (
            <button className="cozy-btn" onClick={() => setConfirmReset(true)} style={{ background: '#ef4444', color: 'white', border: 'none' }}>
              <Trash2 size={16} /> Wreck Forge & Restart
            </button>
          ) : (
            <div style={{ border: '2px solid #ef4444', borderRadius: '12px', padding: '14px', background: 'rgba(239, 68, 68, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                <ShieldAlert size={18} /> Are you absolutely sure?
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '12px' }}>
                This action is irreversible. All consistency stars, DNA metrics, and story chapters will disappear.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="cozy-btn" onClick={handleReset} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', fontSize: '0.85rem' }}>
                  Yes, Wipe Everything
                </button>
                <button className="cozy-btn cozy-btn-secondary" onClick={() => setConfirmReset(false)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
