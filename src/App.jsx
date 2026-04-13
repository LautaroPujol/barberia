import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/globals.css";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import AppointmentsPage from "./pages/admin/AppointmentsPage";
import BarbersPage from "./pages/admin/BarbersPage";
import ServicesPage from "./pages/admin/ServicesPages";
import UsersPage from "./pages/admin/UsersPage";
import ProtectedRoute from "./components/admin/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="barbers" element={<BarbersPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}