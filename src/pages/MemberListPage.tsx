import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

type Member = {
  userId: number;
  username: string;
  email: string;
  uid?: string;
  role?: number;
  status?: number;
  memberExpiredDate?: string;
};

export default function MemberListPage() {
  const [members, setMembers] = useState<Member[]>([]);

  const getMembers = async () => {
    try {
      const response = await api.get("/users");
      setMembers(response.data);
    } catch {
      setMembers([]);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <Layout title="Member List">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Registered Members</h2>
            <p>View all gym members and their RFID status.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>RFID UID</th>
                <th>Status</th>
                <th>Expired Date</th>
              </tr>
            </thead>

            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    No members found.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.userId}>
                    <td>{member.userId}</td>
                    <td>{member.username}</td>
                    <td>{member.email}</td>
                    <td>{member.uid || "-"}</td>
                    <td>
                      <span className="badge">
                        {member.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{member.memberExpiredDate || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}