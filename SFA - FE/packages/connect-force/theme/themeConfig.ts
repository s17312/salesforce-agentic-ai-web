/**
 * SFA Theme Configuration
 * Modern, vibrant palettes inspired by Color Hunt (https://colorhunt.co/)
 * Structured as 4-color harmony systems: [Light Tint, Active Accent, Brand Primary, Dark Base]
 */

export interface ThemePalette {
  key: string;
  name: string;
  category: 'system' | 'custom';
  primaryMain: string;
  primaryDark: string;
  outerBg: string;
  sidebarBg: string;
  activePill: string;
  unselectedPill: string;
  paperBg: string;
  headerTint: string;
  textPrimary: string;
  textSecondary: string;
  swatches: string[];
}

/**
 * Curated System Themes based on Color Hunt Top Trending & Popular Palettes
 */
export const SYSTEM_THEMES: Record<string, ThemePalette> = {
  'velora-purple': {
    key: 'velora-purple',
    name: 'Velora Purple',
    category: 'system',
    primaryMain: '#6366f1', // Modern Indigo/Violet
    primaryDark: '#4f46e5',
    outerBg: '#f4f3fb',
    sidebarBg: '#ffffff',
    activePill: '#6366f1',
    unselectedPill: '#eeedf8',
    paperBg: '#ffffff',
    headerTint: '#ede9fe',
    textPrimary: '#1e1b4b',
    textSecondary: '#6366f1',
    swatches: ['#ede9fe', '#eeedf8', '#6366f1', '#f4f3fb'],
  },
  blue: {
    key: 'blue',
    name: 'Ocean Sapphire',
    category: 'system',
    primaryMain: '#2563eb', // Vibrant Royal Blue
    primaryDark: '#1d4ed8',
    outerBg: '#f0f5fc',
    sidebarBg: '#ffffff',
    activePill: '#2563eb',
    unselectedPill: '#e2eefb',
    paperBg: '#ffffff',
    headerTint: '#dbeafe',
    textPrimary: '#0f172a',
    textSecondary: '#2563eb',
    swatches: ['#dbeafe', '#e2eefb', '#2563eb', '#f0f5fc'],
  },
  teal: {
    key: 'teal',
    name: 'Nordic Teal',
    category: 'system',
    primaryMain: '#0d9488', // Crisp Teal
    primaryDark: '#0f766e',
    outerBg: '#f0fdf9',
    sidebarBg: '#ffffff',
    activePill: '#0d9488',
    unselectedPill: '#e0f6f2',
    paperBg: '#ffffff',
    headerTint: '#ccfbf1',
    textPrimary: '#134e4a',
    textSecondary: '#0d9488',
    swatches: ['#ccfbf1', '#e0f6f2', '#0d9488', '#f0fdf9'],
  },
  rose: {
    key: 'rose',
    name: 'Sunset Coral',
    category: 'system',
    primaryMain: '#f43f5e', // Vibrant Rose/Coral
    primaryDark: '#e11d48',
    outerBg: '#fff1f4',
    sidebarBg: '#ffffff',
    activePill: '#f43f5e',
    unselectedPill: '#ffe4ea',
    paperBg: '#ffffff',
    headerTint: '#ffe4e6',
    textPrimary: '#881337',
    textSecondary: '#e11d48',
    swatches: ['#ffe4e6', '#ffe4ea', '#f43f5e', '#fff1f4'],
  },
  amber: {
    key: 'amber',
    name: 'Amber Gold',
    category: 'system',
    primaryMain: '#d97706', // Warm Amber
    primaryDark: '#b45309',
    outerBg: '#fffbf0',
    sidebarBg: '#ffffff',
    activePill: '#d97706',
    unselectedPill: '#fef3d8',
    paperBg: '#ffffff',
    headerTint: '#fef3c7',
    textPrimary: '#78350f',
    textSecondary: '#b45309',
    swatches: ['#fef3c7', '#fef3d8', '#d97706', '#fffbf0'],
  },
  'midnight-gold': {
    key: 'midnight-gold',
    name: 'Classic Indigo & Cream',
    category: 'system',
    primaryMain: '#22396f', // Classic Indigo & Cream
    primaryDark: '#13254e',
    outerBg: '#f7f6f0',
    sidebarBg: '#ffffff',
    activePill: '#22396f',
    unselectedPill: '#ede9db',
    paperBg: '#ffffff',
    headerTint: '#fcf1d0',
    textPrimary: '#0f172a',
    textSecondary: '#22396f',
    swatches: ['#fcf1d0', '#ede9db', '#22396f', '#f7f6f0'],
  },
};

