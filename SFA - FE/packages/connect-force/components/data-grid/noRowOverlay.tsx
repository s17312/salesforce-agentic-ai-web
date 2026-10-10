"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import GoogleIcon from "@/components/icons/GoogleIcon";

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
  buttonText = "Add Entry",
  title = "No data to display",
  subtitle = "There are no records in this table yet.\nAdd your first entry to get started.",
  showButton = true,
  googleIconName = "table_chart",
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
        minHeight: 300,
        py: 5,
        px: 2,
        textAlign: "center",
      }}
    >
      {/* Box with Google Fonts Icon matching Image 2 */}
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "12px",
          bgcolor: theme.palette.primary?.lighter || "#f4f5f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          border: `1px solid ${alpha(theme.palette.primary?.main || "#111827", 0.15)}`,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <GoogleIcon
          name={googleIconName}
          size={28}
          color={theme.palette.primary?.main || "#111827"}
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
export default CustomNoRowsOverlay;