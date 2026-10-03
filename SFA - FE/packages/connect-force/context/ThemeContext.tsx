"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import {
  ThemePalette,
  SYSTEM_THEMES,
  DEFAULT_CUSTOM_THEMES,
  generateCustomThemeFromColor,
} from '@/theme/themeConfig';
import {
  getThemeSettingsFromDB,
  saveThemeSelectionToDB,
  DBThemeRecord,
} from '@/service/theme.service';
import customShadows from '@/theme/customShadows';
import componentsOverride from '@/theme/overrides';
import typography from '@/theme/typography';
import shadows from '@/theme/shadows';

interface ThemeContextType {
  currentTheme: ThemePalette;
  currentThemeKey: string;
  allThemes: Record<string, ThemePalette>;
  systemThemes: Record<string, ThemePalette>;
  customThemes: Record<string, ThemePalette>;
  dbRecordsMap: Record<string, DBThemeRecord>;
  selectTheme: (key: string) => void;
  createCustomTheme: (color: string, name?: string) => void;
  isAppearanceOpen: boolean;
  openAppearanceDrawer: () => void;
  closeAppearanceDrawer: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CustomThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentThemeKey, setCurrentThemeKey] = useState<string>('blue');
  const [customThemesMap, setCustomThemesMap] = useState<Record<string, ThemePalette>>(DEFAULT_CUSTOM_THEMES);
  const [dbRecordsMap, setDbRecordsMap] = useState<Record<string, DBThemeRecord>>({});
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);

  // Load theme records & selected theme from DB / storage on mount
  useEffect(() => {
    const loadFromDB = async () => {
      const { selectedThemeKey, themesMap } = await getThemeSettingsFromDB();
      setDbRecordsMap(themesMap);
      setCurrentThemeKey(selectedThemeKey);

      // Extract custom generated themes from DB map
      const customOnly: Record<string, ThemePalette> = {};
      Object.values(themesMap).forEach((rec) => {
        if (rec.category === 'custom') {
          customOnly[rec.key] = rec;
        }
      });
      if (Object.keys(customOnly).length > 0) {
        setCustomThemesMap(customOnly);
      }
    };
    loadFromDB();
  }, []);

  const allThemes = useMemo(() => {
    return { ...SYSTEM_THEMES, ...customThemesMap };
  }, [customThemesMap]);

  const currentTheme = useMemo(() => {
    return allThemes[currentThemeKey] || SYSTEM_THEMES.blue;
  }, [allThemes, currentThemeKey]);

  // Apply CSS root variables whenever currentTheme changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--primary-main', currentTheme.primaryMain);
      root.style.setProperty('--primary-light', currentTheme.activePill);
      root.style.setProperty('--primary-lighter', currentTheme.headerTint);
      root.style.setProperty('--bg-default', currentTheme.outerBg);
      root.style.setProperty('--bg-paper', currentTheme.paperBg);
      root.style.setProperty('--text-primary', currentTheme.textPrimary);
      root.style.setProperty('--text-secondary', currentTheme.textSecondary);
      root.style.setProperty('--border-color', currentTheme.headerTint);
    }
  }, [currentTheme]);

  const selectTheme = async (key: string) => {
    if (allThemes[key]) {
      setCurrentThemeKey(key);
      const updatedDB = await saveThemeSelectionToDB(key, allThemes);
      setDbRecordsMap(updatedDB);
    }
  };

  const createCustomTheme = async (color: string, name?: string) => {
    const themeName = name || `Custom ${Object.keys(customThemesMap).length + 1}`;
    const newTheme = generateCustomThemeFromColor(color, themeName);
    const updatedCustom = { ...customThemesMap, [newTheme.key]: newTheme };
    setCustomThemesMap(updatedCustom);
    setCurrentThemeKey(newTheme.key);

    const mergedAll = { ...SYSTEM_THEMES, ...updatedCustom };
    const updatedDB = await saveThemeSelectionToDB(newTheme.key, mergedAll);
    setDbRecordsMap(updatedDB);
  };

  const openAppearanceDrawer = () => setIsAppearanceOpen(true);
  const closeAppearanceDrawer = () => setIsAppearanceOpen(false);

  // Dynamically build MUI Theme
  const muiTheme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        mode: 'light',
        primary: {
          lighter: currentTheme.headerTint,
          light: currentTheme.activePill,
          main: currentTheme.primaryMain,
          dark: currentTheme.primaryDark,
          darker: currentTheme.outerBg,
          contrastText: '#fff',
        },
        background: {
          default: currentTheme.outerBg,
          paper: currentTheme.paperBg,
          neutral: currentTheme.headerTint,
        },
        text: {
          primary: currentTheme.textPrimary,
          secondary: currentTheme.textSecondary,
        },
      },
      typography,
      shape: { borderRadius: 8 },
      shadows: shadows('light'),
      customShadows: customShadows('light'),
    });

    baseTheme.components = componentsOverride(baseTheme);
    return baseTheme;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        currentThemeKey,
        allThemes,
        systemThemes: SYSTEM_THEMES,
        customThemes: customThemesMap,
        dbRecordsMap,
        selectTheme,
        createCustomTheme,
        isAppearanceOpen,
        openAppearanceDrawer,
        closeAppearanceDrawer,
      }}
    >
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within CustomThemeProvider');
  }
  return ctx;
};
