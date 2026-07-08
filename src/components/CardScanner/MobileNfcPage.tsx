import { useParams } from "react-router-dom";
import { useState } from "react";
import { assignRfid } from "../../api/memberApi";

declare global {
  interface Window {
    NDEFReader?: any;
  }
}

export default function MobileNfcPage() {
  const { userId } = useParams();

  const [status, setStatus] = useState("Ready to scan");
  const [uid, setUid] = useState("");

  const startScan = async () => {
    if (!("NDEFReader" in window)) {
      setStatus("Web NFC is not supported on this browser");
      return;
    }

    try {
      const ndef = new window.NDEFReader();

      await ndef.scan();

      setStatus("Scanning... tap NFC card to your phone");

      ndef.onreading = async (event: any) => {
        const serialNumber = event.serialNumber;

        if (!serialNumber) {
          setStatus("Card read, but serial number not available");
          return;
        }

        setUid(serialNumber);
        setStatus("Card detected. Connecting...");

        await assignRfid(Number(userId), serialNumber);

        setStatus("Card connected successfully");
      };

      ndef.onreadingerror = () => {
        setStatus("Failed to read NFC card");
      };
    } catch (error: any) {
      setStatus(error.message || "NFC scan failed");
    }
  };

  return (
    <div className="mobile-nfc-page">
      <div className="mobile-nfc-card">
        <h1>Phone NFC Scanner</h1>
        <p>Tap the button, then hold the card behind your phone.</p>

        <button onClick={startScan}>Start NFC Scan</button>

        <div className="nfc-status">
          <strong>Status</strong>
          <p>{status}</p>
        </div>

        {uid && (
          <div className="nfc-status success">
            <strong>UID</strong>
            <p>{uid}</p>
          </div>
        )}
      </div>
    </div>
  );
}