import React, { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Link, Button, Stack } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import FullscreenIcon from '@mui/icons-material/Fullscreen';

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
  onAddClick,
  onFullScreenClick,
  onLinkClick,
  icon,
}: BreadcrumbProps) {
  return (
    <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          {icon && <Box sx={{ display: 'inline-flex', mr: 0.5 }}>{icon}</Box>}
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {pageTitle}
          </Typography>
        </Stack>

        {pageNavigation && pageNavigation.length > 0 && (
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            {pageNavigation.map((item, index) => {
              const isLast = index === pageNavigation.length - 1;
              return isLast ? (
                <Typography key={index} color="text.secondary" variant="body2" sx={{ fontWeight: 500 }}>
                  {item.pageName}
                </Typography>
              ) : (
                <Link
                  key={index}
                  underline="hover"
                  color="inherit"
                  variant="body2"
                  href={item.path || '#'}
                  onClick={(e) => {
                    if (onLinkClick) {
                      e.preventDefault();
                      onLinkClick(item.path);
                    }
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  {item.pageName}
                </Link>
              );
            })}
          </Breadcrumbs>
        )}
      </Box>

      <Stack direction="row" spacing={1.5} alignItems="center">
        {onAddClick && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{ textTransform: 'none', borderRadius: 1.5, px: 2, fontWeight: 600 }}
          >
            Add New
          </Button>
        )}
        {onFullScreenClick && (
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<FullscreenIcon />}
            onClick={onFullScreenClick}
            sx={{ textTransform: 'none', borderRadius: 1.5 }}
          >
            Full Screen
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default BreadcrumbNavigation;
