// VoiceInput - Premium mic button with Speech-to-Text
import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

// Extend window for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [pulsePhase, setPulsePhase] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const pulseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryCountRef = useRef(0);
  const transcriptRef = useRef('');

  const cleanup = useCallback(() => {
    setIsListening(false);
    if (pulseIntervalRef.current) {
      clearInterval(pulseIntervalRef.current);
      pulseIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
  }, []);

  const getSpeechRecognition = useCallback((): SpeechRecognitionInstance | null => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = 'en-US';
    return rec;
  }, []);

  const startListening = useCallback(async () => {
    if (disabled) return;

    // Check HTTPS (SpeechRecognition requires HTTPS or localhost)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      toast.error('Voice input requires HTTPS. Please use a secure connection.', { duration: 5000 });
      return;
    }

    // Request microphone permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
    } catch {
      toast.error('Microphone access denied. Please allow mic permission in your browser settings.', { duration: 6000 });
      return;
    }

    const rec = getSpeechRecognition();
    if (!rec) {
      toast.error('Voice input not supported. Use Chrome/Edge on desktop or Android.', { duration: 5000 });
      return;
    }

    recognitionRef.current = rec;
    retryCountRef.current = 0;
    transcriptRef.current = '';

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          transcriptRef.current += transcript;
        } else {
          interim += transcript;
        }
      }
      // Show interim feedback
      if (interim) {
        toast.info(`Hearing: "${interim}"`, { id: 'voice-interim', duration: 2000 });
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      const err = event.error;
      if (err === 'no-speech' || err === 'aborted') {
        cleanup();
        return;
      }

      if (err === 'network') {
        if (retryCountRef.current < 2) {
          retryCountRef.current += 1;
          toast.info(`Network issue. Retrying... (${retryCountRef.current}/2)`, { duration: 2000 });
          // Restart after a short delay
          setTimeout(() => {
            if (!recognitionRef.current) return;
            try {
              transcriptRef.current = '';
              recognitionRef.current.start();
            } catch {
              cleanup();
              toast.error('Voice input failed after retries. Please check your internet connection.', { duration: 5000 });
            }
          }, 800);
          return;
        }
        cleanup();
        toast.error('Voice input failed: Network error. Please check your internet and try again.', { duration: 6000 });
        return;
      }

      if (err === 'not-allowed' || err === 'service-not-allowed') {
        cleanup();
        toast.error('Microphone blocked by browser. Please allow mic access and refresh the page.', { duration: 6000 });
        return;
      }

      cleanup();
      toast.error(`Voice error: ${err}. Please try again.`, { duration: 4000 });
    };

    rec.onend = () => {
      // Only process if we were actually listening (not aborted by error handler)
      if (!isListening) return;
      cleanup();
      const text = transcriptRef.current.trim();
      if (text) {
        onTranscript(text);
        toast.success('Voice captured!', { duration: 2000 });
      } else {
        toast.info('No speech detected. Try speaking louder or closer to the mic.', { duration: 3000 });
      }
    };

    try {
      rec.start();
      setIsListening(true);
      setPulsePhase(0);
      pulseIntervalRef.current = setInterval(() => {
        setPulsePhase((p) => (p + 1) % 6);
      }, 400);
      toast.info('Listening... Speak now', { duration: 2000 });
    } catch {
      cleanup();
      toast.error('Could not start voice recording. Please refresh and try again.');
    }
  }, [disabled, getSpeechRecognition, onTranscript, cleanup, isListening]);

  const stopListening = useCallback(() => {
    cleanup();
  }, [cleanup]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const pulseColors = [
    'shadow-red-500/50 text-red-500',
    'shadow-orange-500/50 text-orange-500',
    'shadow-amber-500/50 text-amber-500',
    'shadow-green-500/50 text-green-500',
    'shadow-blue-500/50 text-blue-500',
    'shadow-purple-500/50 text-purple-500',
  ];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={isListening ? stopListening : startListening}
      className={cn(
        'relative flex items-center justify-center w-7 h-7 rounded-full shrink-0 transition-all duration-300',
        isListening
          ? `bg-destructive/10 ${pulseColors[pulsePhase]} shadow-lg animate-pulse`
          : 'hover:bg-primary/10 text-muted-foreground hover:text-primary',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      title={isListening ? 'Stop recording' : 'Voice input'}
    >
      {isListening ? (
        <>
          <span className="absolute inset-0 rounded-full animate-ping bg-destructive/20" />
          <MicOff className="w-3.5 h-3.5 relative z-10" />
        </>
      ) : (
        <Mic className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
