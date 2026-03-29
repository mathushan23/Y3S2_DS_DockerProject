import { useEffect, useState } from "react";
import BookAppointmentPage, { AppointmentForm } from "./components/BookAppointmentPage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const pages = [
  { id: "auth", label: "Auth" },
  { id: "doctors", label: "Doctors" },
  { id: "book-appointment", label: "Book Appointment" },
  { id: "appointments", label: "Appointments" },
  { id: "telemedicine", label: "Telemedicine" }
];

const authInitial = { fullName: "", email: "", password: "", role: "PATIENT" };
const loginInitial = { email: "", password: "" };
const doctorInitial = { fullName: "", specialty: "", email: "", phoneNumber: "", availability: "", verified: false };
const appointmentInitial = {
  patientName: "",
  doctorId: "",
  doctorName: "",
  specialty: "",
  appointmentDateTime: "",
  status: "PENDING",
  notes: ""
};
const telemedicineInitial = {
  appointmentId: "",
  patientName: "",
  doctorName: "",
  meetingLink: "",
  scheduledAt: "",
  status: "SCHEDULED"
};

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(body?.error || body?.message || JSON.stringify(body?.errors || {}) || "Request failed");
  }

  return body;
}

function FormField({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function AuthPage() {
  const [users, setUsers] = useState([]);
  const [registerForm, setRegisterForm] = useState(authInitial);
  const [loginForm, setLoginForm] = useState(loginInitial);
  const [editingId, setEditingId] = useState(null);
  const [loginResult, setLoginResult] = useState(null);
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    const data = await request("/api/auth/users");
    setUsers(data);
  };

  useEffect(() => {
    loadUsers().catch((error) => setMessage(error.message));
  }, []);

  const submitRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    const path = editingId ? `/api/auth/users/${editingId}` : "/api/auth/register";
    const method = editingId ? "PUT" : "POST";

    try {
      await request(path, { method, body: JSON.stringify(registerForm) });
      setRegisterForm(authInitial);
      setEditingId(null);
      await loadUsers();
      setMessage(editingId ? "User updated." : "User registered.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const data = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm)
      });
      setLoginResult(data);
      setMessage("Login successful.");
    } catch (error) {
      setLoginResult(null);
      setMessage(error.message);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setRegisterForm({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role
    });
  };

  const removeUser = async (id) => {
    try {
      await request(`/api/auth/users/${id}`, { method: "DELETE" });
      await loadUsers();
      setMessage("User deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="page-grid">
      <div className="panel">
        <SectionHeader title="Register User" subtitle="Simple role-based auth demo for patient, doctor, and admin." />
        <form className="form-grid" onSubmit={submitRegister}>
          <FormField label="Full Name">
            <input value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} required />
          </FormField>
          <FormField label="Email">
            <input type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} required />
          </FormField>
          <FormField label="Password">
            <input type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} required />
          </FormField>
          <FormField label="Role">
            <select value={registerForm.role} onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </FormField>
          <div className="actions">
            <button type="submit">{editingId ? "Update User" : "Register User"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setRegisterForm(authInitial); }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel">
        <SectionHeader title="Login" subtitle="Basic login check against stored users." />
        <form className="form-grid" onSubmit={submitLogin}>
          <FormField label="Email">
            <input type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} required />
          </FormField>
          <FormField label="Password">
            <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
          </FormField>
          <div className="actions">
            <button type="submit">Login</button>
          </div>
        </form>
        {loginResult && (
          <div className="result-card">
            <strong>{loginResult.fullName}</strong>
            <span>{loginResult.email}</span>
            <span>{loginResult.role}</span>
          </div>
        )}
      </div>

      <div className="panel full-width">
        <SectionHeader title="User List" subtitle="Admin-style view for updating and removing users." />
        <DataTable
          columns={["Name", "Email", "Role", "Actions"]}
          rows={users.map((user) => [
            user.fullName,
            user.email,
            user.role,
            <div className="row-actions" key={user.id}>
              <button className="secondary" onClick={() => startEdit(user)}>Edit</button>
              <button className="danger" onClick={() => removeUser(user.id)}>Delete</button>
            </div>
          ])}
        />
        {message && <p className="message">{message}</p>}
      </div>
    </section>
  );
}

