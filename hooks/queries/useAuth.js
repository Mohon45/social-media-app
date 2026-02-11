import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../../api/endpoints/auth";
import { queryClient } from "../../providers/QueryProvider";
import { storage } from "../../utils/storage";

export const useLogin = () => {
    return useMutation({
        mutationFn: ({ email, password }) => authAPI.login(email, password),
        onSuccess: async (data) => {
            const user = data?.data;
            const token = data?.data?.token;
            const refreshToken = data?.data?.refreshToken;

            if (user && token) {
                await storage.saveToken(token);
                await storage.saveRefreshToken(refreshToken);
                await storage.saveUser(user);
                queryClient.invalidateQueries();
            } else {
                console.error("No valid user/token data in response:", data);
                throw new Error(
                    "Invalid response from server - missing user or token",
                );
            }
        },
        onError: (error) => {
            console.log("Login error:", error);
        },
    });
};

export const useSignup = () => {
    return useMutation({
        mutationFn: ({ firstName, lastName, email, password }) =>
            authAPI.signup(firstName, lastName, email, password),
        onSuccess: async (data) => {
            queryClient.invalidateQueries();
        },
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: () => authAPI.logout(),
        onSuccess: async () => {
            await storage.clearAll();
            queryClient.clear();
        },
    });
};
