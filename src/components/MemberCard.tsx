import { useNavigate } from "react-router-dom";
import { FaChevronRight, FaIdCard, FaUserCircle } from "react-icons/fa";

export type Member = {
  userId: number;
  username: string;
  email: string;
  uid?: string;
  status?: number;
  memberExpiredDate?: string;
  detail?: {
    fullName?: string;
    phoneNumber?: string;
  } | null;
};

type Props = {
  member: Member;
};

export default function MemberCard({ member }: Props) {
  const navigate = useNavigate();

  const fullName = member.detail?.fullName || member.username;
  const isActive = member.status === 1;
  const hasRfid = Boolean(member.uid);

  return (
    <div
      className="member-card"
      onClick={() => navigate(`/members/${member.userId}`)}
    >
      <div className="member-avatar">
        <FaUserCircle />
      </div>

      <div className="member-info">
        <h3>{fullName}</h3>
        <p>{member.email}</p>

        <div className="member-badges">
          <span className={isActive ? "badge active" : "badge inactive"}>
            {isActive ? "Active" : "Inactive"}
          </span>

          <span className={hasRfid ? "badge rfid" : "badge warning"}>
            <FaIdCard />
            {hasRfid ? "RFID Connected" : "No RFID"}
          </span>
        </div>
      </div>

      <div className="member-meta">
        <span>Expired</span>
        <strong>{member.memberExpiredDate || "-"}</strong>
      </div>

      <FaChevronRight className="member-arrow" />
    </div>
  );
}