"use client";

import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { useThemeContext } from "@/context/ThemeContext";

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
  rowCount = 7,
  columnCount = 6,
  columns,
}: TableSkeletonOverlayProps) {
  const { currentTheme } = useThemeContext();
  const theme = useTheme();

  const primaryColor =
    currentTheme?.primaryMain || theme.palette.primary?.main || "#6366f1";
  const headerTint = currentTheme?.headerTint || alpha(primaryColor, 0.08);

  // Column width variations for realistic tabular skeleton layout
  const defaultWidthPatterns = [65, 80, 50, 75, 45, 85, 60];

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 360,
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
              height: 52,
              minHeight: 52,
              borderBottom: `1px solid ${alpha(primaryColor, 0.07)}`,
              bgcolor: isOdd ? alpha(headerTint, 0.22) : "transparent",
              gap: 2,
              boxSizing: "border-box",
            }}
          >
            {columns && columns.length > 0 ? (
              columns.map((col, colIndex) => {
                const widthPercent =
                  defaultWidthPatterns[
                    (rowIndex + colIndex) % defaultWidthPatterns.length
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
                          width={24}
                          height={24}
                          sx={{ bgcolor: alpha(primaryColor, 0.1) }}
                        />
                        <Skeleton
                          variant="circular"
                          animation="wave"
                          width={24}
                          height={24}
                          sx={{ bgcolor: alpha(primaryColor, 0.1) }}
                        />
                      </Stack>
                    ) : (
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        height={18}
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
                  defaultWidthPatterns[
                    (rowIndex + colIndex) % defaultWidthPatterns.length
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
                      height={18}
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
