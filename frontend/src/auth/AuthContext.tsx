import { createContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "./types";
import { getCurrentUser } from "../api/auth.api";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [accessToken, setToken] = useState<string | null>(null);

    const login = (accessToken: string, user: User) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("authUser", JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authUser");
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
    };

    useEffect(() => {
        const validateAuth = async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const user = await getCurrentUser(); // NOTE: .. from /users/me user email, username only returned, not accessToken and refreshToken.
            setUser(user);
            setIsAuthenticated(true);
            setToken(token);
            console.log("User authenticated from backend:", user);
        } catch (error) {
            // token invalid / expired
            console.log("Token Expired or may be invalid");
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    validateAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext; 