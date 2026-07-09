import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Layout from "../components/Layout";
import { checkInByUid, qrCheckIn } from "../api/attendanceApi";
import {
  FaCheckCircle,
  FaIdCard,
  FaQrcode,
  FaTimesCircle,
} from "react-icons/fa";

type ScanResult = {
  success: boolean;
  message: string;
  member?: {
    name?: string;
    fullName?: string;
    username?: string;
    email?: string;
    expiredDate?: string;
  };
};

export default function AttendancePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const qrScannerRef = useRef<Html5Qrcode | null>(null);

  const [result, setResult] = useState<ScanResult | null>(null);
  const [qrScanning, setQrScanning] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();

    return () => {
      qrScannerRef.current?.stop().catch(() => {});
    };
  }, []);

  const resetResult = () => {
    setTimeout(() => {
      setResult(null);
      inputRef.current?.focus();
    }, 3000);
  };

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
        message: err.response?.data?.message ?? "Check-in failed",
      });
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }

      resetResult();
    }
  };

  const submitQrCheckIn = async (qrToken: string) => {
    try {
      const response = await qrCheckIn(qrToken);

      setResult({
        success: true,
        message: response.message,
        member: response.member,
      });
    } catch (err: any) {
      setResult({
        success: false,
        message: err.response?.data?.message ?? "QR check-in failed",
      });
    } finally {
      resetResult();
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

  const startQrScanner = async () => {
    if (qrScanning) return;

    try {
      const scanner = new Html5Qrcode("qr-reader");
      qrScannerRef.current = scanner;
      setQrScanning(true);

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          await scanner.stop();
          setQrScanning(false);

          await submitQrCheckIn(decodedText);
        },
        () => {}
      );
    } catch {
      setQrScanning(false);
      setResult({
        success: false,
        message: "Unable to start QR scanner",
      });
      resetResult();
    }
  };

  const stopQrScanner = async () => {
    if (!qrScannerRef.current || !qrScanning) return;

    await qrScannerRef.current.stop().catch(() => {});
    setQrScanning(false);
    inputRef.current?.focus();
  };

  return (
    <Layout title="Attendance Check-In">
      <div className="attendance-grid">
        <div className="panel attendance-scanner">
          <div className="scanner-big-icon">
            <FaIdCard />
          </div>

          <h2>RFID Check-In</h2>
          <p>
            Tap member RFID card on the reader. It will check in automatically.
          </p>

          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className="rfid-hidden-input"
          />
        </div>

        <div className="panel attendance-scanner">
          <div className="scanner-big-icon">
            <FaQrcode />
          </div>

          <h2>QR Check-In</h2>
          <p>Scan member QR code from their member dashboard.</p>

          <div id="qr-reader" className="qr-reader-box" />

          <div className="qr-actions">
            <button type="button" onClick={startQrScanner} disabled={qrScanning}>
              {qrScanning ? "Scanning..." : "Start QR Scanner"}
            </button>

            {qrScanning && (
              <button
                type="button"
                className="secondary-btn"
                onClick={stopQrScanner}
              >
                Stop
              </button>
            )}
          </div>
        </div>

        <div className="panel attendance-result attendance-result-wide">
          <h2>Scan Result</h2>

          {!result ? (
            <div className="empty-state">No card or QR scanned yet.</div>
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
                      {result.member.fullName ||
                        result.member.name ||
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