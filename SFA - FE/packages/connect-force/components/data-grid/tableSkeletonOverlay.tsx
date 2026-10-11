"use client";

import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useThemeContext } from "@/context/ThemeContext";
import {
  SKELETON_DEFAULT_ROW_COUNT,
  SKELETON_DEFAULT_COLUMN_COUNT,
  SKELETON_ROW_HEIGHT,
  SKELETON_CELL_HEIGHT,
  SKELETON_ACTION_ICON_SIZE,
  SKELETON_WIDTH_VARIATIONS,
  TABLE_OVERLAY_MIN_HEIGHT,
  TABLE_FALLBACK_THEME,
} from "@/constants";

export interface TableSkeletonOverlayProps {
  rowCount?: number;
  columnCount?: number;
  columns?: Array<{
    field?: string;
    headerName?: string;
    flex?: number;
    width?: number;
    minWidth?: number;
  }>;
}

export function TableSkeletonOverlay({
  rowCount = SKELETON_DEFAULT_ROW_COUNT,
  columnCount = SKELETON_DEFAULT_COLUMN_COUNT,
  columns,
}: TableSkeletonOverlayProps) {
  const { currentTheme } = useThemeContext();
  const theme = useTheme();

  const primaryColor =
    currentTheme?.primaryMain ||
    theme.palette.primary?.main ||
    TABLE_FALLBACK_THEME.primaryMain;
  const headerTint =
    currentTheme?.headerTint || alpha(primaryColor, 0.08);

  const widthPatterns = SKELETON_WIDTH_VARIATIONS;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: TABLE_OVERLAY_MIN_HEIGHT,
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {[...Array(rowCount)].map((_, rowIndex) => {
        const isOdd = rowIndex % 2 === 1;
        return (
          <Box
            key={rowIndex}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              height: SKELETON_ROW_HEIGHT,
              minHeight: SKELETON_ROW_HEIGHT,
              borderBottom: `1px solid ${alpha(primaryColor, 0.07)}`,
              bgcolor: isOdd ? alpha(headerTint, 0.22) : "transparent",
              gap: 2,
              boxSizing: "border-box",
            }}
          >
            {columns && columns.length > 0 ? (
              columns.map((col, colIndex) => {
                const widthPercent =
                  widthPatterns[
                    (rowIndex + colIndex) % widthPatterns.length
                  ];
                const isActionCol =
                  col.field === "actions" ||
                  (col.headerName &&
                    col.headerName.toLowerCase().includes("action"));

                return (
                  <Box
                    key={col.field || colIndex}
                    sx={{
                      flex: col.flex || (col.width ? undefined : 1),
                      width: col.width || undefined,
                      minWidth: col.minWidth || (col.width ? undefined : 60),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: isActionCol ? "center" : "flex-start",
                      boxSizing: "border-box",
                    }}
                  >
                    {isActionCol ? (
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <Skeleton
                          variant="circular"
                          animation="wave"
                          width={SKELETON_ACTION_ICON_SIZE}
                          height={SKELETON_ACTION_ICON_SIZE}
                          sx={{ bgcolor: alpha(primaryColor, 0.1) }}
                        />
                        <Skeleton
                          variant="circular"
                          animation="wave"
                          width={SKELETON_ACTION_ICON_SIZE}
                          height={SKELETON_ACTION_ICON_SIZE}
                          sx={{ bgcolor: alpha(primaryColor, 0.1) }}
                        />
                      </Stack>
                    ) : (
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        height={SKELETON_CELL_HEIGHT}
                        width={`${widthPercent}%`}
                        sx={{
                          bgcolor: alpha(primaryColor, 0.08),
                          borderRadius: "5px",
                        }}
                      />
                    )}
                  </Box>
                );
              })
            ) : (
              [...Array(columnCount)].map((_, colIndex) => {
                const widthPercent =
                  widthPatterns[
                    (rowIndex + colIndex) % widthPatterns.length
                  ];
                return (
                  <Box
                    key={colIndex}
                    sx={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    <Skeleton
                      variant="rounded"
                      animation="wave"
                      height={SKELETON_CELL_HEIGHT}
                      width={`${widthPercent}%`}
                      sx={{
                        bgcolor: alpha(primaryColor, 0.08),
                        borderRadius: "5px",
                      }}
                    />
                  </Box>
                );
              })
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default TableSkeletonOverlay;
