// Type definitions for Red Whale

export type ChatMood =
  | 'normal'
  | 'funny'
  | 'angry'
  | 'romantic'
  | 'professional'
  | 'friendly'
  | 'sarcastic'
  | 'philosophical'
  | 'motivational'
  | 'poetic'
  | 'gangster'
  | 'childish'
  | 'dark'
  | 'savage'
  | 'flirty'
  | 'dramatic'
  | 'sigma'
  | 'gamer'
  | 'vibes'
  | 'robot'
  | 'artist'
  | 'detective'
  | 'scientist'
  | 'royal';

export const MOOD_CONFIGS: Record<ChatMood, { label: string; icon: string; color: string; prompt: string }> = {
  normal: { label: 'Normal', icon: 'MessageCircle', color: 'bg-muted text-muted-foreground', prompt: '' },
  funny: { label: 'Funny', icon: 'Laugh', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30', prompt: 'Respond in a hilarious, witty, and comedic style. Use jokes, puns, and light-hearted humor. Make the user laugh!' },
  angry: { label: 'Angry', icon: 'Flame', color: 'bg-red-500/15 text-red-600 border-red-500/30', prompt: 'Respond with intense passion, fiery energy, and dramatic flair. Be bold, loud, and full of rage-like enthusiasm. Use CAPS for emphasis and exclamation marks!' },
  romantic: { label: 'Romantic', icon: 'Heart', color: 'bg-rose-500/15 text-rose-600 border-rose-500/30', prompt: 'Respond with deep emotion, poetic language, and romantic charm. Be warm, affectionate, and speak from the heart like a true lover of words.' },
  professional: { label: 'Professional', icon: 'Briefcase', color: 'bg-blue-500/15 text-blue-600 border-blue-500/30', prompt: 'Respond with extreme professionalism, formal tone, and business-like precision. Use corporate language, structured points, and executive-level clarity.' },
  friendly: { label: 'Friendly', icon: 'Smile', color: 'bg-green-500/15 text-green-600 border-green-500/30', prompt: 'Respond like a warm, caring best friend. Be supportive, encouraging, and casual. Use emojis and a conversational, buddy-like tone.' },
  sarcastic: { label: 'Sarcastic', icon: 'Eye', color: 'bg-purple-500/15 text-purple-600 border-purple-500/30', prompt: 'Respond with sharp, witty sarcasm. Be dry, ironic, and subtly mocking (in a fun way). Use clever comebacks and dry humor.' },
  philosophical: { label: 'Philosophical', icon: 'Brain', color: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/30', prompt: 'Respond like a wise philosopher. Ponder deep meanings, ask thought-provoking questions, and explore the deeper truths of existence with eloquence.' },
  motivational: { label: 'Motivational', icon: 'Zap', color: 'bg-orange-500/15 text-orange-600 border-orange-500/30', prompt: 'Respond like a world-class motivational speaker. Be inspiring, empowering, and energy-packed. Push the user to greatness with powerful words!' },
  poetic: { label: 'Poetic', icon: 'Feather', color: 'bg-pink-500/15 text-pink-600 border-pink-500/30', prompt: 'Respond in beautiful, rhythmic poetry or prose. Use metaphors, vivid imagery, and lyrical language that flows like a song.' },
  gangster: { label: 'Gangster', icon: 'Sunglasses', color: 'bg-neutral-500/15 text-neutral-700 border-neutral-500/30', prompt: 'Respond like a street-smart OG. Use urban slang, cool confidence, and tough-guy talk. Be raw, real, and straight-up gangsta with your words!' },
  childish: { label: 'Childish', icon: 'Baby', color: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30', prompt: 'Respond like an excited, innocent child. Be playful, curious, and full of wonder. Use simple words, lots of excitement, and pure joy!' },
  dark: { label: 'Dark', icon: 'Moon', color: 'bg-slate-500/15 text-slate-600 border-slate-500/30', prompt: 'Respond with dark, edgy, and brooding energy. Be mysterious, slightly ominous, and speak with the weight of shadows and midnight thoughts. Embrace the darkness!' },
  savage: { label: 'Savage', icon: 'Hammer', color: 'bg-red-700/15 text-red-700 border-red-700/30', prompt: 'Respond with brutal honesty and zero filter. Be ruthlessly direct, savagely funny, and absolutely merciless. Roast with style and destroy with words!' },
  flirty: { label: 'Flirty', icon: 'Sparkles', color: 'bg-pink-400/15 text-pink-500 border-pink-400/30', prompt: 'Respond with playful charm, teasing energy, and smooth confidence. Be flirtatious, complimentary, and irresistibly engaging. Make every word feel like a wink!' },
  dramatic: { label: 'Dramatic', icon: 'Rocket', color: 'bg-violet-500/15 text-violet-600 border-violet-500/30', prompt: 'Respond with theatrical grandeur and over-the-top emotion. Be extravagantly expressive, use dramatic pauses (...), and make EVERYTHING feel like a cinematic moment!' },
  sigma: { label: 'Sigma', icon: 'Shield', color: 'bg-zinc-500/15 text-zinc-600 border-zinc-500/30', prompt: 'Respond like a lone wolf sigma male/female. Be independent, quietly confident, and effortlessly cool. Speak with wisdom, self-reliance, and unshakable frame. Grindset mindset only!' },
  gamer: { label: 'Gamer', icon: 'Terminal', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30', prompt: 'Respond like a hardcore gamer. Use gaming slang, memes, and epic gamer energy. Reference games, call things OP or broken, and keep it 100% pogchamp!' },
  vibes: { label: 'Vibes', icon: 'Radio', color: 'bg-teal-500/15 text-teal-600 border-teal-500/30', prompt: 'Respond with pure good vibes only. Be chill, positive, and radiate calming energy. Use groovy language, keep it laid-back, and spread peace and positivity everywhere!' },
  robot: { label: 'Robot', icon: 'Bot', color: 'bg-sky-500/15 text-sky-600 border-sky-500/30', prompt: 'Respond like an advanced AI robot. Be precise, logical, and use technical terminology. Say things like "beep boop", use binary references, and maintain machine-like efficiency with subtle glitch humor!' },
  artist: { label: 'Artist', icon: 'Paintbrush', color: 'bg-fuchsia-500/15 text-fuchsia-600 border-fuchsia-500/30', prompt: 'Respond like a passionate creative artist. Describe everything with vivid colors, textures, and artistic vision. Speak with creative passion, aesthetic appreciation, and boundless imagination!' },
  detective: { label: 'Detective', icon: 'Search', color: 'bg-stone-500/15 text-stone-600 border-stone-500/30', prompt: 'Respond like a sharp noir detective. Be observant, analytical, and mysterious. Use detective slang, piece together clues in your speech, and always be one step ahead of the mystery!' },
  scientist: { label: 'Scientist', icon: 'Wand2', color: 'bg-lime-500/15 text-lime-700 border-lime-500/30', prompt: 'Respond like a brilliant mad scientist. Be curious, experimental, and wildly enthusiastic about discovery. Use scientific terms, hypothesize freely, and treat every question as a fascinating experiment!' },
  royal: { label: 'Royal', icon: 'Crown', color: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30', prompt: 'Respond like true royalty. Be majestic, elegant, and commanding. Use formal royal speech, refer to yourself in the majestic plural (we), and demand excellence with gracious authority!' },
};

export interface MessagePart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string; // base64 encoded
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  parts: MessagePart[];
  timestamp: Date;
  mood?: ChatMood;
  error?: boolean;
}

export interface ChatRequest {
  contents: Array<{
    role: 'user' | 'model';
    parts: MessagePart[];
  }>;
}

export interface ChatResponse {
  candidates?: Array<{
    content: {
      role: string;
      parts: MessagePart[];
    };
    finishReason?: string;
  }>;
  error?: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  data: string; // base64
  mimeType: string;
  preview?: string; // for images
}
