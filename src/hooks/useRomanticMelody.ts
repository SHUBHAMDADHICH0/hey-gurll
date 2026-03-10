import { useRef, useState, useCallback } from "react";

// Soft romantic melody — slower, dreamy, piano-like
const MELODY_NOTES = [
  { freq: 440.00, dur: 0.8 },  // A4
  { freq: 523.25, dur: 0.6 },  // C5
  { freq: 493.88, dur: 0.4 },  // B4
  { freq: 440.00, dur: 0.8 },  // A4
  { freq: 392.00, dur: 0.6 },  // G4
  { freq: 440.00, dur: 1.0 },  // A4
  { freq: 523.25, dur: 0.8 },  // C5
  { freq: 587.33, dur: 0.6 },  // D5
  { freq: 523.25, dur: 0.8 },  // C5
  { freq: 493.88, dur: 0.4 },  // B4
  { freq: 440.00, dur: 1.0 },  // A4
  { freq: 349.23, dur: 0.6 },  // F4
  { freq: 392.00, dur: 0.8 },  // G4
  { freq: 440.00, dur: 1.2 },  // A4
  { freq: 523.25, dur: 0.6 },  // C5
  { freq: 493.88, dur: 0.8 },  // B4
  { freq: 440.00, dur: 0.6 },  // A4
  { freq: 392.00, dur: 1.0 },  // G4
  { freq: 349.23, dur: 0.8 },  // F4
  { freq: 329.63, dur: 1.2 },  // E4
];

// Soft pad chord backing
const CHORDS = [
  [261.63, 329.63, 392.00], // C major
  [220.00, 261.63, 329.63], // Am
  [349.23, 440.00, 523.25], // F major
  [392.00, 493.88, 587.33], // G major
];

export function useRomanticMelody() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef(false);

  const playMelody = useCallback(() => {
    if (playing) return;
    stopRef.current = false;

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    setPlaying(true);

    // Create a subtle reverb using delay
    const createReverb = () => {
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.15;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.2;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2000;
      delay.connect(feedback);
      feedback.connect(filter);
      filter.connect(delay);
      filter.connect(ctx.destination);
      return delay;
    };

    const reverb = createReverb();

    const playNote = (freq: number, time: number, dur: number, vol: number, type: OscillatorType = "sine") => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      // Soft attack and release
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.08);
      gain.gain.setValueAtTime(vol * 0.8, time + dur * 0.5);
      gain.gain.linearRampToValueAtTime(0, time + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(reverb);
      osc.start(time);
      osc.stop(time + dur + 0.1);
    };

    const playLoop = () => {
      let time = ctx.currentTime + 0.1;
      const totalDur = MELODY_NOTES.reduce((s, n) => s + n.dur, 0);

      // Background pad chords (very soft)
      const chordDur = totalDur / CHORDS.length;
      CHORDS.forEach((chord, i) => {
        chord.forEach((freq) => {
          playNote(freq, time + i * chordDur, chordDur * 0.95, 0.025, "triangle");
        });
      });

      // Melody notes
      MELODY_NOTES.forEach((note) => {
        if (stopRef.current) return;
        playNote(note.freq, time, note.dur, 0.1);
        // Soft octave shimmer
        playNote(note.freq * 2, time, note.dur * 0.5, 0.015);
        time += note.dur;
      });

      if (!stopRef.current) {
        setTimeout(() => {
          if (!stopRef.current) playLoop();
        }, totalDur * 1000 + 500);
      }
    };

    playLoop();
  }, [playing]);

  const stopMelody = useCallback(() => {
    stopRef.current = true;
    setPlaying(false);
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }, []);

  return { playing, playMelody, stopMelody };
}
