import React, { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Link, IconButton, Stack } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

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
      {/* Left Side: Soft Light Purple Icon + Title & Breadcrumbs */}
      <Stack direction="row" alignItems="center" spacing={2}>
        {icon && (
          <Box
            sx={{
              bgcolor: '#e4e1f7',
              color: '#0a0d2c',
              p: 1.2,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(10,13,44,0.06)',
              '& svg': {
                fontSize: '1.6rem',
                color: '#0a0d2c',
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
              color: '#0a0d2c',
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
              separator={<NavigateNextIcon fontSize="small" sx={{ color: '#5d638a', fontSize: '0.9rem' }} />}
              aria-label="breadcrumb"
            >
              {pageNavigation.map((item, index) => {
                const isLast = index === pageNavigation.length - 1;
                return isLast ? (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{ fontWeight: 600, color: '#5d638a', fontSize: '0.85rem' }}
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
                      color: '#5d638a',
                      fontWeight: 500,
                      fontSize: '0.85rem',
                      '&:hover': { color: '#0a0d2c' },
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
              bgcolor: '#e4e1f7',
              color: '#0a0d2c',
              p: 1,
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(10,13,44,0.06)',
              '&:hover': {
                bgcolor: '#d5d0f2',
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
