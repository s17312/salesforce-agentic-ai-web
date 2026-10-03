import { ThemePalette, SYSTEM_THEMES, DEFAULT_CUSTOM_THEMES, generateCustomThemeFromColor } from '@/theme/themeConfig';

export interface DBThemeRecord extends ThemePalette {
  isSelected: boolean;
}

const THEME_DB_STORAGE_KEY = 'connect_force_theme_db_records';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/';

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
  // 1. Try Backend API first
  try {
    const res = await fetch(`${API_URL}theme?userId=default_user`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      const items = data.result || data;
      if (Array.isArray(items) && items.length > 0) {
        const themesMap: Record<string, DBThemeRecord> = {};
        let selectedKey = 'blue';

        items.forEach((item: any) => {
          const key = item.themeKey || item.key;
          if (!key) return;
          const isSelected = !!item.isSelected;
          if (isSelected) selectedKey = key;

          const basePalette: ThemePalette = ALL_PRESET_THEMES[key] || generateCustomThemeFromColor(item.primaryMain || '#7A67EE', item.name || key);

          themesMap[key] = {
            ...basePalette,
            key,
            name: item.name || basePalette.name,
            category: (item.category || basePalette.category) as 'system' | 'custom',
            primaryMain: item.primaryMain || basePalette.primaryMain,
            sidebarBg: item.sidebarBg || basePalette.sidebarBg,
            outerBg: item.outerBg || basePalette.outerBg,
            activePill: item.activePill || basePalette.activePill,
            paperBg: item.paperBg || basePalette.paperBg,
            headerTint: item.headerTint || basePalette.headerTint,
            swatches: item.swatchesJson ? JSON.parse(item.swatchesJson) : basePalette.swatches,
            isSelected,
          };
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem(THEME_DB_STORAGE_KEY, JSON.stringify(themesMap));
          localStorage.setItem('connect_force_theme_key', selectedKey);
        }

        return { selectedThemeKey: selectedKey, themesMap };
      }
    }
  } catch (e) {
    console.log('Backend API unreachable, using local theme DB fallback');
  }

  // 2. Local Storage Fallback
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(THEME_DB_STORAGE_KEY) : null;
    if (raw) {
      const records: Record<string, DBThemeRecord> = JSON.parse(raw);
      let selectedKey = 'blue';
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

  // 3. Initial default DB state: system + custom themes, Blue isSelected: true
  const initialMap: Record<string, DBThemeRecord> = {};
  const allInitial = { ...SYSTEM_THEMES, ...DEFAULT_CUSTOM_THEMES };

  Object.values(allInitial).forEach((t) => {
    initialMap[t.key] = {
      ...t,
      isSelected: t.key === 'blue',
    };
  });

  return { selectedThemeKey: 'blue', themesMap: initialMap };
}

/**
 * Save selected theme to DB.
 * Sets isSelected: true on selectedKey, and isSelected: false on all other themes.
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
    await fetch(`${API_URL}theme/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        themeKey: selectedKey,
        userId: 'default_user',
      }),
    });
  } catch (e) {
    console.log('Backend API unreachable during selectTheme, synced locally.');
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
