import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDumbbell } from "react-icons/fa";
import api from "../api/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        identifier,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-logo">
          <FaDumbbell />
        </div>
        <h1>Onyx fit</h1>
        <p>Smart gym attendance and member management system.</p>
      </div>

      <form className="login-card" onSubmit={login}>
        <h2>Welcome Back</h2>
        <p>Login using username or email.</p>

        <label>Username / Email</label>
        <input
          placeholder="admin or admin@mail.com"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <label>Password</label>
        <input
          placeholder="Your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}