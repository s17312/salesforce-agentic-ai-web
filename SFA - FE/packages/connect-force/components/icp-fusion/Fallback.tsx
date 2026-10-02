import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

export interface IFallbackProps {
  variant?: '400' | '401' | '403' | '404' | '500' | '503';
  helpText?: string;
  ctaLabel?: string;
  route?: string;
  handleCta?: (event: object) => void;
  title?: string;
  description?: string;
  image?: string;
}

export function Fallback({
  variant = '404',
  helpText,
  ctaLabel = 'Go to Home',
  route = '/',
  handleCta,
  title,
  description,
}: React.PropsWithChildren<IFallbackProps>) {
  const getDefaultTitle = () => {
    switch (variant) {
      case '401':
        return '401 - Unauthorized';
      case '403':
        return '403 - Access Denied';
      case '500':
        return '500 - Internal Server Error';
      case '404':
      default:
        return '404 - Page Not Found';
    }
  };

  const getDefaultDescription = () => {
    switch (variant) {
      case '403':
        return 'You do not have permission to access this page.';
      case '500':
        return 'Something went wrong on our end. Please try again later.';
      case '404':
      default:
        return 'Sorry, we couldn’t find the page you’re looking for.';
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          py: 12,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" color="primary" sx={{ fontWeight: 800, fontSize: '5rem', mb: 2 }}>
          {title || getDefaultTitle()}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 480 }}>
          {description || getDefaultDescription()}
        </Typography>

        {helpText && (
          <Typography variant="caption" color="text.disabled" sx={{ mb: 3 }}>
            {helpText}
          </Typography>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleCta || (() => (window.location.href = route))}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          {ctaLabel}
        </Button>
      </Box>
    </Container>
  );
}

export default Fallback;
