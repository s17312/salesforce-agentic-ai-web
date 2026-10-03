"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { useThemeContext } from '@/context/ThemeContext';
import { BreadcrumbNavigation } from '@icp/react-fusion';
import { COLOR_SWATCH_PRESETS, ThemePalette } from '@/theme/themeConfig';
import AddIcon from '@mui/icons-material/Add';
import PaletteIcon from '@mui/icons-material/Palette';

export default function ThemeManagementPage() {
  const {
    currentTheme,
    currentThemeKey,
    systemThemes,
    customThemes,
    selectTheme,
    createCustomTheme,
  } = useThemeContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSwatchColor, setSelectedSwatchColor] = useState('#1d4ed8');
  const [customNameInput, setCustomNameInput] = useState('');

  const handleSwatchClick = (color: string, defaultName: string) => {
    setSelectedSwatchColor(color);
    setCustomNameInput(defaultName);
    setOpenDialog(true);
  };

  const handleConfirmCreateTheme = () => {
    if (selectedSwatchColor) {
      createCustomTheme(selectedSwatchColor, customNameInput || 'Custom Theme');
      setOpenDialog(false);
    }
  };

  const renderThemeCard = (t: ThemePalette) => {
    const isSelected = currentThemeKey === t.key;
    return (
      <Grid item xs={12} sm={6} md={2.4} key={t.key}>
        <Box
          onClick={() => selectTheme(t.key)}
          sx={{
            border: isSelected ? '2.5px solid #0a0d2c' : '1px solid #cbd5e1',
            borderRadius: '14px',
            p: 1.5,
            bgcolor: isSelected ? '#ffffff' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isSelected ? '0 8px 24px rgba(10,13,44,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
            position: 'relative',
            '&:hover': {
              borderColor: '#0a0d2c',
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          {/* Mini Application Layout Card Preview matching Image 2 */}
          <Box
            sx={{
              width: '100%',
              height: 110,
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              overflow: 'hidden',
              bgcolor: t.paperBg,
              display: 'flex',
              flexDirection: 'column',
              mb: 1.5,
            }}
          >
            {/* Top Header */}
            <Box sx={{ height: 18, bgcolor: t.primaryMain, width: '100%' }} />
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              {/* Left Sidebar */}
              <Box sx={{ width: '24%', bgcolor: t.sidebarBg, p: 0.6 }}>
                <Box sx={{ width: '100%', height: 6, bgcolor: t.activePill, borderRadius: 1, mb: 0.5 }} />
                <Box sx={{ width: '70%', height: 4, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: 0.5, mb: 0.4 }} />
                <Box sx={{ width: '80%', height: 4, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 0.5 }} />
              </Box>
              {/* Main Island Area */}
              <Box sx={{ flexGrow: 1, p: 0.8, bgcolor: t.paperBg }}>
                <Box sx={{ width: '60%', height: 6, bgcolor: t.headerTint, borderRadius: 1, mb: 0.8 }} />
                <Box sx={{ width: '100%', height: 4, bgcolor: '#e2e8f0', borderRadius: 0.5, mb: 0.4 }} />
                <Box sx={{ width: '100%', height: 4, bgcolor: '#e2e8f0', borderRadius: 0.5, mb: 0.4 }} />
                <Box sx={{ width: '85%', height: 4, bgcolor: '#e2e8f0', borderRadius: 0.5 }} />
              </Box>
            </Box>
          </Box>

          {/* Theme Title */}
          <Typography
            variant="subtitle2"
            align="center"
            fontWeight={isSelected ? 800 : 700}
            sx={{
              color: isSelected ? t.primaryMain : '#1e293b',
              fontSize: '0.9rem',
              mb: 1,
              textDecoration: isSelected ? 'underline' : 'none',
            }}
          >
            {t.name}
          </Typography>

          {/* 4 Color Swatch Dots */}
          <Stack direction="row" spacing={0.8} justifyContent="center">
            {t.swatches.map((color: string, idx: number) => (
              <Box
                key={idx}
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  bgcolor: color,
                  border: '1px solid rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </Stack>
        </Box>
      </Grid>
    );
  };

  return (
    <Box sx={{ width: '100%', pb: 4 }}>
      {/* Top Breadcrumb Navigation */}
      <BreadcrumbNavigation
        pageTitle="Theme & Appearance"
        pageNavigation={[{ pageName: 'Settings' }, { pageName: 'Theme' }]}
        icon={<PaletteIcon sx={{ color: '#0a0d2c' }} />}
      />

      {/* Main Container Card matching Image 2 */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderRadius: '16px',
          p: { xs: 2.5, md: 4 },
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Page Top Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#0a0d2c', mb: 0.5 }}>
              Select Your Theme
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Choose a color palette that matches your style
            </Typography>
          </Box>

          {/* Currently Selected Badge */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ bgcolor: '#f1f5f9', px: 2, py: 1, borderRadius: '10px' }}>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#475569' }}>
              Currently selected:
            </Typography>
            <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: currentTheme.primaryMain }} />
            <Typography variant="body2" fontWeight={800} sx={{ color: '#0f172a' }}>
              {currentTheme.name}
            </Typography>
          </Stack>
        </Box>

        {/* Section 1: System Generated Themes */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#334155', mb: 2 }}>
            System Generated
          </Typography>
          <Grid container spacing={2.5}>
            {Object.values(systemThemes).map((t) => renderThemeCard(t))}
          </Grid>
        </Box>

        {/* Section 2: Custom Generated Themes */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#334155', mb: 2 }}>
            Custom Generated
          </Typography>
          <Grid container spacing={2.5}>
            {Object.values(customThemes).map((t) => renderThemeCard(t))}
          </Grid>
        </Box>

        {/* Section 3: Create Custom Theme */}
        <Box sx={{ pt: 2, borderTop: '1px solid #f1f5f9' }}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#0f172a', mb: 0.5 }}>
            Create Custom Theme
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
            Select a color to apply as your custom theme. It will appear above with the theme name.
          </Typography>

          {/* Swatch Color Circles matching Image 2 */}
          <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ gap: 2 }}>
            {COLOR_SWATCH_PRESETS.map((preset) => (
              <Tooltip key={preset.name} title={`Create ${preset.name} Theme`}>
                <Box
                  onClick={() => handleSwatchClick(preset.color, preset.name)}
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    bgcolor: preset.color,
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s ease',
                    border: '3px solid #ffffff',
                    outline: '2px solid transparent',
                    '&:hover': {
                      transform: 'scale(1.15)',
                      outline: `2px solid ${preset.color}`,
                    },
                  }}
                />
              </Tooltip>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Custom Theme Name Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Custom Theme</DialogTitle>
        <DialogContent sx={{ minWidth: 320, pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter a name for your custom theme color.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Theme Name"
            value={customNameInput}
            onChange={(e) => setCustomNameInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirmCreateTheme}
            sx={{ bgcolor: '#0a0d2c', color: '#ffffff' }}
          >
            Create & Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
