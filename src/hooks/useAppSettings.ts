// useAppSettings - Global app settings (font, DPI, mood on/off, custom moods/modes)
import { useState, useEffect, useCallback } from 'react';

export interface CustomMood {
  id: string;
  name: string;
  icon: string; // lucide icon name
  prompt: string;
}

export interface CustomMode {
  id: string;
  name: string;
  instructions: string;
  icon: string; // lucide icon name
}

export type DpiScale = 'small' | 'medium-small' | 'medium' | 'medium-big' | 'big';

export interface AppSettings {
  fontFamily: string;
  dpiScale: DpiScale;
  moodEnabled: boolean;
  customMoods: CustomMood[];
  customModes: CustomMode[];
}

const DEFAULT_SETTINGS: AppSettings = {
  fontFamily: 'system-ui, -apple-system, sans-serif',
  dpiScale: 'medium-small',
  moodEnabled: true,
  customMoods: [],
  customModes: [],
};

const STORAGE_KEY = 'redwhale_app_settings';

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Apply font family to entire app — all text elements
  useEffect(() => {
    const style = document.getElementById('rw-font-override') as HTMLStyleElement | null;
    const css = `
      html, body, div, span, p, h1, h2, h3, h4, h5, h6, a, li, td, th, label, input, textarea, button, code, pre, blockquote, small, strong, em {
        font-family: ${settings.fontFamily} !important;
      }
    `;
    if (style) {
      style.textContent = css;
    } else {
      const newStyle = document.createElement('style');
      newStyle.id = 'rw-font-override';
      newStyle.textContent = css;
      document.head.appendChild(newStyle);
    }
  }, [settings.fontFamily]);

  // Apply DPI scale
  useEffect(() => {
    const html = document.documentElement;
    const scaleMap: Record<DpiScale, string> = {
      small: '13px',
      'medium-small': '13.5px',
      medium: '14px',
      'medium-big': '15px',
      big: '16px',
    };
    html.style.fontSize = scaleMap[settings.dpiScale];
  }, [settings.dpiScale]);

  const setFontFamily = useCallback((font: string) => {
    setSettings(prev => ({ ...prev, fontFamily: font }));
  }, []);

  const setDpiScale = useCallback((scale: DpiScale) => {
    setSettings(prev => ({ ...prev, dpiScale: scale }));
  }, []);

  const setMoodEnabled = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, moodEnabled: enabled }));
  }, []);

  const addCustomMood = useCallback((mood: Omit<CustomMood, 'id'>) => {
    const newMood: CustomMood = { ...mood, id: `custom_${Date.now()}` };
    setSettings(prev => ({ ...prev, customMoods: [...prev.customMoods, newMood] }));
    return newMood.id;
  }, []);

  const removeCustomMood = useCallback((id: string) => {
    setSettings(prev => ({ ...prev, customMoods: prev.customMoods.filter(m => m.id !== id) }));
  }, []);

  const addCustomMode = useCallback((mode: Omit<CustomMode, 'id'>) => {
    const newMode: CustomMode = { ...mode, id: `custommode_${Date.now()}` };
    setSettings(prev => ({ ...prev, customModes: [...prev.customModes, newMode] }));
    return newMode.id;
  }, []);

  const removeCustomMode = useCallback((id: string) => {
    setSettings(prev => ({ ...prev, customModes: prev.customModes.filter(m => m.id !== id) }));
  }, []);

  return {
    settings,
    setFontFamily,
    setDpiScale,
    setMoodEnabled,
    addCustomMood,
    removeCustomMood,
    addCustomMode,
    removeCustomMode,
  };
}
