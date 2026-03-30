import CrudPage from "../components/CrudPage";

const telemedicineInitial = {
  appointmentId: "",
  patientName: "",
  doctorName: "",
  meetingLink: "",
  scheduledAt: "",
  status: "SCHEDULED"
};

export default function Telemedicine() {
  return (
    <CrudPage
      title="Telemedicine"
      subtitle="Store meeting links and consultation status."
      endpoint="/api/telemedicine"
      initialForm={telemedicineInitial}
      fields={[
        { name: "appointmentId", label: "Appt ID", type: "number" },
        { name: "patientName", label: "Patient Name", required: true },
        { name: "doctorName", label: "Doctor Name", required: true },
        { name: "meetingLink", label: "Meeting Link", required: true },
        { name: "scheduledAt", label: "Scheduled At", type: "datetime-local", required: true },
        { name: "status", label: "Status", type: "select", options: ["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"] }
      ]}
    />
  );
}
