import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaDumbbell } from "react-icons/fa";
import api from "../api/api";

export default function MemberLoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear stale member session when entering login page
    navigate("/member/home");
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setLoading(true);

      const response = await api.post("/auth/member-login", {
        identifier,
        password,
      });

      localStorage.setItem("memberToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      console.log("Member login successful:", response.data);
      console.log("Stored memberToken:", localStorage.getItem("memberToken"));
      navigate("/member/home");
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Member login failed"
      );
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="member-login-page">
      <div className="member-login-shell">
        <div className="member-login-left">
          <div className="member-login-logo">
            <FaDumbbell />
          </div>

          <h1>Onyx Fit</h1>
          <p>
            Access your membership, QR check-in, and training attendance from
            your personal member portal.
          </p>
        </div>

        <form className="member-login-card" onSubmit={login}>
          <span className="member-login-pill">Member Portal</span>

          <h2>Welcome back</h2>
          <p>Login using your username or email.</p>

          {errorMessage && (
            <div className="login-error-message">
              {errorMessage}
            </div>
          )}

          <label>Username / Email</label>
          <input
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="member@mail.com"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            className="member-back-btn"
            onClick={() => navigate("/")}
          >
            Back to Landing Page
          </button>
        </form>
      </div>
    </div>
  );
}