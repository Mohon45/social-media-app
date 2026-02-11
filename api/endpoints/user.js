import apiClient from "../client";

export const userAPI = {
    getUserDetails: (userId) => apiClient.get(`/user/details/${userId}`),
    updateProfile: (userId, data) => apiClient.put(`/user/${userId}`, data),
};
