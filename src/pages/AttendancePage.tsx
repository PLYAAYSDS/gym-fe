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
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submitCheckIn = async (uid: string) => {
    try {
        
        const response = await checkInByUid(uid);

        setResult({
        success: true,
        message: response.message,
        member: response.member,
        });
    } catch (err: any) {
        setResult({
        success: false,
        message:
            err.response?.data?.message ??
            "Check-in failed",
        });
    } finally {
        
        if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
        }

        setTimeout(() => {
        setResult(null);

        inputRef.current?.focus();
        }, 3000);
    }
  };

  const handleKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key !== "Enter") return;

        e.preventDefault();

        const scannedUid = e.currentTarget.value.trim();

        if (!scannedUid) return;

        await submitCheckIn(scannedUid);
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
            onKeyDown={handleKeyDown}
              className="rfid-hidden-input"
          />

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