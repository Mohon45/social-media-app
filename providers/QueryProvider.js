import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../constants/config";

// Create a client
const queryClient = new QueryClient(config.queryClient);

export const QueryProvider = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export { queryClient };
