import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { notificationsAPI } from "../../api/endpoints/notifications";

export const useNotificationsQuery = () => {
    return useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: ({ pageParam = 1 }) =>
            notificationsAPI.getNotifications({ page: pageParam, limit: 20 }),
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (notificationId) =>
            notificationsAPI.markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
        onError: (error) => {
            Toast.show({
                type: "error",
                text1: "Failed to mark notification",
                text2: error.message || "Please try again",
                position: "top",
            });
        },
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationsAPI.markAllAsRead(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            Toast.show({
                type: "success",
                text1: "All notifications marked as read",
                position: "top",
                visibilityTime: 2000,
            });
        },
        onError: (error) => {
            Toast.show({
                type: "error",
                text1: "Failed to mark all as read",
                text2: error.message || "Please try again",
                position: "top",
            });
        },
    });
};
