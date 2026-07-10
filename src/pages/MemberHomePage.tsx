import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaCalendarCheck,
  FaDumbbell,
  FaFire,
  FaHistory,
  FaQrcode,
  FaSignOutAlt,
} from "react-icons/fa";
import { getMemberDashboard } from "../api/memberPortalApi";

export default function MemberHomePage() {
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);

  const loadDashboard = async () => {
    const token = localStorage.getItem("memberToken");

    if (!token) {
        navigate("/login");
        return;
    }

    try {
        const data = await getMemberDashboard();
        setMember(data);
    } catch {
        localStorage.removeItem("memberToken");
        localStorage.removeItem("memberData");
        navigate("/member/login");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (!member) return null;

  const qrValue = member.qrToken || `ONYX-MEMBER-${member.userId}`;

  return (
    <div className="member-app">
      <header className="member-topbar">
        <div className="member-logo">
          <FaDumbbell />
          <span>Onyx Fit</span>
        </div>

        <button
          className="member-logout"
          onClick={() => {
            localStorage.removeItem("memberToken");
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          <FaSignOutAlt />
        </button>
      </header>

      <main className="member-container">
        <section className="member-hero">
          <p>Welcome back 👋</p>
          <h1>{member.fullName || member.username}</h1>
          <span>Ready for today&apos;s workout?</span>
        </section>

        <section className="member-pass-card">
          <div className="pass-title">
            <FaQrcode />
            <div>
              <h2>Your Gym Pass</h2>
              <p>Show this QR at reception</p>
            </div>
          </div>

          <div className="pass-qr">
            <QRCodeCanvas value={qrValue} size={230} />
          </div>

          <code>{qrValue}</code>
        </section>

        <section className="member-status-card">
          <div>
            <span>Status</span>
            <strong
              className={
                member.status === 1 ? "active-text" : "inactive-text"
              }
            >
              {member.status === 1 ? "Active" : "Inactive"}
            </strong>
          </div>

          <div>
            <span>Expires</span>
            <strong>{member.memberExpiredDate || "-"}</strong>
          </div>
        </section>

        <section className="member-stats-row">
          <div>
            <FaFire />
            <strong>{member.currentStreak}</strong>
            <span>Streak</span>
          </div>

          <div>
            <FaCalendarCheck />
            <strong>{member.visitThisMonth}</strong>
            <span>This Month</span>
          </div>

          <div>
            <FaDumbbell />
            <strong>{member.totalVisit}</strong>
            <span>Total Visits</span>
          </div>
        </section>

        <section className="member-activity-card">
          <div className="activity-title">
            <FaHistory />
            <h2>Recent Attendance</h2>
          </div>

          {member.recentAttendance.length === 0 ? (
            <div className="empty-state">No attendance yet.</div>
          ) : (
            <div className="activity-list">
              {member.recentAttendance.map((item: any, index: number) => (
                <div className="activity-row" key={index}>
                  <span className="activity-dot" />
                  <div>
                    <strong>{item.date}</strong>
                    <p>Check in</p>
                  </div>
                  <b>{item.time}</b>
                </div>
              ))}
            </div>
          )}

          <button className="member-full-btn">
            View Attendance History
          </button>
        </section>
      </main>
    </div>
  );
}