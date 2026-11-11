// Web Audio API Synthesized Music & Sound Effects + Speech Synthesis (TTS)

class AudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmInterval: number | null = null;
  private bgmStep: number = 0;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private volume: number = 0.6;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Background Music (BGM): Playful Nursery Marimba / Music Box ---
  public startBgm() {
    this.initContext();
    if (this.isBgmPlaying || !this.ctx) return;
    this.isBgmPlaying = true;

    // Upbeat, cute pentatonic nursery melody in C major / G major: C4, D4, E4, G4, A4, C5
    // Note frequencies in Hz
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.00;
    const A4 = 440.00;
    const B4 = 493.88;
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const G5 = 783.99;

    const melody: { note: number; dur: number; bass?: number }[] = [
      { note: C5, dur: 0.3, bass: C4 },
      { note: G4, dur: 0.3 },
      { note: A4, dur: 0.3, bass: F4 },
      { note: C5, dur: 0.5 },
      { note: D5, dur: 0.3, bass: G4 },
      { note: E5, dur: 0.5 },
      { note: D5, dur: 0.4 },
      { note: C5, dur: 0.6, bass: C4 },

      { note: E5, dur: 0.3, bass: E4 },
      { note: G5, dur: 0.3 },
      { note: E5, dur: 0.3, bass: A4 },
      { note: D5, dur: 0.4 },
      { note: C5, dur: 0.3, bass: F4 },
      { note: A4, dur: 0.4 },
      { note: G4, dur: 0.6, bass: G4 },

      { note: C5, dur: 0.3, bass: C4 },
      { note: D5, dur: 0.3 },
      { note: E5, dur: 0.4, bass: E4 },
      { note: G5, dur: 0.4, bass: G4 },
      { note: A4, dur: 0.3, bass: F4 },
      { note: C5, dur: 0.5 },
      { note: D5, dur: 0.4, bass: G4 },
      { note: C5, dur: 0.8, bass: C4 },
    ];

    let currentIdx = 0;

    const playNext = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const item = melody[currentIdx];
      const now = this.ctx.currentTime;

      // Melody note: Soft warm bell / marimba
      this.playMarimbaTone(item.note, item.dur, now, 0.22);

      // Light harmonic bass / accompaniment chord note
      if (item.bass) {
        this.playSoftBass(item.bass, item.dur * 1.5, now, 0.16);
      }

      currentIdx = (currentIdx + 1) % melody.length;
      const nextTime = item.dur * 1000 * 1.1; // tempo pacing
      this.bgmInterval = window.setTimeout(playNext, nextTime);
    };

    playNext();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleBgm(): boolean {
    if (this.isBgmPlaying) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }

  public isMusicPlaying(): boolean {
    return this.isBgmPlaying;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  private playMarimbaTone(freq: number, duration: number, startTime: number, volume: number) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Cute warm marimba envelope: sharp percussive attack and smooth decay
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);

      // Subtle harmonic overtone for woody sweetness
      const overtone = this.ctx.createOscillator();
      const overGain = this.ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, startTime);
      overGain.gain.setValueAtTime(volume * 0.25, startTime);
      overGain.gain.exponentialRampToValueAtTime(0.0001, startTime + (duration * 0.4));
      overtone.connect(overGain);
      overGain.connect(this.bgmGain);
      overtone.start(startTime);
      overtone.stop(startTime + duration * 0.4);
    } catch {
      // Audio node cleanup safeguard
    }
  }

  private playSoftBass(freq: number, duration: number, startTime: number, volume: number) {
    if (!this.ctx || !this.bgmGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq / 2, startTime);
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    } catch {
      // ignore
    }
  }

  // --- Sound Effects (SFX) ---
  public playPop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  public playPlateDrop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.06);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playCorrect() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Happy 3-note ascending arpeggio: G4 -> C5 -> E5 -> G5
    const notes = [392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + i * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }

  public playWrong() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Gentle cartoon spring/boing (soft, friendly, non-punishing)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  public playFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Celebratory victory chords
    const chord1 = [523.25, 659.25, 783.99]; // C major
    const chord2 = [587.33, 739.99, 880.00]; // D major
    const chord3 = [659.25, 783.99, 1046.50]; // High C major

    const playChord = (notes: number[], time: number, dur: number) => {
      notes.forEach((freq) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(time);
        osc.stop(time + dur);
      });
    };

    playChord(chord1, now, 0.2);
    playChord(chord2, now + 0.22, 0.25);
    playChord(chord3, now + 0.48, 0.7);
  }

  public playStarReward() {
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    // Magical twinkle
    [880, 1046.5, 1318.51, 1567.98].forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const t = now + idx * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  // --- Speech Synthesis (TTS for English Animal Vocabulary) ---
  public speak(text: string, rate: number = 0.85): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // cancel any active utterance

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate; // slightly slower for primary school kids
      utterance.pitch = 1.1; // friendly, cheerful kid tone
      utterance.lang = 'en-US';

      // Pick high quality English voice if available
      const voices = window.speechSynthesis.getVoices();
      const bestVoice = voices.find(
        (v) => (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Google US')) && v.lang.startsWith('en')
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  public cancelSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioSystem = new AudioSystem();
