import { ThemePalette, SYSTEM_THEMES, DEFAULT_CUSTOM_THEMES, generateCustomThemeFromColor } from '@/theme/themeConfig';

export interface DBThemeRecord extends ThemePalette {
  isSelected: boolean;
}

const THEME_DB_STORAGE_KEY = 'connect_force_theme_db_records';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api/';

const ALL_PRESET_THEMES: Record<string, ThemePalette> = {
  ...SYSTEM_THEMES,
  ...DEFAULT_CUSTOM_THEMES,
};

/**
 * Fetch all themes from DB / API with isSelected column.
 * Ensures exactly one theme has isSelected: true.
 */
export async function getThemeSettingsFromDB(): Promise<{
  selectedThemeKey: string;
  themesMap: Record<string, DBThemeRecord>;
}> {
  // 1. Try Local Storage first for instantaneous rendering
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(THEME_DB_STORAGE_KEY) : null;
    if (raw) {
      const records: Record<string, DBThemeRecord> = JSON.parse(raw);
      let selectedKey = 'velora-purple';
      Object.values(records).forEach((r) => {
        if (r.isSelected) {
          selectedKey = r.key;
        }
      });
      return { selectedThemeKey: selectedKey, themesMap: records };
    }
  } catch (e) {
    console.error('Error loading theme records from local DB:', e);
  }

  // 2. Initial default state: velora-purple selected
  const initialMap: Record<string, DBThemeRecord> = {};
  const allInitial = { ...SYSTEM_THEMES, ...DEFAULT_CUSTOM_THEMES };

  Object.values(allInitial).forEach((t) => {
    initialMap[t.key] = {
      ...t,
      isSelected: t.key === 'velora-purple' || t.key === 'purple',
    };
  });

  return { selectedThemeKey: 'velora-purple', themesMap: initialMap };
}

/**
 * Save selected theme to DB via POST user/theme endpoint.
 */
export async function saveThemeSelectionToDB(
  selectedKey: string,
  allThemes: Record<string, ThemePalette>
): Promise<Record<string, DBThemeRecord>> {
  const updatedMap: Record<string, DBThemeRecord> = {};

  Object.values(allThemes).forEach((t) => {
    updatedMap[t.key] = {
      ...t,
      isSelected: t.key === selectedKey, // Exactly ONE theme is true!
    };
  });

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_DB_STORAGE_KEY, JSON.stringify(updatedMap));
      localStorage.setItem('connect_force_theme_key', selectedKey);
    }
  } catch (e) {
    console.error('Error saving theme records locally:', e);
  }

  try {
    await fetch(`${API_URL}user/theme`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 1,
        themeColor: selectedKey,
      }),
    });
  } catch (e) {
    console.log('Backend API unreachable during updateTheme, synced locally.');
  }

  return updatedMap;
}

/**
 * Save newly created custom theme to DB.
 */
export async function saveCustomThemeToDB(
  newTheme: ThemePalette,
  isSelected: boolean = false
): Promise<void> {
  try {
    await fetch(`${API_URL}theme/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'default_user',
        themeKey: newTheme.key,
        name: newTheme.name,
        category: 'custom',
        primaryMain: newTheme.primaryMain,
        sidebarBg: newTheme.sidebarBg,
        outerBg: newTheme.outerBg,
        activePill: newTheme.activePill,
        paperBg: newTheme.paperBg,
        headerTint: newTheme.headerTint,
        swatchesJson: JSON.stringify(newTheme.swatches),
        isSelected: isSelected,
      }),
    });
  } catch (e) {
    console.log('Backend API unreachable during custom theme save, saved locally.');
  }
}
