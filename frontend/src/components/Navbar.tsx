import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const username = user?.username?.trim() || "User";
    const initial = username.charAt(0).toUpperCase();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="app-navbar" aria-label="Main navigation">
            <div className="app-navbar__inner">
                <div className="app-navbar__user">
                    <span className="app-navbar__avatar" aria-hidden="true">{initial}</span>
                    <div className="app-navbar__text">
                        <span className="app-navbar__label">Welcome back</span>
                        <span className="app-navbar__welcome">{username}</span>
                    </div>
                </div>

                <button className="app-navbar__button" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    )
};