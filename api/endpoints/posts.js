import apiClient from "../client";

export const postsAPI = {
    async getPosts({ pageParam = 1, username = "" }) {
        const params = {
            page: pageParam,
            limit: 10,
        };
        if (username) {
            params.searchTerm = username?.username;
            params.searchFields = ["username"];
        }

        const response = await apiClient.get("/posts", { params });
        return response?.data;
    },

    async createPost(content) {
        const response = await apiClient.post("/posts", { content });
        return response.data || response;
    },

    async likePost(postId) {
        const response = await apiClient.post(`/posts/${postId}/like`);
        return response.data || response;
    },

    async unlikePost(postId) {
        const response = await apiClient.delete(`/posts/${postId}/like`);
        return response.data || response;
    },
};
