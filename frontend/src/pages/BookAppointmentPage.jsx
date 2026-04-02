import { useEffect, useState } from "react";
import { request, FormField, SectionHeader } from "../components/common";

const jitsiBaseUrl = "https://meet.jit.si";

const appointmentInitial = {
  patientName: "",
  doctorId: "",
  doctorName: "",
  specialty: "",
  appointmentDateTime: "",
  status: "PENDING",
  notes: ""
};

function createSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

function buildJitsiMeetingLink({ appointmentId, patientName, doctorName, appointmentDateTime }) {
  const datePart = appointmentDateTime ? appointmentDateTime.replace(/[^0-9]/g, "").slice(0, 12) : "session";
  const roomName = [
    "healthcare",
    appointmentId || "new",
    createSlug(patientName || "patient"),
    createSlug(doctorName || "doctor"),
    datePart
  ].join("-");

  return `${jitsiBaseUrl}/${roomName}`;
}

function AppointmentForm({ form, setForm, doctors, onSubmit, submitLabel }) {
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

export default function BookAppointmentPage() {
  const [form, setForm] = useState(appointmentInitial);
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("info");
  const [telemedicineSession, setTelemedicineSession] = useState(null);

  useEffect(() => {
    request("/api/doctors")
      .then(setDoctors)
      .catch((error) => {
        setMessage(error.message);
        setMessageTone("error");
      });
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageTone("info");
    setTelemedicineSession(null);

    const payload = {
      patientName: form.patientName,
      doctorName: form.doctorName,
      specialty: form.specialty,
      appointmentDateTime: form.appointmentDateTime,
      status: form.status,
      notes: form.notes
    };

    try {
      const appointment = await request("/api/appointments", { method: "POST", body: JSON.stringify(payload) });
      const meetingLink = buildJitsiMeetingLink({
        appointmentId: appointment?.id,
        patientName: form.patientName,
        doctorName: form.doctorName,
        appointmentDateTime: form.appointmentDateTime
      });
      const session = await request("/api/telemedicine", {
        method: "POST",
        body: JSON.stringify({
          appointmentId: appointment?.id ?? null,
          patientName: form.patientName,
          doctorName: form.doctorName,
          meetingLink,
          scheduledAt: form.appointmentDateTime,
          status: "SCHEDULED"
        })
      });

      setTelemedicineSession(session);
      setForm(appointmentInitial);
      setMessageTone("success");
      setMessage("Appointment booked. Telemedicine session is ready.");
    } catch (error) {
      setMessageTone("error");
      setMessage(error.message);
    }
  };

  return (
    <section className="booking-shell">
      <div className="booking-panel">
        <SectionHeader
          title="Book Appointment"
          subtitle="Select a specialty first, choose an available doctor, and create a Jitsi consultation instantly."
        />
        <AppointmentForm
          form={form}
          setForm={setForm}
          doctors={doctors}
          onSubmit={submit}
          submitLabel="Book Appointment"
        />
        {message && <p className={`message booking-message ${messageTone}`}>{message}</p>}
      </div>

      <aside className="booking-aside">
        <div className="booking-info-card">
          <h3>Consultation overview</h3>
          <div className="booking-stats">
            <div>
              <strong>{doctors.length}</strong>
              <span>Doctors</span>
            </div>
            <div>
              <strong>{new Set(doctors.map((doctor) => doctor.specialty).filter(Boolean)).size}</strong>
              <span>Specialties</span>
            </div>
          </div>
          <ul className="booking-highlights">
            <li>Choose specialty before doctor selection.</li>
            <li>Doctor list is filtered by specialty.</li>
            <li>Jitsi room is created right after booking.</li>
          </ul>
        </div>

        {telemedicineSession && (
          <div className="booking-session-card">
            <p className="booking-session-label">Video consultation ready</p>
            <h3>{telemedicineSession.doctorName}</h3>
            <p>Appointment ID: {telemedicineSession.appointmentId ?? "Not available"}</p>
            <p>Scheduled At: {telemedicineSession.scheduledAt}</p>
            <a className="meeting-link" href={telemedicineSession.meetingLink} target="_blank" rel="noreferrer">
              Join Jitsi Meeting
            </a>
          </div>
        )}
      </aside>
    </section>
  );
}
