import CrudPage from "../components/CrudPage";

const appointmentInitial = {
  patientName: "",
  doctorName: "",
  specialty: "",
  appointmentDateTime: "",
  status: "PENDING",
  notes: ""
};

export default function Appointments() {
  return (
    <CrudPage
      title="Appointments"
      subtitle="Book and update patient appointments."
      endpoint="/api/appointments"
      initialForm={appointmentInitial}
      fields={[
        { name: "patientName", label: "Patient Name", required: true },
        { name: "doctorName", label: "Doctor Name", required: true },
        { name: "specialty", label: "Specialty", required: true },
        { name: "appointmentDateTime", label: "Date Time", type: "datetime-local", required: true },
        { name: "status", label: "Status", type: "select", options: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] },
        { name: "notes", label: "Notes" }
      ]}
    />
  );
}
