import apiClient from "../client";

export const commentsAPI = {
    async getComments(postId) {
        const response = await apiClient.get(`/posts/${postId}/comments`, {
            params: { filter_post: `${postId}` },
        });
        return response.data || response.comments || [];
    },

    async addComment(postId, content) {
        const response = await apiClient.post(`/posts/${postId}/comment`, {
            content,
        });
        return response.data || response;
    },
};
