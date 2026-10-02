import React, { forwardRef } from 'react';
import {
  Box,
  Avatar,
  AvatarGroup,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  BoxProps,
  AvatarProps,
  AvatarGroupProps,
} from '@mui/material';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(function Logo({ disabledLink, sx, ...props }, ref) {
  return (
    <Box ref={ref} sx={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', ...sx }} {...props}>
      <Typography variant="h6" fontWeight={800} color="primary">
        CONNECT<span style={{ color: '#2163D7' }}>FORCE</span>
      </Typography>
    </Box>
  );
});

export function BadgeStatus({ size = 'medium', status = 'online', sx, ...props }: any) {
  const getColor = () => {
    switch (status) {
      case 'online':
        return '#36B37E';
      case 'busy':
        return '#FF5630';
      case 'away':
        return '#FFAB00';
      default:
        return '#919EAB';
    }
  };

  return (
    <Box
      sx={{
        width: size === 'small' ? 8 : 12,
        height: size === 'small' ? 8 : 12,
        borderRadius: '50%',
        backgroundColor: getColor(),
        display: 'inline-block',
        ...sx,
      }}
      {...props}
    />
  );
}

export const CustomAvatar = forwardRef<HTMLDivElement, AvatarProps & { color?: string; name?: string }>(
  function CustomAvatar({ color = 'primary', name, children, sx, ...props }, ref) {
    const getInitials = (n?: string) => (n ? n.substring(0, 2).toUpperCase() : '');
    return (
      <Avatar ref={ref} sx={{ bgcolor: `${color}.main`, fontWeight: 700, ...sx }} {...props}>
        {children || getInitials(name)}
      </Avatar>
    );
  }
);

export const CustomAvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function CustomAvatarGroup(props, ref) {
  return <AvatarGroup ref={ref} {...props} />;
});

export const Image = forwardRef<HTMLSpanElement, any>(function Image({ src, alt, sx, ...props }, ref) {
  return (
    <Box component="span" ref={ref} sx={{ display: 'inline-block', overflow: 'hidden', ...sx }}>
      <img src={src} alt={alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} {...props} />
    </Box>
  );
});

export function UserInfo({ username, userEmail, role, avatarUrl }: any) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src={avatarUrl}>{username ? username[0] : 'U'}</Avatar>
      <Box>
        <Typography variant="subtitle2" fontWeight={700}>
          {username || 'User'}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {userEmail || role || 'Administrator'}
        </Typography>
      </Box>
    </Stack>
  );
}

export function Copyright({ titleText = 'SFA Suite', companyName = 'ConnectForce', reservedText = 'All rights reserved.' }: any) {
  return (
    <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ py: 2 }}>
      © {new Date().getFullYear()} {companyName}. {reservedText}
    </Typography>
  );
}

export function DataCard({ title, value, titleColor, valueColor, backgroundColor, sx, onClickFun }: any) {
  return (
    <Card
      onClick={onClickFun}
      sx={{
        p: 2.5,
        backgroundColor: backgroundColor || '#fff',
        borderRadius: 2,
        cursor: onClickFun ? 'pointer' : 'default',
        boxShadow: (theme) => theme.shadows[1],
        ...sx,
      }}
    >
      <Typography variant="body2" color={titleColor || 'text.secondary'} fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="h4" color={valueColor || 'text.primary'} fontWeight={800} sx={{ mt: 1 }}>
        {value}
      </Typography>
    </Card>
  );
}

export function GaugeChart({ title, value = 0 }: any) {
  return (
    <Card sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
        {value}%
      </Typography>
    </Card>
  );
}

export function LineChartComponent({ title, amount }: any) {
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
        {amount}
      </Typography>
    </Card>
  );
}

export function LoginForm({ onLoginClick, title = 'Sign In' }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginClick) onLoginClick({ email, password });
  };

  return (
    <Card sx={{ p: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <Button variant="contained" type="submit" size="large" fullWidth>
            Log In
          </Button>
        </Stack>
      </form>
    </Card>
  );
}

export function ForgotPasswordPage({ title = 'Forgot Password?' }: any) {
  return (
    <Card sx={{ p: 4, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        {title}
      </Typography>
      <TextField label="Email Address" fullWidth sx={{ mb: 2 }} />
      <Button variant="contained" fullWidth>
        Reset Password
      </Button>
    </Card>
  );
}

export function VerifyOtp({ HeaderText = 'Verify OTP' }: any) {
  return (
    <Card sx={{ p: 4, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        {HeaderText}
      </Typography>
      <Button variant="contained" fullWidth>
        Submit OTP
      </Button>
    </Card>
  );
}

export function LoginLayout({ LoginComponent }: any) {
  return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{LoginComponent}</Box>;
}
