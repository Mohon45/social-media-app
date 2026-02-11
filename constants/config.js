export const config = {
    api: {
        baseURL: process.env.API_BASE_URL,
        timeout: 10000,
    },
    firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
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
