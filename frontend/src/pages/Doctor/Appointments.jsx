import { useEffect, useState } from "react";
import { request, FormField, SectionHeader } from "../../components/common";
import { useAuth } from "../../context/AuthContext";

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

function getDoctorName(doctor) {
  if (!doctor) {
    return "";
  }

  if (doctor.fullName) {
    return doctor.fullName;
  }

  return doctor.email || `Doctor ${doctor.id ?? ""}`.trim();
}

function getDoctorSpecialty(doctor) {
  const specialty = doctor?.specialty || doctor?.speciality || doctor?.specialization || "";
  if (!specialty) {
    return "";
  }

  return specialty.charAt(0).toUpperCase() + specialty.slice(1);
}

function normalizeDoctor(doctor) {
  return {
    ...doctor,
    fullName: getDoctorName(doctor),
    specialty: getDoctorSpecialty(doctor),
    consultationFee: doctor?.consultationFee ?? doctor?.fee ?? 0
  };
}

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
  const specialties = [...new Set(doctors.map((doctor) => getDoctorSpecialty(doctor)).filter(Boolean))].sort();
  const filteredDoctors = form.specialty
    ? doctors.filter((doctor) => getDoctorSpecialty(doctor) === form.specialty)
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
      doctorName: getDoctorName(selectedDoctor),
      specialty: getDoctorSpecialty(selectedDoctor)
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
              {getDoctorName(doctor)}
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

export default function Appointments() {
  const { user } = useAuth();
  const [form, setForm] = useState(appointmentInitial);
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState("info");
  const [telemedicineSession, setTelemedicineSession] = useState(null);

  useEffect(() => {
    request("/api/doctors")
      .then((data) => setDoctors((data || []).map(normalizeDoctor)))
      .catch((error) => {
        setMessage(error.message);
        setMessageTone("error");
      });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const patientName =
      user.fullName ||
      user.name;

    if (patientName) {
      setForm((current) => ({
        ...current,
        patientName: current.patientName || patientName
      }));
    }
  }, [user]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setMessageTone("info");
    setTelemedicineSession(null);

    const selectedDoctor = doctors.find((doctor) => String(doctor.id) === String(form.doctorId));

    const payload = {
      patientId: user?.id ?? null,
      doctorId: selectedDoctor?.id ?? null,
      patientName: form.patientName || user?.fullName || user?.name || "Patient",
      doctorName: form.doctorName || getDoctorName(selectedDoctor),
      specialty: form.specialty || getDoctorSpecialty(selectedDoctor),
      appointmentDateTime: form.appointmentDateTime,
      status: form.status,
      patientEmail: user?.email ?? null,
      patientPhone: user?.phone ?? null,
      location: "Telemedicine",
      notes: form.notes,
      billingStatus: "PENDING",
      fee: selectedDoctor?.consultationFee ?? 0
    };

    try {
      const appointment = await request("/api/appointments", { method: "POST", body: JSON.stringify(payload) });
      const meetingLink = buildJitsiMeetingLink({
        appointmentId: appointment?.id,
        patientName: payload.patientName,
        doctorName: payload.doctorName,
        appointmentDateTime: form.appointmentDateTime
      });
      const session = await request("/api/telemedicine", {
        method: "POST",
        body: JSON.stringify({
          appointmentId: appointment?.id ?? null,
          patientName: payload.patientName,
          doctorName: payload.doctorName,
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
