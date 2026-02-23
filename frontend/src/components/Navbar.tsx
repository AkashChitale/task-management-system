import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <nav style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
        {isAuthenticated ? (
            <>
            <span>Welcome, {user?.username}</span>
            <button onClick={logout} style={{ marginLeft: "12px" }}>
                Logout
            </button>
            </>
        ) : (
            <span>Not logged in</span>
        )}
        </nav>
    )
};