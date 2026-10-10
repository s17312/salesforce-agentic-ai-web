"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { getSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import {
  NotificationItem,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "@/service/notification.service";
import { Button } from "@mui/material";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  isNotificationOpen: boolean;
  hasNewPulse: boolean;
  activeFilterTab: "all" | "unread";
  setActiveFilterTab: (tab: "all" | "unread") => void;
  openNotificationDrawer: () => void;
  closeNotificationDrawer: () => void;
  markAsRead: (notificationId?: number, markAll?: boolean) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [hasNewPulse, setHasNewPulse] = useState<boolean>(false);
  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "unread">("all");
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const openNotificationDrawer = useCallback(() => {
    setIsNotificationOpen(true);
    setHasNewPulse(false);
  }, []);

  const closeNotificationDrawer = useCallback(() => {
    setIsNotificationOpen(false);
  }, []);

  // Fetch notifications & unread badge count from REST API
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [list, count] = await Promise.all([
        getUserNotifications(false, 1, 40),
        getUnreadNotificationCount(),
      ]);
      setNotifications(list);
      setUnreadCount(count);
    } catch (err) {
      console.error("[NotificationContext] Failed to load notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize SignalR Hub Connection
  useEffect(() => {
    let isMounted = true;

    const startSignalR = async () => {
      try {
        const session = await getSession();
        if (!session?.accessToken) return;

        const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5281/api/";
        const apiBase = rawApiUrl.replace(/\/api\/?$/, "");
        const hubUrl = `${apiBase}/hubs/notifications`;

        const connection = new signalR.HubConnectionBuilder()
          .withUrl(hubUrl, {
            accessTokenFactory: async () => {
              const currentSession = await getSession();
              return currentSession?.accessToken || "";
            },
            transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
          .configureLogging(signalR.LogLevel.Warning)
          .build();

        // Listen for new real-time notifications
        connection.on("ReceiveNotification", (newItem: NotificationItem) => {
          if (!isMounted) return;

          setNotifications((prev) => [newItem, ...prev.filter((n) => n.notificationId !== newItem.notificationId)]);
          setUnreadCount((prev) => prev + 1);
          setHasNewPulse(true);

          // Trigger toast notification with Quick View button
          enqueueSnackbar(newItem.title, {
            variant: "info",
            autoHideDuration: 5000,
            anchorOrigin: { vertical: "top", horizontal: "right" },
            action: (key) => (
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  openNotificationDrawer();
                }}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#0a0d2c",
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  py: 0.2,
                  px: 1,
                  "&:hover": { bgcolor: "#f0f2ff" },
                }}
              >
                View
              </Button>
            ),
          });

          // Reset pulse state after 5 seconds
          setTimeout(() => {
            if (isMounted) setHasNewPulse(false);
          }, 5000);
        });

        // Listen for unread count sync
        connection.on("UpdateUnreadCount", (newCount: number) => {
          if (!isMounted) return;
          setUnreadCount(newCount);
        });

        await connection.start();
        connectionRef.current = connection;

        // Load initial data once connected
        loadData();
      } catch (err) {
        console.warn("[NotificationContext] SignalR connection attempt failed (will retry or fallback to REST):", err);
        // Fallback to loading data via REST even if SignalR is down or initializing
        loadData();
      }
    };

    startSignalR();

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [loadData, openNotificationDrawer]);

  // Mark single notification or all notifications as read
  const handleMarkAsRead = async (notificationId?: number, markAll = false) => {
    try {
      const remainingCount = await markNotificationAsRead(notificationId, markAll);
      setUnreadCount(remainingCount);

      setNotifications((prev) =>
        prev.map((item) => {
          if (markAll || item.notificationId === notificationId) {
            return { ...item, isRead: true, readAt: new Date().toISOString() };
          }
          return item;
        })
      );
    } catch (err) {
      console.error("[NotificationContext] Failed to mark notification as read:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        isNotificationOpen,
        hasNewPulse,
        activeFilterTab,
        setActiveFilterTab,
        openNotificationDrawer,
        closeNotificationDrawer,
        markAsRead: handleMarkAsRead,
        refreshNotifications: loadData,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: [] as NotificationItem[],
      unreadCount: 0,
      isLoading: false,
      isNotificationOpen: false,
      hasNewPulse: false,
      activeFilterTab: "all" as const,
      setActiveFilterTab: () => {},
      openNotificationDrawer: () => {},
      closeNotificationDrawer: () => {},
      markAsRead: async () => {},
      refreshNotifications: async () => {},
    };
  }
  return context;
};
