import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Layout from "../components/Layout";
import CardScannerModal from "../components/CardScanner/CardScannerModal";
import { getMemberDetail } from "../api/memberApi";

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

  const [member, setMember] = useState<MemberDetail | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  const loadDetail = async () => {
    if (!userId) return;

    const data = await getMemberDetail(Number(userId));
    setMember(data);
  };

  useEffect(() => {
    loadDetail();
  }, [userId]);

  if (!member) {
    return (
      <Layout title="Member Detail">
        <div className="panel">Loading member detail...</div>
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