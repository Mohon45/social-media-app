export const config = {
    api: {
        baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
        timeout: 10000,
    },
    firebase: {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    },
    posts: {
        perPage: 10,
        maxLength: 500,
        minLength: 1,
    },
    queryClient: {
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60, // 1 minute
                cacheTime: 1000 * 60 * 5, // 5 minutes
                retry: 2,
                refetchOnWindowFocus: true,
            },
            mutations: {
                retry: 1,
            },
        },
    },
};
