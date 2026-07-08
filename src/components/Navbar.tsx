import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div>
        <strong>Gym Management System</strong>
        <span>Onyx Fit dashboard</span>
      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </header>
  );
}