import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { checkInByUid } from "../api/attendanceApi";
import { FaIdCard, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type ScanResult = {
  success: boolean;
  message: string;
  member?: {
    name?: string;
    username?: string;
    email?: string;
    expiredDate?: string;
  };
};

export default function AttendancePage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submitCheckIn = async (value?: string) => {
    const finalUid = value || uid;

    if (!finalUid.trim()) return;

    try {
      setLoading(true);

      const response = await checkInByUid(finalUid.trim());

      setResult({
        success: true,
        message: response.message || "Check-in success",
        member: response.member,
      });

      setUid("");
      inputRef.current?.focus();
    } catch (error: any) {
      setResult({
        success: false,
        message:
          error?.response?.data?.message || "Check-in failed",
      });

      setUid("");
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await submitCheckIn(e.currentTarget.value);
    }
  };

  return (
    <Layout title="Attendance Check-In">
      <div className="attendance-grid">
        <div className="panel attendance-scanner">
          <div className="scanner-big-icon">
            <FaIdCard />
          </div>

          <h2>Scan Member Card</h2>
          <p>
            Tap member RFID card on the reader. The UID will be read
            automatically.
          </p>

          <input
            ref={inputRef}
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Waiting RFID UID..."
            autoFocus
          />

          <button
            type="button"
            disabled={loading}
            onClick={() => submitCheckIn()}
          >
            {loading ? "Checking..." : "Check In"}
          </button>
        </div>

        <div className="panel attendance-result">
          <h2>Scan Result</h2>

          {!result ? (
            <div className="empty-state">
              No card scanned yet.
            </div>
          ) : (
            <div
              className={
                result.success
                  ? "attendance-status success"
                  : "attendance-status failed"
              }
            >
              {result.success ? <FaCheckCircle /> : <FaTimesCircle />}

              <h3>{result.message}</h3>

              {result.member && (
                <div className="attendance-member">
                  <div>
                    <span>Name</span>
                    <strong>
                      {result.member.name ||
                        result.member.username ||
                        "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{result.member.email || "-"}</strong>
                  </div>

                  <div>
                    <span>Expired Date</span>
                    <strong>{result.member.expiredDate || "-"}</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}