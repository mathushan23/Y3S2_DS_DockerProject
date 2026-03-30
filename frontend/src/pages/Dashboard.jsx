import { useAuth } from "../context/AuthContext";
import DoctorDashboard from "../components/dashboard/DoctorDashboard";
import PatientDashboard from "../components/dashboard/PatientDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  
  if (user?.role === "DOCTOR") {
    return <DoctorDashboard user={user} />;
  }

  if (user?.role === "ADMIN") {
    return <AdminDashboard user={user} />;
  }

  // Default to Patient Dashboard if PATIENT role or role missing
  return <PatientDashboard user={user} />;
}

