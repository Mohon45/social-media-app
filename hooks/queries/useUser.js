import { useQuery } from "@tanstack/react-query";
import { userAPI } from "../../api/endpoints/user";

export const useUserDetails = (userId) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => userAPI.getUserDetails(userId),
        enabled: !!userId,
    });
};
