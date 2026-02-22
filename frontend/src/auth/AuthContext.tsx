import { createContext, useEffect, useState } from "react";
import type { AuthContextType, User } from "./types";

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
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("authUser");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
            setToken(token);
        }
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext; 