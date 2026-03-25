'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, PlayCircle, RotateCcw, CheckCircle } from 'lucide-react';

interface SpeakingExerciseProps {
  prompt: string;
  maxDuration?: number; // seconds
  onComplete?: (score: number) => void;
}

type RecordingState = 'idle' | 'recording' | 'recorded' | 'submitted';

export function SpeakingExercise({ prompt, maxDuration = 60, onComplete }: SpeakingExerciseProps) {
  const [state, setState]         = useState<RecordingState>('idle');
  const [elapsed, setElapsed]     = useState(0);
  const [audioUrl, setAudioUrl]   = useState<string | null>(null);
  const [score, setScore]         = useState(0);
  const [error, setError]         = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef        = useRef<Blob[]>([]);
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
        setState('recorded');
      };

      recorder.start();
      setState('recording');
      setElapsed(0);

      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      setError('Microphone access denied. Please allow microphone access and try again.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setElapsed(0);
    setState('idle');
    setScore(0);
  };

  const submit = () => {
    // Score based on recording duration: longer = better (up to maxDuration)
    const pct = Math.min(100, Math.round((elapsed / Math.max(maxDuration * 0.5, 1)) * 100));
    setScore(pct);
    setState('submitted');
    onComplete?.(pct);
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (state === 'submitted') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-800">Recording submitted!</p>
            <p className="text-xs text-emerald-600">Your mentor will review your speaking exercise.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-emerald-700">{score}%</div>
            <div className="text-xs text-emerald-600">Score</div>
          </div>
        </div>
        {audioUrl && (
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Your Recording</p>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Prompt */}
      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-1">Speaking Prompt</p>
        <p className="text-sm text-gray-700">{prompt}</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-xl">{error}</p>
      )}

      {/* Recorder UI */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-4">

        {/* Waveform / status indicator */}
        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
          state === 'recording'
            ? 'bg-red-100 ring-4 ring-red-200 animate-pulse'
            : state === 'recorded'
            ? 'bg-emerald-100'
            : 'bg-gray-100'
        }`}>
          {state === 'recording'
            ? <MicOff className="w-8 h-8 text-red-600" />
            : state === 'recorded'
            ? <CheckCircle className="w-8 h-8 text-emerald-600" />
            : <Mic className="w-8 h-8 text-gray-400" />
          }
        </div>

        {/* Timer */}
        <div className="text-center">
          <p className="text-2xl font-mono font-bold text-gray-900">{fmt(elapsed)}</p>
          <p className="text-xs text-gray-400">/ {fmt(maxDuration)} max</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${state === 'recording' ? 'bg-red-500' : 'bg-emerald-500'}`}
            style={{ width: `${(elapsed / maxDuration) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {state === 'idle' && (
            <button onClick={startRecording}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
              <Mic className="w-4 h-4" /> Start Recording
            </button>
          )}
          {state === 'recording' && (
            <button onClick={stopRecording}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">
              <Square className="w-4 h-4" /> Stop
            </button>
          )}
          {state === 'recorded' && (
            <>
              <button onClick={reset}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors">
                <RotateCcw className="w-4 h-4" /> Re-record
              </button>
              <button onClick={submit}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-colors">
                <CheckCircle className="w-4 h-4" /> Submit
              </button>
            </>
          )}
        </div>

        {state === 'recorded' && audioUrl && (
          <div className="w-full">
            <p className="text-xs text-gray-400 mb-1 text-center">Preview your recording</p>
            <audio controls src={audioUrl} className="w-full" />
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Tips</p>
        <ul className="space-y-1">
          {[
            'Speak clearly and at a natural pace',
            'Use complete sentences',
            'Aim to speak for at least 30 seconds',
          ].map((tip) => (
            <li key={tip} className="flex items-center gap-2 text-xs text-gray-600">
              <PlayCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