/**
 * Curated Custom Themes inspired by Color Hunt Palettes (Clean, Light Palettes)
 */
export const DEFAULT_CUSTOM_THEMES: Record<string, ThemePalette> = {
  rust: {
    key: 'rust',
    name: 'Tuscan Terracotta',
    category: 'custom',
    primaryMain: '#c2410c',
    primaryDark: '#9a3412',
    outerBg: '#fff7ed',
    sidebarBg: '#ffffff',
    activePill: '#c2410c',
    unselectedPill: '#ffedd5',
    paperBg: '#ffffff',
    headerTint: '#ffedd5',
    textPrimary: '#7c2d12',
    textSecondary: '#c2410c',
    swatches: ['#ffedd5', '#ffedd5', '#c2410c', '#fff7ed'],
  },
  pink: {
    key: 'pink',
    name: 'Electric Blossom',
    category: 'custom',
    primaryMain: '#ec4899',
    primaryDark: '#db2777',
    outerBg: '#fdf2f8',
    sidebarBg: '#ffffff',
    activePill: '#ec4899',
    unselectedPill: '#fce7f3',
    paperBg: '#ffffff',
    headerTint: '#fce7f3',
    textPrimary: '#831843',
    textSecondary: '#db2777',
    swatches: ['#fce7f3', '#fce7f3', '#ec4899', '#fdf2f8'],
  },
  indigo: {
    key: 'indigo',
    name: 'Deep Indigo',
    category: 'custom',
    primaryMain: '#4f46e5',
    primaryDark: '#3730a3',
    outerBg: '#f5f7ff',
    sidebarBg: '#ffffff',
    activePill: '#4f46e5',
    unselectedPill: '#e0e7ff',
    paperBg: '#ffffff',
    headerTint: '#c7d2fe',
    textPrimary: '#1e1b4b',
    textSecondary: '#4338ca',
    swatches: ['#c7d2fe', '#e0e7ff', '#4f46e5', '#f5f7ff'],
  },
  orange: {
    key: 'orange',
    name: 'Sunset Flame',
    category: 'custom',
    primaryMain: '#ea580c',
    primaryDark: '#c2410c',
    outerBg: '#fff7ed',
    sidebarBg: '#ffffff',
    activePill: '#ea580c',
    unselectedPill: '#fed7aa',
    paperBg: '#ffffff',
    headerTint: '#fed7aa',
    textPrimary: '#7c2d12',
    textSecondary: '#ea580c',
    swatches: ['#fed7aa', '#fed7aa', '#ea580c', '#fff7ed'],
  },
  plum: {
    key: 'plum',
    name: 'Royal Amethyst',
    category: 'custom',
    primaryMain: '#7209b7',
    primaryDark: '#560bad',
    outerBg: '#faf5ff',
    sidebarBg: '#ffffff',
    activePill: '#7209b7',
    unselectedPill: '#f3e8ff',
    paperBg: '#ffffff',
    headerTint: '#f3e8ff',
    textPrimary: '#3b0764',
    textSecondary: '#7209b7',
    swatches: ['#f3e8ff', '#f3e8ff', '#7209b7', '#faf5ff'],
  },
  forest: {
    key: 'forest',
    name: 'Forest Emerald',
    category: 'custom',
    primaryMain: '#16a34a',
    primaryDark: '#15803d',
    outerBg: '#f0fdf4',
    sidebarBg: '#ffffff',
    activePill: '#16a34a',
    unselectedPill: '#dcfce7',
    paperBg: '#ffffff',
    headerTint: '#dcfce7',
    textPrimary: '#14532d',
    textSecondary: '#16a34a',
    swatches: ['#dcfce7', '#dcfce7', '#16a34a', '#f0fdf4'],
  },
  glacier: {
    key: 'glacier',
    name: 'Glacier Cyan',
    category: 'custom',
    primaryMain: '#0891b2',
    primaryDark: '#0e7490',
    outerBg: '#ecfeff',
    sidebarBg: '#ffffff',
    activePill: '#0891b2',
    unselectedPill: '#cffafe',
    paperBg: '#ffffff',
    headerTint: '#cffafe',
    textPrimary: '#155e75',
    textSecondary: '#0891b2',
    swatches: ['#cffafe', '#cffafe', '#0891b2', '#ecfeff'],
  },
  'obsidian-mint': {
    key: 'obsidian-mint',
    name: 'Fresh Mint',
    category: 'custom',
    primaryMain: '#10b981',
    primaryDark: '#059669',
    outerBg: '#f0fdfa',
    sidebarBg: '#ffffff',
    activePill: '#10b981',
    unselectedPill: '#d1fae5',
    paperBg: '#ffffff',
    headerTint: '#d1fae5',
    textPrimary: '#0f172a',
    textSecondary: '#10b981',
    swatches: ['#d1fae5', '#d1fae5', '#10b981', '#f0fdfa'],
  },
};

