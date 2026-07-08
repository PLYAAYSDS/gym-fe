import Layout from "../components/Layout";
import { FaCalendarCheck, FaIdCard, FaUsers } from "react-icons/fa";

export default function DashboardPage() {
  return (
    <Layout title="Dashboard">
      <div className="cards">
        <div className="stat-card blue">
          <div>
            <h3>Total Members</h3>
            <p>0</p>
          </div>
          <FaUsers />
        </div>

        <div className="stat-card green">
          <div>
            <h3>Active Cards</h3>
            <p>0</p>
          </div>
          <FaIdCard />
        </div>

        <div className="stat-card orange">
          <div>
            <h3>Today Attendance</h3>
            <p>0</p>
          </div>
          <FaCalendarCheck />
        </div>
      </div>

      <div className="panel">
        <h2>Quick Guide</h2>
        <div className="guide-grid">
          <div>
            <strong>1. Create Member</strong>
            <p>Register member account and personal detail.</p>
          </div>
          <div>
            <strong>2. Assign RFID</strong>
            <p>Connect member account with RFID card UID.</p>
          </div>
          <div>
            <strong>3. Check In</strong>
            <p>Scan RFID card to record gym attendance.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}