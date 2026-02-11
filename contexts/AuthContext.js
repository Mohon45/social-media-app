import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for stored auth on mount
    useEffect(() => {
        checkStoredAuth();
    }, []);

    const checkStoredAuth = async () => {
        try {
            const storedUser = await storage.getUser();

            if (storedUser) {
                setUser(storedUser);
            }
        } catch (error) {
            console.error("Error checking stored auth:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData) => {
        setUser(userData);
        await storage.saveUser(userData);
    };

    const signup = async (userData) => {
        setUser(userData);
        await storage.saveUser(userData);
    };

    const logout = async () => {
        setUser(null);
        await storage.clearAll();
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
