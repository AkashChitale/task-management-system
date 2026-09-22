import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; 
import FullPageStatus from "../components/FullPageStatus";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated , isLoading} = useAuth();

    if(isLoading) {
        return (
            <FullPageStatus
                title="Checking your session…"
                message="We’re making sure your account is ready."
            />
        );                                             
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
