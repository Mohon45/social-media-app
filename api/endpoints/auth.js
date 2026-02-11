import apiClient from "../client";

export const authAPI = {
    async login(email, password) {
        const response = await apiClient.post("/auth/login", {
            email,
            password,
        });
        return response;
    },

    async signup(firstName, lastName, email, password) {
        const response = await apiClient.post("/auth/register", {
            firstName,
            lastName,
            email,
            password,
        });
        return response;
    },

    async logout() {
        // Optional: call backend to invalidate token
        const response = await apiClient.post("/auth/logout");
        return response;
    },
};
