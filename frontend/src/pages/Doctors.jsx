import CrudPage from "../components/CrudPage";

const doctorInitial = { fullName: "", specialty: "", email: "", phoneNumber: "", availability: "", verified: false };

export default function Doctors() {
  return (
    <CrudPage
      title="Doctors"
      subtitle="Manage doctor profiles, specialties, and verification state."
      endpoint="/api/doctors"
      initialForm={doctorInitial}
      fields={[
        { name: "fullName", label: "Full Name", required: true },
        { name: "specialty", label: "Specialty", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phoneNumber", label: "Phone Number", required: true },
        { name: "availability", label: "Availability" },
        { name: "verified", label: "Verified", type: "checkbox" }
      ]}
    />
  );
}
