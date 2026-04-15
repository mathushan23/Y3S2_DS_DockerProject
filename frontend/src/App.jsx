import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AppointmentsRoute from "./pages/AppointmentsRoute.jsx";
import SymptomChecker from "./pages/SymptomChecker.jsx";



import UserManagement from "./pages/UserManagement";
import Prescriptions from "./pages/Doctor/Prescriptions.jsx";
import Availability from "./pages/Doctor/Availability.jsx";
import PatientReport from "./pages/Doctor/PatientReport.jsx";
import Profile from "./pages/Doctor/Profile.jsx"
import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="appointments" element={<AppointmentsRoute />} />
              <Route path="symptom-checker" element={<SymptomChecker />} />
              <Route path="profile" element={<Profile />} />
              <Route path="patientreport" element={<PatientReport />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="availability" element={<Availability />} />

              <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}
