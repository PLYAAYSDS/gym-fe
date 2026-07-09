import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../components/Layout";
import CardScannerModal from "../components/CardScanner/CardScannerModal";
import { getMemberDetail, extendMembership, getMemberAttendanceHistory, } from "../api/memberApi";


type MemberDetail = {
  userId: number;
  username: string;
  email: string;
  uid?: string;
  role?: number;
  status?: number;
  memberExpiredDate?: string;
  photoUrl?: string;
  detail?: {
    fullName?: string;
    phoneNumber?: string;
    birthDate?: string;
    address?: string;
    emergencyContact?: string;
  } | null;
};

export default function MemberDetailPage() {
  const { userId } = useParams();
  const [newExpiredDate, setNewExpiredDate] = useState("");
  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const today = new Date();

  const [calendarMonth, setCalendarMonth] = useState(today.getMonth() + 1);
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  const loadDetail = async () => {
    if (!userId) return;

    const data = await getMemberDetail(Number(userId));
    setMember(data);
  };

  const loadAttendance = async () => {
  if (!userId) return;

  const data = await getMemberAttendanceHistory(
      Number(userId),
      calendarMonth,
      calendarYear,
    );

    setAttendanceDates(data.map((item: any) => item.attendanceDate));
  };

  useEffect(() => {
    loadDetail();
    loadAttendance();
  }, [userId, calendarMonth, calendarYear]);

  if (!member) {
    return (
      <Layout title="Member Detail">
        <div className="panel">Loading member detail...</div>
      </Layout>
    );
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);

  const submitExtendMembership = async () => {
    if (!newExpiredDate || !member) {
      alert("Please select new expired date");
      return;
    }

    await extendMembership(member.userId, newExpiredDate);

    alert("Membership extended successfully");

    setNewExpiredDate("");
    await loadDetail();
  };

  return (
    <Layout title="Member Detail">
      <div className="member-detail-grid">
        <div className="panel">
          <h2>Member Information</h2>

          <div className="detail-row">
            <span>User ID</span>
            <strong>{member.userId}</strong>
          </div>

          <div className="detail-row">
            <span>Username</span>
            <strong>{member.username}</strong>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <strong>{member.email}</strong>
          </div>

          <div className="detail-row">
            <span>Full Name</span>
            <strong>{member.detail?.fullName || "-"}</strong>
          </div>

          <div className="detail-row">
            <span>Phone Number</span>
            <strong>{member.detail?.phoneNumber || "-"}</strong>
          </div>

          <div className="detail-row">
            <span>Birth Date</span>
            <strong>{member.detail?.birthDate || "-"}</strong>
          </div>

          <div className="detail-row">
            <span>Emergency Contact</span>
            <strong>{member.detail?.emergencyContact || "-"}</strong>
          </div>

          <div className="detail-row">
            <span>Address</span>
            <strong>{member.detail?.address || "-"}</strong>
          </div>
        </div>

        <div className="panel">
          <h2>Membership Card</h2>

          <div
            className={
              member.uid ? "rfid-status connected" : "rfid-status empty"
            }
          >
            <p>{member.uid ? "Card Connected" : "No Card Connected"}</p>
            <strong>{member.uid || "Waiting for card"}</strong>
          </div>

          <button type="button" onClick={() => setScannerOpen(true)}>
            {member.uid ? "Replace Card" : "Sign Card"}
          </button>
        </div>
      </div>

      <div className="panel">
        <h2>Extend Membership</h2>

        <p className="muted">
          Current expired date:{" "}
          <strong>{member.memberExpiredDate || "-"}</strong>
        </p>

        <input
          type="date"
          value={newExpiredDate}
          onChange={(e) => setNewExpiredDate(e.target.value)}
        />

        <button type="button" onClick={submitExtendMembership}>
          Extend Membership
        </button>
      </div>

      <div className="panel attendance-calendar-panel">
      <div className="calendar-header">
        <h2>Attendance Calendar</h2>

        <div className="calendar-controls">
          <select
            value={calendarMonth}
            onChange={(e) => setCalendarMonth(Number(e.target.value))}
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={calendarYear}
            onChange={(e) => setCalendarYear(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;

          const month = String(calendarMonth).padStart(2, "0");
          const date = String(day).padStart(2, "0");

          const fullDate = `${calendarYear}-${month}-${date}`;
          const checkedIn = attendanceDates.includes(fullDate);

          return (
            <div
              key={fullDate}
              className={checkedIn ? "calendar-day checked" : "calendar-day"}
            >
              <span>{day}</span>
            </div>
          );
        })}
      </div>
    </div>

      <CardScannerModal
        open={scannerOpen}
        userId={member.userId}
        currentUid={member.uid}
        onClose={() => setScannerOpen(false)}
        onSuccess={loadDetail}
      />
    </Layout>
  );
}