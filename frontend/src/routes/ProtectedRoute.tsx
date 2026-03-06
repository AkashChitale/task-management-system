import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated , isLoading} = useAuth();

    if(isLoading) {
        return <p>Checking Authentication...</p>                                               
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
