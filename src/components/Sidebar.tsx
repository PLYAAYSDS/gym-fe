import { NavLink } from "react-router-dom";
import {
  FaDumbbell,
  FaHome,
  FaUserPlus,
  FaUsers,
  FaCalendarCheck,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <FaDumbbell />
        </div>
        <div>
          <strong>Onyx Fit</strong>
          <small>Admin Panel</small>
        </div>
      </div>

      <nav className="menu">
        <NavLink to="/dashboard">
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/members">
          <FaUsers /> Members
        </NavLink>

        <NavLink to="/members/create">
          <FaUserPlus /> Create Member
        </NavLink>

        <NavLink to="/attendance">
            <FaCalendarCheck /> Attendance
        </NavLink>

      </nav>
    </aside>
  );
}