import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { commentsAPI } from "../../api/endpoints/comments";

export const useComments = (postId) => {
    return useQuery({
        queryKey: ["comments", postId],
        queryFn: () => commentsAPI.getComments(postId),
        enabled: !!postId,
    });
};

export const useAddComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, content }) =>
            commentsAPI.addComment(postId, content),
        onSuccess: (data, { postId }) => {
            queryClient.invalidateQueries({ queryKey: ["comments", postId] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: (error) => {
            Toast.show({
                type: "error",
                text1: "Failed to add comment",
                text2: error.message || "Please try again",
                position: "top",
            });
        },
    });
};
