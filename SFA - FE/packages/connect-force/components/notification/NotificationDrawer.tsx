"use client";

import React, { useMemo } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNotificationContext } from "@/context/NotificationContext";
import { useThemeContext } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { NotificationItem } from "@/service/notification.service";

// Format ISO date string into human-friendly relative time
function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  } catch {
    return "";
  }
}

// Get category icon and badge color
function getCategoryMeta(category: string, type: string) {
  const cat = (category || "").toLowerCase();
  const typ = (type || "").toLowerCase();

  if (cat.includes("sale") || typ.includes("order")) {
    return {
      icon: <ShoppingCartIcon fontSize="small" sx={{ color: "#4f46e5" }} />,
      bgColor: "#eef2ff",
      label: "Sales",
    };
  }
  if (cat.includes("inventory") || cat.includes("stock") || typ.includes("stock")) {
    return {
      icon: <Inventory2Icon fontSize="small" sx={{ color: "#d97706" }} />,
      bgColor: "#fef3c7",
      label: "Inventory",
    };
  }
  if (cat.includes("approval") || typ.includes("approved")) {
    return {
      icon: <CheckCircleOutlineIcon fontSize="small" sx={{ color: "#059669" }} />,
      bgColor: "#d1fae5",
      label: "Approval",
    };
  }
  if (cat.includes("credit") || typ.includes("warning") || typ.includes("alert")) {
    return {
      icon: <WarningAmberIcon fontSize="small" sx={{ color: "#dc2626" }} />,
      bgColor: "#fee2e2",
      label: "Alert",
    };
  }
  return {
    icon: <InfoOutlinedIcon fontSize="small" sx={{ color: "#2563eb" }} />,
    bgColor: "#eff6ff",
    label: "General",
  };
}

