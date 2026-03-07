import { createContext, useEffect, useState, useRef } from "react";
import type { AuthContextType, User } from "./types";
import { getCurrentUser } from "../api/auth.api";
import { toast } from "sonner";
import { getUserFriendlyError } from "../utils/errorMessages";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const login = (accessToken: string, user: User) => {
        // Cancel any pending validation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("authUser", JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Cancel any pending validation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authUser");
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const validateAuth = async () => {
        const token = localStorage.getItem("accessToken") || null;

        if (!token) {
            setIsLoading(false);
            return;
        }

        // Create new AbortController for this validation
        abortControllerRef.current = new AbortController();

        try {
            const user = await getCurrentUser(abortControllerRef.current.signal);
            setUser(user);
            setIsAuthenticated(true);
        } catch (error: any) {
            // Only handle non-aborted errors
            const friendlyMessage = getUserFriendlyError(error);
            if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    logout();
                }
                toast.error(friendlyMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };  

    validateAuth();
    
    return () => {
        // Cleanup: cancel validation on unmount
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext; 