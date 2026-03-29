import { useEffect, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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

export function AppointmentForm({ form, setForm, doctors, onSubmit, submitLabel }) {
  const specialties = [...new Set(doctors.map((doctor) => doctor.specialty).filter(Boolean))].sort();
  const filteredDoctors = form.specialty
    ? doctors.filter((doctor) => doctor.specialty === form.specialty)
    : [];

  const handleSpecialtyChange = (specialty) => {
    setForm({
      ...form,
      specialty,
      doctorId: "",
      doctorName: ""
    });
  };

  const handleDoctorChange = (doctorId) => {
    const selectedDoctor = filteredDoctors.find((doctor) => String(doctor.id) === doctorId);
    setForm({
      ...form,
      doctorId,
      doctorName: selectedDoctor?.fullName || "",
      specialty: selectedDoctor?.specialty || ""
    });
  };

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <FormField label="Patient Name">
        <input
          value={form.patientName}
          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          required
        />
      </FormField>
      <FormField label="Specialty">
        <select value={form.specialty} onChange={(e) => handleSpecialtyChange(e.target.value)} required>
          <option value="">Select a specialty</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Doctor">
        <select
          value={form.doctorId}
          onChange={(e) => handleDoctorChange(e.target.value)}
          required
          disabled={!form.specialty}
        >
          <option value="">{form.specialty ? "Select a doctor" : "Select a specialty first"}</option>
          {filteredDoctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.fullName}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Date Time">
        <input
          type="datetime-local"
          value={form.appointmentDateTime}
          onChange={(e) => setForm({ ...form, appointmentDateTime: e.target.value })}
          required
        />
      </FormField>
      <FormField label="Status">
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Notes">
        <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </FormField>
      <div className="actions">
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}

export default function BookAppointmentPage({ form, setForm, initialForm }) {
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    request("/api/doctors")
      .then(setDoctors)
      .catch((error) => setMessage(error.message));
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

    try {
      await request("/api/appointments", { method: "POST", body: JSON.stringify(payload) });
      setForm(initialForm);
      setMessage("Appointment booked.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="page-grid">
      <div className="panel">
        <SectionHeader title="Book Appointment" subtitle="Choose a doctor from the list and create a new appointment." />
        <AppointmentForm
          form={form}
          setForm={setForm}
          doctors={doctors}
          onSubmit={submit}
          submitLabel="Book Appointment"
        />
        {message && <p className="message">{message}</p>}
      </div>
    </section>
  );
}
