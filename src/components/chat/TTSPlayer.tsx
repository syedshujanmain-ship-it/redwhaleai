// TTSPlayer - Text-to-Speech for AI messages
import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TTSPlayerProps {
  text: string;
}

export function TTSPlayer({ text }: TTSPlayerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const getBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Prefer natural-sounding voices
    const preferred = [
      'Google US English',
      'Samantha',
      'Daniel',
      'Karen',
      'Google UK English Male',
      'Google UK English Female',
      'Microsoft David',
      'Microsoft Zira',
      'Microsoft Mark',
      'Alex',
    ];

    for (const name of preferred) {
      const v = voices.find((voice) => voice.name.includes(name));
      if (v) return v;
    }

    // Fallback: any English voice
    return voices.find((v) => v.lang.startsWith('en')) || voices[0] || null;
  }, []);

  const speak = useCallback(() => {
    if (!window.speechSynthesis) {
      toast.error('Text-to-speech not supported in this browser');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    const voice = getBestVoice();
    if (voice) utterance.voice = voice;

    utterance.rate = 1.05; // Slightly faster for natural feel
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [text, getBestVoice]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={isSpeaking ? stop : speak}
      className="h-6 px-2 text-[10px] rounded-full"
      title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
    >
      {isSpeaking ? (
        <><VolumeX className="w-3 h-3 mr-1 text-destructive" /> Stop</>
      ) : (
        <><Volume2 className="w-3 h-3 mr-1" /> Speak</>
      )}
    </Button>
  );
}
