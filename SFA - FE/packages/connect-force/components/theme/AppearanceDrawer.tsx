"use client";

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Grid,
  Stack,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PaletteIcon from '@mui/icons-material/Palette';
import AddIcon from '@mui/icons-material/Add';
import { useThemeContext } from '@/context/ThemeContext';
import { useRouter } from 'next/navigation';
import { ThemePalette } from '@/theme/themeConfig';

export default function AppearanceDrawer() {
  const router = useRouter();
  const {
    isAppearanceOpen,
    closeAppearanceDrawer,
    currentTheme,
    currentThemeKey,
    allThemes,
    selectTheme,
  } = useThemeContext();

  const themeList = Object.values(allThemes);

  const handleExploreMoreClick = () => {
    closeAppearanceDrawer();
    router.push('/dashboard/theme');
  };

  return (
    <Drawer
      anchor="right"
      open={isAppearanceOpen}
      onClose={closeAppearanceDrawer}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 380 },
          bgcolor: '#ffffff',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header Bar matching Theme */}
      <Box
        sx={{
          bgcolor: currentTheme.primaryMain || '#6366f1',
          color: '#ffffff',
          px: 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <PaletteIcon sx={{ color: '#ffffff', fontSize: '1.4rem' }} />
          <Typography variant="h6" fontWeight={800} sx={{ fontSize: '1.15rem' }}>
            Appearance
          </Typography>
        </Stack>
        <IconButton onClick={closeAppearanceDrawer} sx={{ color: '#ffffff' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Subtitle & Currently Selected Badge */}
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={800} sx={{ color: currentTheme.textPrimary || '#1e1b4b', lineHeight: 1.2 }}>
          Select Your Theme
        </Typography>
        <Typography variant="caption" sx={{ color: '#686d94', display: 'block', mb: 1.5 }}>
          Choose a color palette that matches your style
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: '#f4f6fa', p: 1, borderRadius: '8px' }}>
          <Typography variant="caption" fontWeight={600} sx={{ color: '#5d638a' }}>
            Currently selected:
          </Typography>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '3px',
              bgcolor: currentTheme.primaryMain,
            }}
          />
          <Typography variant="caption" fontWeight={800} sx={{ color: '#0a0d2c' }}>
            {currentTheme.name}
          </Typography>
        </Stack>
      </Box>

      {/* Scrollable Theme Cards Grid matching Image 1 */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2.5,
          pt: 1,
          '&::-webkit-scrollbar': { width: '5px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.15)', borderRadius: '3px' },
        }}
      >
        <Grid container spacing={2}>
          {/* Card 1: Explore & Create Custom Themes (+) Card */}
          <Grid item xs={6}>
            <Tooltip title="Click to navigate & create custom themes">
              <Box
                onClick={handleExploreMoreClick}
                sx={{
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  p: 1.2,
                  height: 120,
                  bgcolor: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: currentTheme.primaryMain,
                    bgcolor: '#f1f5f9',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Mini Mockup layout with plus icon in center */}
                <Box
                  sx={{
                    width: '100%',
                    height: 65,
                    bgcolor: '#e2e8f0',
                    borderRadius: '6px',
                    p: 0.8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  <AddIcon sx={{ color: '#64748b', fontSize: '1.6rem' }} />
                </Box>
                <Typography variant="caption" fontWeight={700} sx={{ color: '#475569' }}>
                  More Themes
                </Typography>
              </Box>
            </Tooltip>
          </Grid>

          {/* Render All Theme Cards */}
          {themeList.map((t: ThemePalette) => {
            const isSelected = currentThemeKey === t.key;
            return (
              <Grid item xs={6} key={t.key}>
                <Box
                  onClick={() => selectTheme(t.key)}
                  sx={{
                    border: isSelected ? `2.5px solid ${t.primaryMain}` : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    p: 1,
                    bgcolor: isSelected ? `${t.primaryMain}0d` : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 4px 14px ${t.primaryMain}26` : 'none',
                    '&:hover': {
                      borderColor: t.primaryMain,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {/* Mini Application Layout Card Preview */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 65,
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      overflow: 'hidden',
                      bgcolor: t.paperBg,
                      display: 'flex',
                      flexDirection: 'column',
                      mb: 1,
                    }}
                  >
                    {/* Top Header */}
                    <Box sx={{ height: 12, bgcolor: t.primaryMain, width: '100%' }} />
                    <Box sx={{ display: 'flex', flexGrow: 1 }}>
                      {/* Left Sidebar */}
                      <Box sx={{ width: '22%', bgcolor: t.sidebarBg, p: 0.3 }}>
                        <Box sx={{ width: '100%', height: 4, bgcolor: t.activePill, borderRadius: 0.5, mb: 0.3 }} />
                        <Box sx={{ width: '70%', height: 3, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: 0.5 }} />
                      </Box>
                      {/* Main Island Area */}
                      <Box sx={{ flexGrow: 1, p: 0.4, bgcolor: t.paperBg }}>
                        <Box sx={{ width: '80%', height: 4, bgcolor: t.headerTint, borderRadius: 0.5, mb: 0.4 }} />
                        <Box sx={{ width: '100%', height: 3, bgcolor: '#e2e8f0', borderRadius: 0.5, mb: 0.3 }} />
                        <Box sx={{ width: '90%', height: 3, bgcolor: '#e2e8f0', borderRadius: 0.5 }} />
                      </Box>
                    </Box>
                  </Box>

                  {/* Theme Title */}
                  <Typography
                    variant="caption"
                    align="center"
                    display="block"
                    fontWeight={isSelected ? 800 : 600}
                    sx={{ color: isSelected ? t.primaryMain : '#334155', mb: 0.6 }}
                  >
                    {t.name}
                  </Typography>

                  {/* 4 Swatch Dots */}
                  <Stack direction="row" spacing={0.6} justifyContent="center">
                    {t.swatches.map((color: string, idx: number) => (
                      <Box
                        key={idx}
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: color,
                          border: '1px solid rgba(0,0,0,0.1)',
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Drawer>
  );
}
