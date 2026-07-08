import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";

import Layout from "../components/Layout";
import MemberCard from "../components/MemberCard";
import type { Member } from "../components/MemberCard";
import { getMembers } from "../api/memberApi";

export default function MemberListPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await getMembers();
      setMembers(data);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const fullName = member.detail?.fullName || "";
      const searchText = `${fullName} ${member.username} ${member.email} ${
        member.uid || ""
      }`.toLowerCase();

      const matchKeyword = searchText.includes(keyword.toLowerCase());

      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && member.status === 1) ||
        (statusFilter === "inactive" && member.status !== 1) ||
        (statusFilter === "no-rfid" && !member.uid);

      return matchKeyword && matchStatus;
    });
  }, [members, keyword, statusFilter]);

  return (
    <Layout title="Member List">
      <div className="panel">
        <div className="panel-header">
          <div>
            <h2>Members</h2>
            <p>Search, view, and manage gym members.</p>
          </div>

          <Link to="/members/create" className="primary-link">
            <FaPlus /> New Member
          </Link>
        </div>

        <div className="member-toolbar">
          <div className="search-box">
            <FaSearch />
            <input
              placeholder="Search name, email, username or RFID..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Members</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="no-rfid">No RFID</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">Loading members...</div>
        ) : filteredMembers.length === 0 ? (
          <div className="empty-state">No members found.</div>
        ) : (
          <div className="member-list">
            {filteredMembers.map((member) => (
              <MemberCard key={member.userId} member={member} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}