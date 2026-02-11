import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { postsAPI } from "../../api/endpoints/posts";

export const usePosts = (username = "") => {
    return useInfiniteQuery({
        queryKey: ["posts", username],
        queryFn: ({ pageParam = 1 }) =>
            postsAPI.getPosts({ pageParam, username }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content) => postsAPI.createPost(content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => {
            Toast.show({
                type: "error",
                text1: "Failed to create post",
                text2: error.message || "Please try again",
                position: "top",
            });
        },
    });
};

export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId) => postsAPI.likePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => {
            Toast.show({
                type: "error",
                text1: "Failed to like post",
                text2: error.message || "Please try again",
                position: "top",
            });
        },
    });
};

export const useUnlikePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId) => postsAPI.unlikePost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => {
            Toast.show({
                type: "error",
                text1: "Failed to unlike post",
                text2: error.message || "Please try again",
                position: "top",
            });
        },
    });
};
