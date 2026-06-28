import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ColorScheme, highContrastScheme, lightScheme } from './colors';
import { radius, spacing, touchTarget } from './spacing';
import { fontWeights, lineHeights, scaledFontSizes } from './typography';

const STORAGE_KEY = 'sgo.accessibility.v1';

/** Multipliers backing the "Larger Text" setting. */
export const TEXT_SCALES = {
  default: 1,
  large: 1.3,
} as const;

export type TextScaleKey = keyof typeof TEXT_SCALES;

export type AccessibilitySettings = {
  textScale: TextScaleKey;
  highContrast: boolean;
  /** "Voice Commands" opt-in; consumed by VoiceProvider to show the mic control. */
  voiceCommands: boolean;
};

const defaultSettings: AccessibilitySettings = {
  textScale: 'default',
  highContrast: false,
  voiceCommands: false,
};

export type Theme = {
  colors: ColorScheme;
  fontSizes: ReturnType<typeof scaledFontSizes>;
  /** Active "Larger Text" multiplier, for scaling sizes outside the type scale (e.g. nav headers, tab labels). */
  textScale: number;
  lineHeights: typeof lineHeights;
  fontWeights: typeof fontWeights;
  spacing: typeof spacing;
  radius: typeof radius;
  touchTarget: typeof touchTarget;
};

type ThemeContextValue = {
  theme: Theme;
  settings: AccessibilitySettings;
  ready: boolean;
  setTextScale: (scale: TextScaleKey) => void;
  setHighContrast: (on: boolean) => void;
  setVoiceCommands: (on: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [ready, setReady] = useState(false);

  // Load persisted accessibility preferences once on mount.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (active && raw) {
          const merged = { ...defaultSettings, ...JSON.parse(raw) };
          // Drop any stale textScale (e.g. a removed "larger" option).
          if (!(merged.textScale in TEXT_SCALES)) {
            merged.textScale = defaultSettings.textScale;
          }
          setSettings(merged);
        }
      } catch {
        // Fall back to defaults on any read/parse error.
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback((next: AccessibilitySettings) => {
    setSettings(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const setTextScale = useCallback(
    (textScale: TextScaleKey) => persist({ ...settings, textScale }),
    [persist, settings],
  );
  const setHighContrast = useCallback(
    (highContrast: boolean) => persist({ ...settings, highContrast }),
    [persist, settings],
  );
  const setVoiceCommands = useCallback(
    (voiceCommands: boolean) => persist({ ...settings, voiceCommands }),
    [persist, settings],
  );

  const theme = useMemo<Theme>(
    () => ({
      colors: settings.highContrast ? highContrastScheme : lightScheme,
      fontSizes: scaledFontSizes(TEXT_SCALES[settings.textScale]),
      textScale: TEXT_SCALES[settings.textScale],
      lineHeights,
      fontWeights,
      spacing,
      radius,
      touchTarget,
    }),
    [settings.highContrast, settings.textScale],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, settings, ready, setTextScale, setHighContrast, setVoiceCommands }),
    [theme, settings, ready, setTextScale, setHighContrast, setVoiceCommands],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useThemeContext().theme;
}

export function useAccessibility() {
  const { settings, setTextScale, setHighContrast, setVoiceCommands } = useThemeContext();
  return { settings, setTextScale, setHighContrast, setVoiceCommands };
}

function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme/useAccessibility must be used within a ThemeProvider');
  }
  return ctx;
}