function CrudPage({ title, subtitle, endpoint, form, setForm, initialForm, fields, idKey = "id" }) {
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    const data = await request(endpoint);
    setItems(data);
  };

  useEffect(() => {
    loadItems().catch((error) => setMessage(error.message));
  }, [endpoint]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    const path = editingId ? `${endpoint}/${editingId}` : endpoint;
    const method = editingId ? "PUT" : "POST";

    const payload = { ...form };
    if ("appointmentId" in payload && payload.appointmentId === "") {
      payload.appointmentId = null;
    }

    try {
      await request(path, { method, body: JSON.stringify(payload) });
      setForm(initialForm);
      setEditingId(null);
      await loadItems();
      setMessage(editingId ? `${title} updated.` : `${title} created.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const remove = async (id) => {
    try {
      await request(`${endpoint}/${id}`, { method: "DELETE" });
      await loadItems();
      setMessage(`${title} deleted.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEdit = (item) => {
    const nextForm = {};
    fields.forEach((field) => {
      nextForm[field.name] = field.type === "checkbox" ? item[field.name] : item[field.name] ?? "";
    });
    setForm(nextForm);
    setEditingId(item[idKey]);
  };

  return (
    <section className="page-grid">
      <div className="panel">
        <SectionHeader title={title} subtitle={subtitle} />
        <form className="form-grid" onSubmit={submit}>
          {fields.map((field) => (
            <FormField label={field.label} key={field.name}>
              {field.type === "select" ? (
                <select value={form[field.name]} onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input type="checkbox" checked={form[field.name]} onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })} />
              ) : (
                <input
                  type={field.type || "text"}
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  required={field.required}
                />
              )}
            </FormField>
          ))}
          <div className="actions">
            <button type="submit">{editingId ? "Update" : "Create"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(initialForm); }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="panel full-width">
        <SectionHeader title={`${title} Records`} subtitle="List, edit, and delete stored records." />
        <DataTable
          columns={[...fields.map((field) => field.label), "Actions"]}
          rows={items.map((item) => [
            ...fields.map((field) => formatCell(item[field.name], field.type)),
            <div className="row-actions" key={item[idKey]}>
              <button className="secondary" onClick={() => startEdit(item)}>Edit</button>
              <button className="danger" onClick={() => remove(item[idKey])}>Delete</button>
            </div>
          ])}
        />
      </div>
    </section>
  );
}

