import { useEffect, useState } from "react";
import {
  FaCalendarCheck,
  FaExclamationTriangle,
  FaIdCard,
  FaUserCheck,
  FaUsers,
} from "react-icons/fa";

import Layout from "../components/Layout";
import { getDashboardSummary } from "../api/dashboardApi";

type DashboardSummary = {
  totalMembers: number;
  activeMembers: number;
  rfidAssigned: number;
  expiredMembers: number;
  todayAttendance: number;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalMembers: 0,
    activeMembers: 0,
    rfidAssigned: 0,
    expiredMembers: 0,
    todayAttendance: 0,
  });

  const loadSummary = async () => {
    const data = await getDashboardSummary();
    setSummary(data);
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <Layout title="Dashboard">
      <div className="cards dashboard-cards">
        <div className="stat-card blue">
          <div>
            <h3>Total Members</h3>
            <p>{summary.totalMembers}</p>
          </div>
          <FaUsers />
        </div>

        <div className="stat-card green">
          <div>
            <h3>Active Members</h3>
            <p>{summary.activeMembers}</p>
          </div>
          <FaUserCheck />
        </div>

        <div className="stat-card purple">
          <div>
            <h3>RFID Assigned</h3>
            <p>{summary.rfidAssigned}</p>
          </div>
          <FaIdCard />
        </div>

        <div className="stat-card orange">
          <div>
            <h3>Today Attendance</h3>
            <p>{summary.todayAttendance}</p>
          </div>
          <FaCalendarCheck />
        </div>

        <div className="stat-card red">
          <div>
            <h3>Expired Members</h3>
            <p>{summary.expiredMembers}</p>
          </div>
          <FaExclamationTriangle />
        </div>
      </div>

      <div className="panel">
        <h2>Quick Actions</h2>

        <div className="guide-grid">
          <div>
            <strong>Create Member</strong>
            <p>Register a new gym member and fill their detail data.</p>
          </div>

          <div>
            <strong>Assign RFID</strong>
            <p>Connect RFID card to member from the member detail page.</p>
          </div>

          <div>
            <strong>Attendance</strong>
            <p>Use card scan to record member attendance.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}