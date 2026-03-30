import CrudPage from "../components/CrudPage";

const authInitial = { fullName: "", email: "", password: "", role: "PATIENT" };

export default function UserManagement() {
  return (
    <CrudPage
      title="Users"
      subtitle="Manage system users and roles."
      endpoint="/api/auth/users"
      initialForm={authInitial}
      fields={[
        { name: "fullName", label: "Full Name", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Password", type: "password", required: true },
        { name: "role", label: "Role", type: "select", options: ["PATIENT", "DOCTOR", "ADMIN"] }
      ]}
    />
  );
}
