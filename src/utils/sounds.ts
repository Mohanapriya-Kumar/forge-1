// Web Audio API Synthesizer for Forge 1%
// Zero external files required, fully offline-friendly.

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let rainSource: AudioBufferSourceNode | null = null;
let soundEnabled = true;

function initAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = soundEnabled ? 0.35 : 0;
  masterGain.connect(audioCtx.destination);
}

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  if (!audioCtx) initAudio();
  if (masterGain && audioCtx) {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    masterGain.gain.value = enabled ? 0.35 : 0;
  }
};

export const playClick = () => {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || !masterGain) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {
    console.warn('Audio click error:', e);
  }
};

export const playConfetti = () => {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || !masterGain) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, index) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + index * 0.08 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(masterGain!);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.3);
    });
  } catch (e) {
    console.warn('Audio confetti error:', e);
  }
};

export const playLevelUp = () => {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || !masterGain) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    // Triumphant arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 to C6

    notes.forEach((freq, index) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();

      osc.type = index === notes.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.07);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + index * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.07 + 0.4);

      osc.connect(gain);
      gain.connect(masterGain!);

      osc.start(now + index * 0.07);
      osc.stop(now + index * 0.07 + 0.45);
    });
  } catch (e) {
    console.warn('Audio level up error:', e);
  }
};

export const playRecovery = () => {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx || !masterGain) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    // Encouraging dual note: fifth then octave higher
    const notes = [349.23, 523.25, 698.46]; // F4, C5, F5

    notes.forEach((freq, index) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.12);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + index * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(masterGain!);

      osc.start(now + index * 0.12);
      osc.stop(now + index * 0.12 + 0.4);
    });
  } catch (e) {
    console.warn('Audio recovery error:', e);
  }
};

// Start or stop background cozy rain loop synthesized using White/Pink noise buffer
export const setRainSound = (active: boolean) => {
  if (!soundEnabled || !active) {
    if (rainSource) {
      try {
        rainSource.stop();
      } catch (e) {}
      rainSource = null;
    }
    return;
  }

  try {
    initAudio();
    if (!audioCtx || !masterGain) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (rainSource) return; // already playing

    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    // Pink/Brownish noise filter for soft rain
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Amplify slightly
    }

    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to make it sound like muffled cozy rain
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioCtx.currentTime);

    const rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0.04, audioCtx.currentTime); // Very soft background level

    noiseSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(masterGain);

    noiseSource.start(0);
    rainSource = noiseSource;
  } catch (e) {
    console.warn('Audio rain synthesizer error:', e);
  }
};
