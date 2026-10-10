import React, { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Link, IconButton, Stack } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { alpha } from '@mui/material/styles';
import { useThemeContext } from '@/context/ThemeContext';

export interface BreadcrumbPaths {
  pageName?: string;
  path?: string;
}

export interface BreadcrumbProps {
  pageTitle?: string;
  pageNavigation?: BreadcrumbPaths[];
  onAddClick?: () => void;
  onFullScreenClick?: () => void;
  onLinkClick?: (path: string | undefined) => void;
  icon?: ReactNode;
}

export function BreadcrumbNavigation({
  pageTitle,
  pageNavigation,
  onFullScreenClick,
  onLinkClick,
  icon,
}: BreadcrumbProps) {
  const { currentTheme } = useThemeContext();

  return (
    <Box
      sx={{
        mb: 2.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {/* Left Side: Themed Icon Box + Title & Breadcrumbs */}
      <Stack direction="row" alignItems="center" spacing={2}>
        {icon && (
          <Box
            sx={{
              bgcolor: currentTheme?.headerTint || '#e0f2fe',
              color: currentTheme?.primaryMain || '#0284c7',
              p: 1.2,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${alpha(currentTheme?.primaryMain || '#0284c7', 0.15)}`,
              boxShadow: `0 2px 8px ${alpha(currentTheme?.primaryMain || '#0284c7', 0.12)}`,
              transition: 'all 0.25s ease',
              '& svg': {
                fontSize: '1.6rem',
                color: currentTheme?.primaryMain || '#0284c7',
              },
            }}
          >
            {icon}
          </Box>
        )}

        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 800,
              color: currentTheme?.textPrimary || '#0f172a',
              fontSize: '1.4rem',
              letterSpacing: '-0.2px',
              lineHeight: 1.2,
              mb: 0.3,
            }}
          >
            {pageTitle}
          </Typography>

          {pageNavigation && pageNavigation.length > 0 && (
            <Breadcrumbs
              separator={
                <NavigateNextIcon
                  fontSize="small"
                  sx={{
                    color: currentTheme?.textSecondary || alpha(currentTheme?.textPrimary || '#0f172a', 0.4),
                    fontSize: '0.9rem',
                  }}
                />
              }
              aria-label="breadcrumb"
            >
              {pageNavigation.map((item, index) => {
                const isLast = index === pageNavigation.length - 1;
                return isLast ? (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      fontWeight: 700,
                      color: currentTheme?.textPrimary || '#0f172a',
                      fontSize: '0.85rem',
                    }}
                  >
                    {item.pageName}
                  </Typography>
                ) : (
                  <Link
                    key={index}
                    underline="hover"
                    variant="body2"
                    href={item.path || '#'}
                    onClick={(e) => {
                      if (onLinkClick) {
                        e.preventDefault();
                        onLinkClick(item.path);
                      }
                    }}
                    sx={{
                      cursor: 'pointer',
                      color: currentTheme?.primaryMain || '#0284c7',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: currentTheme?.primaryDark || '#0369a1',
                      },
                    }}
                  >
                    {item.pageName}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}
        </Box>
      </Stack>

      {/* Right Side: Fullscreen / Expand button */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        {onFullScreenClick && (
          <IconButton
            onClick={onFullScreenClick}
            sx={{
              bgcolor: currentTheme?.headerTint || '#e0f2fe',
              color: currentTheme?.primaryMain || '#0284c7',
              p: 1,
              borderRadius: '10px',
              border: `1px solid ${alpha(currentTheme?.primaryMain || '#0284c7', 0.18)}`,
              boxShadow: `0 2px 6px ${alpha(currentTheme?.primaryMain || '#0284c7', 0.1)}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: alpha(currentTheme?.primaryMain || '#0284c7', 0.18),
                color: currentTheme?.primaryDark || '#0369a1',
              },
            }}
          >
            <OpenInFullIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}

export default BreadcrumbNavigation;
