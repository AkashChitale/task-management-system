import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/auth.api";
import { useAuth } from "../hooks/useAuth";
import { getUserFriendlyError, isValidEmail, validatePassword } from "../utils/errorMessages";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Input validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message!);
      setLoading(false);
      return;
    }

    try {
      const data = await loginRequest({ email, password });
      login(data.accessToken, data.user);
      navigate("/todos");
    } catch (err: any) {
      setError(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }} role="alert">{error}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        aria-required="true"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        aria-required="true"
      />

      <button disabled={loading} type="submit">
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginPage;