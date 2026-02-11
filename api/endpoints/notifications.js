import apiClient from "../client";

export const notificationsAPI = {
    async registerDevice(fcmToken) {
        const response = await apiClient.post("/notifications/register", {
            fcmToken,
        });
        return response.data || response;
    },

    async getNotifications(params = {}) {
        const response = await apiClient.get("/notifications", { params });
        return response.data || response;
    },

    async markAsRead(notificationId) {
        const response = await apiClient.put(
            `/notifications/${notificationId}/read`,
        );
        return response.data || response;
    },

    async markAllAsRead() {
        const response = await apiClient.put("/notifications/read-all");
        return response.data || response;
    },
};
