import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import Appointments from "./pages/Doctor/Appointments.jsx";
import Telemedicine from "./pages/Doctor/Telemedicine.jsx";
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

          {/* Protected Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />

            <Route path="appointments" element={<Appointments />} />
            <Route path="profile" element={<Profile />} />
            <Route path="patientreport" element={<PatientReport />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="availability" element={<Availability />} />
            <Route path="telemedicine" element={<Telemedicine />} />
            <Route path="users" element={<UserManagement />} />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
