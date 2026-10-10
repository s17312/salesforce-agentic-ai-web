"use client";

import React from "react";
import { Box, BoxProps } from "@mui/material";

export interface GoogleIconProps extends Omit<BoxProps, "color"> {
  /**
   * Icon name from Google Fonts Icons: https://fonts.google.com/icons
   * E.g. "table_chart", "grid_view", "table_rows", "dataset", "inventory_2", etc.
   */
  name: string;
  /**
   * Icon size in pixels or CSS units (default: 24)
   */
  size?: number | string;
  /**
   * Icon color (default: "inherit")
   */
  color?: string;
  /**
   * Font style: "rounded" | "outlined" | "sharp" (default: "rounded")
   */
  variant?: "rounded" | "outlined" | "sharp";
  /**
   * Fill state: true for filled icon, false for outline (default: false)
   */
  fill?: boolean;
  /**
   * Font weight: 100 to 700 (default: 400)
   */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /**
   * Optical size: 20, 24, 40, 48 (default: 24)
   */
  opsz?: 20 | 24 | 40 | 48;
}

/**
 * Universal Google Fonts Icon Component
 * Connects directly to Google Material Symbols: https://fonts.google.com/icons
 */
export const GoogleIcon: React.FC<GoogleIconProps> = ({
  name,
  size = 24,
  color = "inherit",
  variant = "rounded",
  fill = false,
  weight = 400,
  opsz = 24,
  sx,
  ...rest
}) => {
  const fontClassName =
    variant === "outlined"
      ? "material-symbols-outlined"
      : "material-symbols-rounded";

  return (
    <Box
      component="span"
      className={fontClassName}
      sx={{
        fontFamily:
          variant === "outlined"
            ? "'Material Symbols Outlined'"
            : "'Material Symbols Rounded'",
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: typeof size === "number" ? `${size}px` : size,
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "normal",
        textTransform: "none",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        direction: "ltr",
        userSelect: "none",
        color: color,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${opsz}`,
        ...sx,
      }}
      {...rest}
    >
      {name}
    </Box>
  );
};

export default GoogleIcon;