export default function NotificationDrawer() {
  const router = useRouter();
  const { currentTheme } = useThemeContext();
  const {
    notifications,
    unreadCount,
    isLoading,
    isNotificationOpen,
    activeFilterTab,
    setActiveFilterTab,
    closeNotificationDrawer,
    markAsRead,
    refreshNotifications,
  } = useNotificationContext();

  // Filtered list based on active tab
  const displayedNotifications = useMemo(() => {
    if (activeFilterTab === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeFilterTab]);

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.notificationId);
    }
    if (item.actionUrl) {
      closeNotificationDrawer();
      router.push(item.actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    await markAsRead(undefined, true);
  };

  return (
    <Drawer
      anchor="right"
      open={isNotificationOpen}
      onClose={closeNotificationDrawer}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 400 },
          bgcolor: "#ffffff",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header Bar matching Active Theme */}
      <Box
        sx={{
          bgcolor: currentTheme?.sidebarBg || "#131529",
          color: "#ffffff",
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background-color 0.3s ease",
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <NotificationsIcon sx={{ color: "#ffffff", fontSize: "1.35rem" }} />
          <Typography variant="h6" fontWeight={800} sx={{ fontSize: "1.15rem", letterSpacing: "-0.2px" }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} New`}
              size="small"
              sx={{
                bgcolor: "#ef4444",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.7rem",
                height: 22,
              }}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <Tooltip title="Refresh">
            <IconButton onClick={refreshNotifications} size="small" sx={{ color: "#ffffff" }}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={closeNotificationDrawer} size="small" sx={{ color: "#ffffff" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Tabs & Mark All Actions */}
      <Box
        sx={{
          px: 2,
          pt: 1.2,
          pb: 1,
          borderBottom: "1px solid #f0f0f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#fafbff",
        }}
      >
        <Tabs
          value={activeFilterTab}
          onChange={(_, val) => setActiveFilterTab(val)}
          sx={{
            minHeight: 34,
            "& .MuiTab-root": {
              minHeight: 34,
              py: 0.5,
              px: 1.5,
              textTransform: "none",
              fontSize: "0.825rem",
              fontWeight: 700,
              borderRadius: "6px",
              minWidth: "auto",
              color: "#6b7280",
              "&.Mui-selected": {
                color: currentTheme?.primaryMain || "#4f46e5",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: currentTheme?.primaryMain || "#4f46e5",
              height: 3,
              borderRadius: "2px",
            },
          }}
        >
          <Tab label={`All (${notifications.length})`} value="all" />
          <Tab label={`Unread (${unreadCount})`} value="unread" />
        </Tabs>

        {unreadCount > 0 && (
          <Button
            size="small"
            startIcon={<DoneAllIcon sx={{ fontSize: "1rem !important" }} />}
            onClick={handleMarkAllRead}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: currentTheme?.primaryMain || "#4f46e5",
              py: 0.4,
              px: 1,
              borderRadius: "6px",
              "&:hover": { bgcolor: "rgba(79, 70, 229, 0.08)" },
            }}
          >
            Mark all read
          </Button>
        )}
      </Box>

      {/* Notifications Feed */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          bgcolor: "#fcfdff",
          "&::-webkit-scrollbar": { width: 5 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.12)",
            borderRadius: 3,
          },
        }}
      >
        {isLoading && notifications.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 260 }}>
            <CircularProgress size={32} sx={{ color: currentTheme?.primaryMain || "#4f46e5" }} />
          </Box>
        ) : displayedNotifications.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 320,
              px: 3,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <NotificationsNoneIcon sx={{ fontSize: 32, color: "#9ca3af" }} />
            </Box>
            <Typography variant="subtitle1" fontWeight={700} color="#1f2937">
              {activeFilterTab === "unread" ? "No unread notifications" : "No notifications yet"}
            </Typography>
            <Typography variant="body2" color="#6b7280" sx={{ mt: 0.5, maxWidth: 240 }}>
              {activeFilterTab === "unread"
                ? "You're all caught up! Check the 'All' tab for history."
                : "Operational alerts, order approvals, and stock updates will appear here."}
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0.5} sx={{ p: 1.5 }}>
            {displayedNotifications.map((item) => {
              const meta = getCategoryMeta(item.category, item.notificationType);
              return (
                <Box
                  key={item.notificationId}
                  onClick={() => handleItemClick(item)}
                  sx={{
                    p: 1.6,
                    borderRadius: "10px",
                    bgcolor: item.isRead ? "#ffffff" : "rgba(238, 242, 255, 0.55)",
                    border: item.isRead ? "1px solid #f0f2f5" : "1px solid rgba(79, 70, 229, 0.2)",
                    boxShadow: item.isRead ? "0 1px 3px rgba(0,0,0,0.02)" : "0 2px 6px rgba(79,70,229,0.06)",
                    cursor: "pointer",
                    position: "relative",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: item.isRead ? "#f9fafb" : "rgba(238, 242, 255, 0.85)",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    {/* Category Icon Badge */}
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "8px",
                        bgcolor: meta.bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {meta.icon}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={item.isRead ? 600 : 800}
                          noWrap
                          sx={{
                            color: item.isRead ? "#374151" : "#111827",
                            fontSize: "0.875rem",
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#9ca3af",
                            fontSize: "0.7rem",
                            flexShrink: 0,
                          }}
                        >
                          {formatRelativeTime(item.createdAt)}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#6b7280",
                          fontSize: "0.8rem",
                          lineHeight: 1.4,
                          mt: 0.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.message}
                      </Typography>

                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }}>
                        <Chip
                          label={meta.label}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            bgcolor: meta.bgColor,
                            color: "#374151",
                          }}
                        />

                        {item.actionUrl && (
                          <Stack direction="row" spacing={0.3} alignItems="center">
                            <Typography
                              variant="caption"
                              fontWeight={700}
                              sx={{
                                color: currentTheme?.primaryMain || "#4f46e5",
                                fontSize: "0.72rem",
                              }}
                            >
                              View Details
                            </Typography>
                            <ArrowForwardIosIcon
                              sx={{
                                fontSize: "0.6rem",
                                color: currentTheme?.primaryMain || "#4f46e5",
                              }}
                            />
                          </Stack>
                        )}
                      </Stack>
                    </Box>

                    {/* Unread Indicator Dot */}
                    {!item.isRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: currentTheme?.primaryMain || "#4f46e5",
                          flexShrink: 0,
                          mt: 0.8,
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Drawer Footer */}
      <Box
        sx={{
          p: 1.5,
          px: 2,
          borderTop: "1px solid #f0f0f5",
          bgcolor: "#fafbff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="caption" color="#6b7280" fontWeight={600}>
          {notifications.length} Total Notifications
        </Typography>

        {unreadCount > 0 && (
          <Button
            size="small"
            variant="text"
            onClick={handleMarkAllRead}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: currentTheme?.primaryMain || "#4f46e5",
            }}
          >
            Clear All Unread
          </Button>
        )}
      </Box>
    </Drawer>
  );
}
