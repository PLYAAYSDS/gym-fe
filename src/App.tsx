import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MemberListPage from "./pages/MemberListPage";
import CreateMemberPage from "./pages/CreateMemberPage";
// import AssignRfidPage from "./pages/AssignRfidPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MemberDetailPage from "./pages/MemberDetailPage";
import MobileNfcPage from "./components/CardScanner/MobileNfcPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<LoginPage />} />

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

        {/* <Route
          path="/members/assign-rfid"
          element={
            <ProtectedRoute>
              <AssignRfidPage />
            </ProtectedRoute>
          }
        /> */}

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
          path="/members/:userId"
          element={
            <ProtectedRoute>
              <MemberDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}