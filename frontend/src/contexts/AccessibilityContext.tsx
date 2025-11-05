'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export enum AccessibilityFont {
  OPENDYSLEXIC = 'OPENDYSLEXIC',
  COMIC_SANS = 'COMIC_SANS',
  ARIAL = 'ARIAL',
  DEFAULT = 'DEFAULT',
}

export interface AccessibilitySettings {
  font: AccessibilityFont;
  fontSize: number; // 50-200
  lineSpacing: number; // 100-250
  backgroundColor: string;
  highContrast: boolean;
  textToSpeechEnabled: boolean;
  speechRate: number; // 0.5-2.0
  magnifierEnabled: boolean;
  magnification: number; // 1.0-3.0
  focusModeEnabled: boolean;
  readingRulerEnabled: boolean;
  reduceAnimations: boolean;
  preferredVoice?: string;
}

const defaultSettings: AccessibilitySettings = {
  font: AccessibilityFont.DEFAULT,
  fontSize: 100,
  lineSpacing: 100,
  backgroundColor: '#ffffff',
  highContrast: false,
  textToSpeechEnabled: false,
  speechRate: 1.0,
  magnifierEnabled: false,
  magnification: 1.0,
  focusModeEnabled: false,
  readingRulerEnabled: false,
  reduceAnimations: false,
};

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem('accessibilitySettings');
        if (stored) {
          const parsedSettings = JSON.parse(stored);
          setSettings({ ...defaultSettings, ...parsedSettings });
        }
      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;

    // Font
    let fontFamily = 'Inter, system-ui, sans-serif';
    if (settings.font === AccessibilityFont.OPENDYSLEXIC) {
      fontFamily = 'OpenDyslexic, sans-serif';
    } else if (settings.font === AccessibilityFont.COMIC_SANS) {
      fontFamily = '"Comic Sans MS", "Comic Sans", cursive';
    } else if (settings.font === AccessibilityFont.ARIAL) {
      fontFamily = 'Arial, sans-serif';
    }
    root.style.setProperty('--accessibility-font-family', fontFamily);

    // Font size
    root.style.setProperty('--accessibility-font-size', `${settings.fontSize}%`);

    // Line spacing
    root.style.setProperty('--accessibility-line-height', `${settings.lineSpacing}%`);

    // Background color
    root.style.setProperty('--accessibility-bg-color', settings.backgroundColor);

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduce animations
    if (settings.reduceAnimations) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Focus mode
    if (settings.focusModeEnabled) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }

    // Magnifier
    if (settings.magnifierEnabled) {
      root.style.setProperty('--accessibility-zoom', `${settings.magnification}`);
      root.classList.add('magnifier-enabled');
    } else {
      root.classList.remove('magnifier-enabled');
    }

    // Reading ruler
    if (settings.readingRulerEnabled) {
      root.classList.add('reading-ruler-enabled');
    } else {
      root.classList.remove('reading-ruler-enabled');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('accessibilitySettings', JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('accessibilitySettings');
  };

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSettings, resetSettings, isLoading }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
