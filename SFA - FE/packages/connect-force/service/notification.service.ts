import axiosInstance from "@/utils/axios";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5281/api/";
const baseUrl = "notification";

export interface NotificationItem {
  notificationId: number;
  notificationUId: string;
  recipientUserId: number;
  senderUserId?: number;
  category: string;
  notificationType: string;
  title: string;
  message: string;
  actionUrl?: string;
  metadataJson?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface UnreadCountResponse {
  count: number;
}

/**
 * Fetch paginated notifications for the current user
 */
export const getUserNotifications = async (
  onlyUnread = false,
  pageNumber = 1,
  pageSize = 30
): Promise<NotificationItem[]> => {
  try {
    const params = new URLSearchParams({
      onlyUnread: onlyUnread.toString(),
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    const response = await axiosInstance.get(`${NEXT_PUBLIC_API_URL}${baseUrl}?${params.toString()}`);
    // Check if wrapped in entity property or direct result
    const notifications = response.data?.notifications || response.data?.items || response.data?.result || response.data || [];
    return Array.isArray(notifications) ? notifications : [];
  } catch (error) {
    console.error("[NotificationService] Failed to fetch notifications:", error);
    return [];
  }
};

/**
 * Fetch scalar unread notification count
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get(`${NEXT_PUBLIC_API_URL}${baseUrl}/unread-count`);
    const count = response.data?.count ?? response.data?.result?.count ?? (typeof response.data === 'number' ? response.data : 0);
    return typeof count === 'number' ? count : 0;
  } catch (error) {
    console.error("[NotificationService] Failed to fetch unread count:", error);
    return 0;
  }
};

/**
 * Mark a single notification or all notifications as read
 */
export const markNotificationAsRead = async (
  notificationId?: number,
  markAll = false
): Promise<number> => {
  try {
    const response = await axiosInstance.post(`${NEXT_PUBLIC_API_URL}${baseUrl}/mark-read`, {
      notificationId: notificationId || null,
      markAll,
    });
    const remaining = response.data?.count ?? response.data?.result?.count ?? 0;
    return typeof remaining === 'number' ? remaining : 0;
  } catch (error) {
    console.error("[NotificationService] Failed to mark as read:", error);
    return 0;
  }
};
