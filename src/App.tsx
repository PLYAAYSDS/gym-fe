import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MemberListPage from "./pages/MemberListPage";
import CreateMemberPage from "./pages/CreateMemberPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MemberDetailPage from "./pages/MemberDetailPage";
import MobileNfcPage from "./components/CardScanner/MobileNfcPage";
import AttendancePage from "./pages/AttendancePage";
import MemberLoginPage from "./pages/MemberLoginPage";
import MemberHomePage from "./pages/MemberHomePage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/login" element={<MemberLoginPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MemberListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members/create"
          element={
            <ProtectedRoute>
              <CreateMemberPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members/:userId"
          element={
            <ProtectedRoute>
              <MemberDetailPage />
            </ProtectedRoute>
          }
        />

        <Route path="/mobile-nfc/:userId" element={<MobileNfcPage />} />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        <Route path="/member/home" element={<MemberHomePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </HashRouter>
  );
}