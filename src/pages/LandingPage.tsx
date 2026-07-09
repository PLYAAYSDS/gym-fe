import { useNavigate } from "react-router-dom";
import {
  FaChartLine,
  FaDumbbell,
  FaIdCard,
  FaQrcode,
  FaUsers,
} from "react-icons/fa";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="onyx-landing">
      <header className="onyx-nav">
        <div className="onyx-brand">
          <div className="onyx-logo">
            <FaDumbbell />
          </div>
          <span>Onyx Fit</span>
        </div>

        <div className="onyx-nav-actions">
          <button onClick={() => navigate("/login")}>
            Member Login
          </button>
          <button
            className="onyx-secondary-btn"
            onClick={() => navigate("/admin/login")}
          >
            Admin Login
          </button>
        </div>
      </header>

      <section className="onyx-hero">
        <div className="onyx-hero-text">
          <span className="onyx-pill">Smart Fitness Access</span>

          <h1>
            Train stronger,
            <br />
            check in faster.
          </h1>

          <p>
            Onyx Fit is a modern gym experience with RFID attendance,
            QR check-in, membership tracking, and member activity history.
          </p>

          <div className="onyx-hero-actions">
            <button onClick={() => navigate("/login")}>
              Member Login
            </button>
            <button
              className="onyx-outline-btn"
              onClick={() => navigate("/admin/login")}
            >
              Admin Portal
            </button>
          </div>
        </div>

        <div className="onyx-hero-card">
          <div className="onyx-orbit">
            <FaDumbbell />
          </div>

          <h2>Onyx Fit</h2>
          <p>Membership • Attendance • Access</p>

          <div className="onyx-mini-stats">
            <div>
              <strong>RFID</strong>
              <span>Fast check-in</span>
            </div>
            <div>
              <strong>QR</strong>
              <span>Mobile access</span>
            </div>
          </div>
        </div>
      </section>

      <section className="onyx-features">
        <div className="onyx-section-title">
          <span>Features</span>
          <h2>Everything your gym needs to move smoothly.</h2>
        </div>

        <div className="onyx-feature-grid">
          <div className="onyx-feature-card">
            <FaIdCard />
            <h3>RFID Check-in</h3>
            <p>Members tap their card and attendance is recorded instantly.</p>
          </div>

          <div className="onyx-feature-card">
            <FaQrcode />
            <h3>QR Check-in</h3>
            <p>Members can use QR code access from their own portal.</p>
          </div>

          <div className="onyx-feature-card">
            <FaUsers />
            <h3>Member Management</h3>
            <p>Manage profile, membership status, RFID card, and expiry date.</p>
          </div>

          <div className="onyx-feature-card">
            <FaChartLine />
            <h3>Attendance History</h3>
            <p>Track visits and see attendance history in a calendar view.</p>
          </div>
        </div>
      </section>

      <section className="onyx-cta">
        <h2>Ready to train at Onyx Fit?</h2>
        <p>Login to your member portal and access your gym check-in QR.</p>
        <button onClick={() => navigate("/member/login")}>
          Go to Member Login
        </button>
      </section>
    </div>
  );
}