import { useAuth } from "../context/AuthContext";
import DoctorDashboard from "../components/dashboard/DoctorDashboard";
import PatientDashboard from "../components/dashboard/PatientDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

export default function Dashboard() {
  const { user, isDoctor, isAdmin } = useAuth();
  
  if (isDoctor()) {
    return <DoctorDashboard user={user} />;
  }

  if (isAdmin()) {
    return <AdminDashboard user={user} />;
  }

  // Default to Patient Dashboard
  return <PatientDashboard user={user} />;
}

