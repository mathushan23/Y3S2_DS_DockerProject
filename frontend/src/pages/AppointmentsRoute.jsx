import { useAuth } from "../context/AuthContext";
import DoctorAppointments from "./Doctor/Appointments.jsx";
import BookAppointmentPage from "./BookAppointmentPage.jsx";

export default function AppointmentsRoute() {
  const { user } = useAuth();

  if (user?.role === "DOCTOR") {
    return <DoctorAppointments />;
  }

  return <BookAppointmentPage />;
}
