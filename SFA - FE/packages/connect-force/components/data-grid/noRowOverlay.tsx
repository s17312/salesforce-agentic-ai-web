"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import GoogleIcon from "@/components/icons/GoogleIcon";
import {
  EMPTY_STATE_TITLE,
  EMPTY_STATE_SUBTITLE,
  EMPTY_STATE_ICON,
  EMPTY_STATE_ICON_SIZE,
  EMPTY_STATE_ICON_BOX_SIZE,
  EMPTY_STATE_DEFAULT_BUTTON_TEXT,
  TABLE_OVERLAY_MIN_HEIGHT,
  TABLE_FALLBACK_THEME,
} from "@/constants";

export interface CustomNoRowsOverlayProps {
  onAdd?: () => void;
  buttonText?: string;
  title?: string;
  subtitle?: string;
  showButton?: boolean;
  googleIconName?: string;
}

export function CustomNoRowsOverlay({
  onAdd,
  buttonText = EMPTY_STATE_DEFAULT_BUTTON_TEXT,
  title = EMPTY_STATE_TITLE,
  subtitle = EMPTY_STATE_SUBTITLE,
  showButton = false,
  googleIconName = EMPTY_STATE_ICON,
}: CustomNoRowsOverlayProps) {
  const theme = useTheme();
  const formattedButtonText = buttonText.startsWith("+") ? buttonText : `+ ${buttonText}`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: TABLE_OVERLAY_MIN_HEIGHT,
        py: 5,
        px: 2,
        textAlign: "center",
      }}
    >
      {/* Box with Google Fonts Icon */}
      <Box
        sx={{
          width: EMPTY_STATE_ICON_BOX_SIZE,
          height: EMPTY_STATE_ICON_BOX_SIZE,
          borderRadius: "12px",
          bgcolor: theme.palette.primary?.lighter || TABLE_FALLBACK_THEME.emptyIconBoxBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          border: `1px solid ${alpha(theme.palette.primary?.main || TABLE_FALLBACK_THEME.textPrimary, 0.15)}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <GoogleIcon
          name={googleIconName}
          size={EMPTY_STATE_ICON_SIZE}
          color={theme.palette.primary?.main || TABLE_FALLBACK_THEME.textPrimary}
          weight={500}
        />
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          color: theme.palette.text?.primary || "#111827",
          fontSize: "1.125rem",
          letterSpacing: "-0.2px",
          mb: 0.8,
        }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body2"
        sx={{
          color: "#6b7280",
          fontSize: "0.875rem",
          lineHeight: 1.5,
          maxWidth: 320,
          whiteSpace: "pre-line",
          mb: showButton ? 2.5 : 0,
        }}
      >
        {subtitle}
      </Typography>

      {/* Call to Action Button matching Image 2 */}
      {showButton && (
        <Button
          variant="contained"
          onClick={onAdd}
          sx={{
            bgcolor: theme.palette.primary?.main || "#0a0d2c",
            color: "#ffffff",
            borderRadius: "10px",
            px: 2.8,
            py: 0.85,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.875rem",
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary?.main || "#0a0d2c", 0.3)}`,
            "&:hover": {
              bgcolor: theme.palette.primary?.dark || "#1a2254",
              boxShadow: `0 6px 16px ${alpha(theme.palette.primary?.main || "#0a0d2c", 0.4)}`,
              cursor: onAdd ? "pointer" : "default",
            },
          }}
        >
          {formattedButtonText}
        </Button>
      )}
    </Box>
  );
}

export const TableEmptyState = CustomNoRowsOverlay;
export const StyledGridOverlay = CustomNoRowsOverlay;
export { TableSkeletonOverlay } from "./tableSkeletonOverlay";
export default CustomNoRowsOverlay;