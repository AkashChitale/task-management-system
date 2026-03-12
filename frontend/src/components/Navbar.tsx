import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="app-navbar" aria-label="Main navigation">
            <span className="app-navbar__welcome">Welcome, {user?.username}</span>
            <button className="app-navbar__button" onClick={logout}>
                Logout
            </button>
        </nav>
    )
};