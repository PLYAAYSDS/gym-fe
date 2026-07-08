import { useEffect, useRef, useState } from "react";
import { assignRfid } from "../../api/memberApi";

type Props = {
  open: boolean;
  userId: number;
  currentUid?: string;
  onClose: () => void;
  onSuccess: () => void;
};

type ScanMode = "usb" | "manual" | "phone";

export default function CardScannerModal({
  open,
  userId,
  currentUid,
  onClose,
  onSuccess,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<ScanMode>("usb");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const phoneUrl = `${window.location.origin}/mobile-nfc/${userId}`;

  useEffect(() => {
    if (open && mode === "usb") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [open, mode]);

  if (!open) return null;

  const connectCard = async (finalUid?: string) => {
    const selectedUid = finalUid || uid;

    if (!selectedUid.trim()) {
      alert("UID is empty");
      return;
    }

    try {
      setLoading(true);

      await assignRfid(userId, selectedUid.trim());

      alert("RFID connected successfully");

      setUid("");
      onSuccess();
      onClose();
    } catch {
      alert("Failed to connect RFID");
    } finally {
      setLoading(false);
    }
  };

  const handleUsbKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await connectCard(e.currentTarget.value);
    }
  };

  return (
    <div className="scanner-overlay">
      <div className="scanner-modal">
        <div className="scanner-header">
          <div>
            <h2>{currentUid ? "Replace Card" : "Sign Card"}</h2>
            <p>Connect RFID card to this member.</p>
          </div>

          <button className="icon-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="scanner-current">
          <span>Current UID</span>
          <strong>{currentUid || "No card connected"}</strong>
        </div>

        <div className="scanner-tabs">
          <button
            type="button"
            className={mode === "usb" ? "active" : ""}
            onClick={() => setMode("usb")}
          >
            USB Reader
          </button>

          <button
            type="button"
            className={mode === "manual" ? "active" : ""}
            onClick={() => setMode("manual")}
          >
            Manual Input
          </button>

          <button
            type="button"
            className={mode === "phone" ? "active" : ""}
            onClick={() => setMode("phone")}
          >
            Phone NFC
          </button>
        </div>

        <div className="scanner-body">
          {mode === "usb" && (
            <div className="scanner-box">
              <div className="scanner-animation">📡</div>
              <h3>Waiting for USB RFID Reader</h3>
              <p>
                Tap the card on the USB RFID reader. Usually it will type the
                UID automatically and press Enter.
              </p>

              <input
                ref={inputRef}
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                onKeyDown={handleUsbKeyDown}
                placeholder="Waiting RFID UID..."
              />

              <button disabled={loading} onClick={() => connectCard()}>
                {loading ? "Connecting..." : "Connect Card"}
              </button>
            </div>
          )}

          {mode === "manual" && (
            <div className="scanner-box">
              <div className="scanner-animation">⌨️</div>
              <h3>Manual UID Input</h3>
              <p>Use this for testing or backup when scanner is not available.</p>

              <input
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                placeholder="Example: 04A1B2C3D4"
              />

              <button disabled={loading} onClick={() => connectCard()}>
                {loading ? "Connecting..." : "Connect Card"}
              </button>
            </div>
          )}

          {mode === "phone" && (
            <div className="scanner-box">
                <div className="scanner-animation">📱</div>
                <h3>Phone NFC Scanner</h3>
                <p>Open this link on Android Chrome, then scan the NFC card.</p>

                <input value={phoneUrl} readOnly />

                <button
                type="button"
                onClick={() => navigator.clipboard.writeText(phoneUrl)}
                >
                Copy Link
                </button>
            </div>
            )}
        </div>

        <div className="scanner-footer">
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}