/**
 * Modern Color Swatches inspired by Color Hunt's popular color trends
 */
export const COLOR_SWATCH_PRESETS = [
  { name: 'Velora Violet', color: '#6366f1' },
  { name: 'Cyber Blue', color: '#2563eb' },
  { name: 'Glacier Cyan', color: '#06b6d4' },
  { name: 'Mint Emerald', color: '#10b981' },
  { name: 'Nordic Teal', color: '#0d9488' },
  { name: 'Botanical Green', color: '#16a34a' },
  { name: 'Sunset Amber', color: '#f59e0b' },
  { name: 'Tuscan Orange', color: '#ea580c' },
  { name: 'Sunset Coral', color: '#f43f5e' },
  { name: 'Crimson Rose', color: '#e11d48' },
  { name: 'Electric Pink', color: '#ec4899' },
  { name: 'Royal Amethyst', color: '#8b5cf6' },
  { name: 'Midnight Navy', color: '#1e3a8a' },
  { name: 'Modern Slate', color: '#475569' },
];

/**
 * Helper to adjust hex color lightness & tone dynamically
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const val = Math.round((n + m) * 255);
    return Math.max(0, Math.min(255, val)).toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Procedurally generates a harmonious 4-color modern Color Hunt style palette from any color.
 */
export function generateCustomThemeFromColor(hexColor: string, name: string): ThemePalette {
  const key = name.toLowerCase().replace(/\s+/g, '-');
  const hsl = hexToHsl(hexColor);

  // Generate harmonized light tones based on the selected hue
  const primaryMain = hexColor;
  const primaryDark = hslToHex(hsl.h, Math.min(100, hsl.s + 10), Math.max(25, hsl.l - 12));
  const activePill = hexColor;
  const outerBg = hslToHex(hsl.h, 30, 96);
  const sidebarBg = '#ffffff';
  const unselectedPill = hslToHex(hsl.h, 35, 93);
  const paperBg = '#ffffff';
  const headerTint = hslToHex(hsl.h, 60, 92);
  const textPrimary = '#0f172a';
  const textSecondary = primaryDark;

  return {
    key,
    name,
    category: 'custom',
    primaryMain,
    primaryDark,
    outerBg,
    sidebarBg,
    activePill,
    unselectedPill,
    paperBg,
    headerTint,
    textPrimary,
    textSecondary,
    swatches: [headerTint, unselectedPill, primaryMain, outerBg],
  };
}
