import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../components/Layout";
import CardScannerModal from "../components/CardScanner/CardScannerModal";

import {
  extendMembership,
  getMemberAttendanceHistory,
  getMemberDetail,
} from "../api/memberApi";

import type { MembershipDurationType } from "../api/memberApi";

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

type AttendanceItem = {
  attendanceDate: string;
  attendanceTime?: string;
};

const MONTH_NAMES = [
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
];

export default function MemberDetailPage() {
  const { userId } = useParams();

  const today = new Date();

  const [member, setMember] = useState<MemberDetail | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  const [attendanceDates, setAttendanceDates] = useState<string[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(
    today.getMonth() + 1,
  );
  const [calendarYear, setCalendarYear] = useState(
    today.getFullYear(),
  );

  const [durationType, setDurationType] =
    useState<MembershipDurationType>("MONTH");

  const [duration, setDuration] = useState(1);
  const [extendLoading, setExtendLoading] = useState(false);
  const [extendError, setExtendError] = useState("");

  const loadDetail = async () => {
    if (!userId) return;

    const data = await getMemberDetail(Number(userId));
    setMember(data);
  };

  const loadAttendance = async () => {
    if (!userId) return;

    const data: AttendanceItem[] =
      await getMemberAttendanceHistory(
        Number(userId),
        calendarMonth,
        calendarYear,
      );

    setAttendanceDates(
      data.map((item) => item.attendanceDate),
    );
  };

  useEffect(() => {
    void loadDetail();
  }, [userId]);

  useEffect(() => {
    void loadAttendance();
  }, [userId, calendarMonth, calendarYear]);

  const hasExpiredDate = Boolean(member?.memberExpiredDate);

  const trialAllowed = !hasExpiredDate;

  const durationOptions = useMemo(() => {
    const maximum = durationType === "TRIAL" ? 7 : 48;

    return Array.from(
      { length: maximum },
      (_, index) => index + 1,
    );
  }, [durationType]);

  const changeDurationType = (
    type: MembershipDurationType,
  ) => {
    if (type === "TRIAL" && !trialAllowed) {
      setExtendError(
        "Trial is only available for a new member without an expiry date.",
      );
      return;
    }

    setDurationType(type);
    setDuration(1);
    setExtendError("");
  };

  const submitExtendMembership = async () => {
    if (!member) return;

    if (durationType === "TRIAL" && !trialAllowed) {
      setExtendError(
        "Trial is only available for a new member without an expiry date.",
      );
      return;
    }

    try {
      setExtendLoading(true);
      setExtendError("");

      const response = await extendMembership(
        member.userId,
        durationType,
        duration,
      );

      await loadDetail();

      alert(
        `Membership active until ${response.data.memberExpiredDate}`,
      );
    } catch (error: any) {
      setExtendError(
        error?.response?.data?.message ||
          "Failed to extend membership",
      );
    } finally {
      setExtendLoading(false);
    }
  };

  const getDaysInMonth = (
    year: number,
    month: number,
  ) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(
    calendarYear,
    calendarMonth,
  );

  if (!member) {
    return (
      <Layout title="Member Detail">
        <div className="panel">
          Loading member detail...
        </div>
      </Layout>
    );
  }

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
            <strong>
              {member.detail?.fullName || "-"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Phone Number</span>
            <strong>
              {member.detail?.phoneNumber || "-"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Birth Date</span>
            <strong>
              {member.detail?.birthDate || "-"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Emergency Contact</span>
            <strong>
              {member.detail?.emergencyContact || "-"}
            </strong>
          </div>

          <div className="detail-row">
            <span>Address</span>
            <strong>
              {member.detail?.address || "-"}
            </strong>
          </div>
        </div>

        <div className="panel">
          <h2>Membership Card</h2>

          <div
            className={
              member.uid
                ? "rfid-status connected"
                : "rfid-status empty"
            }
          >
            <p>
              {member.uid
                ? "Card Connected"
                : "No Card Connected"}
            </p>

            <strong>
              {member.uid || "Waiting for card"}
            </strong>
          </div>

          <button
            type="button"
            onClick={() => setScannerOpen(true)}
          >
            {member.uid ? "Replace Card" : "Sign Card"}
          </button>
        </div>
      </div>

      <section className="panel onyx-membership-panel">
        <div className="onyx-membership-heading">
          <div>
            <span className="onyx-membership-eyebrow">
              Membership Management
            </span>

            <h2>Extend Membership</h2>

            <p>
              Active members continue from their current expiry date.
              Expired or new members start from today.
            </p>
          </div>

          <div className="onyx-expiry-summary">
            <span>Current expiry</span>
            <strong>{member.memberExpiredDate || "Not set"}</strong>
          </div>
        </div>

        {extendError && (
          <div className="onyx-membership-error">
            {extendError}
          </div>
        )}

        <div className="onyx-package-label">
          Select membership type
        </div>

        <div className="onyx-package-grid">
          <button
            type="button"
            disabled={!trialAllowed}
            className={`onyx-package-option ${
              durationType === "TRIAL" ? "selected" : ""
            }`}
            onClick={() => changeDurationType("TRIAL")}
          >
            <div className="onyx-package-icon">T</div>

            <div>
              <strong>Trial Pass</strong>
              <span>
                {trialAllowed
                  ? "Choose 1 to 7 days"
                  : "Only available for new members"}
              </span>
            </div>

            <div className="onyx-radio-indicator" />
          </button>

          <button
            type="button"
            className={`onyx-package-option ${
              durationType === "MONTH" ? "selected" : ""
            }`}
            onClick={() => changeDurationType("MONTH")}
          >
            <div className="onyx-package-icon">M</div>

            <div>
              <strong>Monthly Membership</strong>
              <span>Choose 1 to 48 months</span>
            </div>

            <div className="onyx-radio-indicator" />
          </button>
        </div>

        <div className="onyx-duration-section">
          <div className="onyx-duration-field">
            <label htmlFor="membership-duration">
              Membership duration
            </label>

            <select
              id="membership-duration"
              value={duration}
              onChange={(event) =>
                setDuration(Number(event.target.value))
              }
            >
              {durationOptions.map((value) => (
                <option key={value} value={value}>
                  {value}{" "}
                  {durationType === "TRIAL"
                    ? value === 1
                      ? "day"
                      : "days"
                    : value === 1
                      ? "month"
                      : "months"}
                </option>
              ))}
            </select>
          </div>

          <div className="onyx-extension-summary">
            <span>Extension rule</span>

            <strong>
              {member.memberExpiredDate && member.status === 1
                ? "Added from current expiry"
                : "Starts from today"}
            </strong>
          </div>
        </div>

        <div className="onyx-membership-actions">
          <button
            type="button"
            className="onyx-extend-button"
            disabled={extendLoading}
            onClick={submitExtendMembership}
          >
            {extendLoading
              ? "Processing membership..."
              : "Extend Membership"}
          </button>
        </div>
      </section>

      <div className="panel attendance-calendar-panel">
        <div className="calendar-header">
          <div>
            <span className="calendar-eyebrow">Member activity</span>
            <h2>Attendance Calendar</h2>
            <p>
              Green dates indicate successful member check-ins.
            </p>
          </div>

          <div className="calendar-controls">
            <div className="calendar-filter">
              <label htmlFor="calendar-month">Month</label>

              <select
                id="calendar-month"
                value={calendarMonth}
                onChange={(event) =>
                  setCalendarMonth(Number(event.target.value))
                }
              >
                {MONTH_NAMES.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="calendar-filter">
              <label htmlFor="calendar-year">Year</label>

              <select
                id="calendar-year"
                value={calendarYear}
                onChange={(event) =>
                  setCalendarYear(Number(event.target.value))
                }
              >
                {Array.from({ length: 10 }, (_, index) => {
                  const year = today.getFullYear() - 5 + index;

                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        <div className="calendar-grid">
          {Array.from({
            length: daysInMonth,
          }).map((_, index) => {
            const day = index + 1;

            const month = String(
              calendarMonth,
            ).padStart(2, "0");

            const date = String(day).padStart(
              2,
              "0",
            );

            const fullDate =
              `${calendarYear}-${month}-${date}`;

            const checkedIn =
              attendanceDates.includes(fullDate);

            return (
              <div
                key={fullDate}
                className={
                  checkedIn
                    ? "calendar-day checked"
                    : "calendar-day"
                }
                title={
                  checkedIn
                    ? `Checked in on ${fullDate}`
                    : fullDate
                }
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
        onClose={() =>
          setScannerOpen(false)
        }
        onSuccess={loadDetail}
      />
    </Layout>
  );
}