function AppointmentPage({ form, setForm, initialForm }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadAppointments = async () => {
    const data = await request("/api/appointments");
    setAppointments(data);
  };

  const loadDoctors = async () => {
    const data = await request("/api/doctors");
    setDoctors(data);
  };

  useEffect(() => {
    Promise.all([loadAppointments(), loadDoctors()]).catch((error) => setMessage(error.message));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");

    const payload = {
      patientName: form.patientName,
      doctorName: form.doctorName,
      specialty: form.specialty,
      appointmentDateTime: form.appointmentDateTime,
      status: form.status,
      notes: form.notes
    };

    const path = editingId ? `/api/appointments/${editingId}` : "/api/appointments";
    const method = editingId ? "PUT" : "POST";

    try {
      await request(path, { method, body: JSON.stringify(payload) });
      setForm(initialForm);
      setEditingId(null);
      await loadAppointments();
      setMessage(editingId ? "Appointment updated." : "Appointment created.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const remove = async (id) => {
    try {
      await request(`/api/appointments/${id}`, { method: "DELETE" });
      await loadAppointments();
      setMessage("Appointment deleted.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const startEdit = (appointment) => {
    const matchedDoctor = doctors.find((doctor) => doctor.fullName === appointment.doctorName);
    setForm({
      patientName: appointment.patientName ?? "",
      doctorId: matchedDoctor ? String(matchedDoctor.id) : "",
      doctorName: appointment.doctorName ?? "",
      specialty: appointment.specialty ?? "",
      appointmentDateTime: appointment.appointmentDateTime ?? "",
      status: appointment.status ?? "PENDING",
      notes: appointment.notes ?? ""
    });
    setEditingId(appointment.id);
  };

  return (
    <section className="page-grid">
      <div className="panel">
        <SectionHeader title="Edit Appointment" subtitle="Update the selected appointment record." />
        <AppointmentForm
          form={form}
          setForm={setForm}
          doctors={doctors}
          onSubmit={submit}
          submitLabel={editingId ? "Update Appointment" : "Select a record to edit"}
        />
        {!editingId && <p className="message">Choose an appointment from the table to edit it here.</p>}
        {editingId && (
          <div className="actions">
            <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(initialForm); }}>
              Cancel Edit
            </button>
          </div>
        )}
        {message && <p className="message">{message}</p>}
      </div>

      <div className="panel full-width">
        <SectionHeader title="Appointment Records" subtitle="List, edit, and delete stored records." />
        <DataTable
          columns={["Patient Name", "Doctor Name", "Specialty", "Date Time", "Status", "Notes", "Actions"]}
          rows={appointments.map((appointment) => [
            appointment.patientName,
            appointment.doctorName,
            appointment.specialty,
            appointment.appointmentDateTime,
            appointment.status,
            appointment.notes || "-",
            <div className="row-actions" key={appointment.id}>
              <button className="secondary" onClick={() => startEdit(appointment)}>Edit</button>
              <button className="danger" onClick={() => remove(appointment.id)}>Delete</button>
            </div>
          ])}
        />
      </div>
    </section>
  );
}

function formatCell(value, type) {
  if (type === "checkbox") {
    return value ? "Yes" : "No";
  }
  return value ?? "-";
}

function DataTable({ columns, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => <th key={column}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty">No records yet.</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("auth");
  const [doctorForm, setDoctorForm] = useState(doctorInitial);
  const [appointmentForm, setAppointmentForm] = useState(appointmentInitial);
  const [telemedicineForm, setTelemedicineForm] = useState(telemedicineInitial);

  return (
    <main className="layout">
      <aside className="sidebar">
        <p className="eyebrow">SE3020 Assignment</p>
        <h1>Smart Healthcare Platform</h1>
        <p className="lead">Gateway: {apiBaseUrl}</p>
        <nav className="nav-list">
          {pages.map((page) => (
            <button
              key={page.id}
              className={activePage === page.id ? "nav-link active" : "nav-link"}
              onClick={() => setActivePage(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="content">
        {activePage === "auth" && <AuthPage />}
        {activePage === "doctors" && (
          <CrudPage
            title="Doctor Management"
            subtitle="Manage doctor profiles, specialties, schedules, and verification state."
            endpoint="/api/doctors"
            form={doctorForm}
            setForm={setDoctorForm}
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
        )}
        {activePage === "book-appointment" && (
          <BookAppointmentPage
            form={appointmentForm}
            setForm={setAppointmentForm}
            initialForm={appointmentInitial}
          />
        )}
        {activePage === "appointments" && (
          <AppointmentPage
            form={appointmentForm}
            setForm={setAppointmentForm}
            initialForm={appointmentInitial}
          />
        )}
        {activePage === "telemedicine" && (
          <CrudPage
            title="Telemedicine Sessions"
            subtitle="Store meeting links and consultation session status."
            endpoint="/api/telemedicine"
            form={telemedicineForm}
            setForm={setTelemedicineForm}
            initialForm={telemedicineInitial}
            fields={[
              { name: "appointmentId", label: "Appointment ID", type: "number" },
              { name: "patientName", label: "Patient Name", required: true },
              { name: "doctorName", label: "Doctor Name", required: true },
              { name: "meetingLink", label: "Meeting Link", required: true },
              { name: "scheduledAt", label: "Scheduled At", type: "datetime-local", required: true },
              { name: "status", label: "Status", type: "select", options: ["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"] }
            ]}
          />
        )}
      </section>
    </main>
  );
}
