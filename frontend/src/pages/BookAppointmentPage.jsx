import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  const specialty = (doctor?.specialty || doctor?.speciality || doctor?.specialization || "").trim();
  if (!specialty) {
    return "";
  }

  return specialty.charAt(0).toUpperCase() + specialty.slice(1);
}

function normalizeDoctor(doctor) {
  return {
    ...doctor,
    fullName: getDoctorName(doctor),
    specialty: getDoctorSpecialty(doctor)
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

export default function BookAppointmentPage() {
  const location = useLocation();
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
    const recommendedSpecialty = location.state?.recommendedSpecialty;
    const symptomSummary = location.state?.symptomSummary;
    const urgencyLevel = location.state?.urgencyLevel;

    if (!recommendedSpecialty) {
      return;
    }

    setForm((current) => {
      const notes = [
        current.notes,
        symptomSummary ? `AI summary: ${symptomSummary}` : "",
        urgencyLevel ? `Urgency: ${urgencyLevel}` : ""
      ].filter(Boolean).join(" | ");

      return {
        ...current,
        specialty: recommendedSpecialty,
        notes
      };
    });
  }, [location.state]);

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
    <section className="booking-shell container-fluid p-4">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-custom shadow-sm border-0 rounded-4 p-4">
            <header className="mb-4">
              <h2 className="fw-bold text-dark mb-1">Book New Appointment</h2>
              <p className="text-muted small">Select a specialty first, choose an available doctor, and create a Jitsi consultation instantly.</p>
            </header>
            
            <div className="booking-form-wrapper">
              <AppointmentForm
                form={form}
                setForm={setForm}
                doctors={doctors}
                onSubmit={submit}
                submitLabel="Confirm & Book Appointment"
              />
            </div>
            
            {message && (
              <div className={`alert mt-4 rounded-3 border-0 shadow-sm d-flex align-items-center gap-2 ${messageTone === 'success' ? 'alert-success text-success bg-success-subtle' : 'alert-danger text-danger bg-danger-subtle'}`}>
                {messageTone === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="fw-bold small">{message}</span>
              </div>
            )}
          </div>
        </div>

        <aside className="col-lg-4">
          <div className="card-custom shadow-sm border-0 rounded-4 p-4 mb-4">
            <h5 className="fw-bold text-dark mb-4">Consultation Overview</h5>
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="overview-pill p-3 rounded-4 bg-light text-center border">
                  <strong className="text-primary h4 mb-1 d-block">{doctors.length}</strong>
                  <span className="text-muted small fw-bold">Active Doctors</span>
                </div>
              </div>
              <div className="col-6">
                <div className="overview-pill p-3 rounded-4 bg-light text-center border">
                  <strong className="text-primary h4 mb-1 d-block">{new Set(doctors.map((doctor) => doctor.specialty).filter(Boolean)).size}</strong>
                  <span className="text-muted small fw-bold">Specialties</span>
                </div>
              </div>
            </div>
            
            <div className="highlights-box p-3 rounded-4 border bg-light-subtle">
              <h6 className="fw-bold text-dark mb-3 small opacity-75">BOOKING GUIDELINES</h6>
              <ul className="list-unstyled mb-0">
                <li className="d-flex align-items-start gap-2 mb-3">
                  <div className="bullet-v2 mt-1"></div>
                  <span className="small text-secondary fw-500">Choose specialty before doctor selection.</span>
                </li>
                <li className="d-flex align-items-start gap-2 mb-3">
                  <div className="bullet-v2 mt-1"></div>
                  <span className="small text-secondary fw-500">Doctor list is filtered by specialty.</span>
                </li>
                <li className="d-flex align-items-start gap-2">
                  <div className="bullet-v2 mt-1"></div>
                  <span className="small text-secondary fw-500">Secure Jitsi room is created right after booking.</span>
                </li>
              </ul>
            </div>
          </div>

          {telemedicineSession && (
            <div className="card-session-new shadow-sm border-0 rounded-4 p-4 animate-slide-in">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="video-icon shadow-sm">
                   <Video size={18} />
                </div>
                <span className="text-white-50 small fw-bold text-uppercase letter-spacing-1">Video Consultation Ready</span>
              </div>
              
              <h3 className="text-white fw-bold h4 mb-1">{telemedicineSession.doctorName}</h3>
              <p className="text-white-50 small mb-4">Secure digital session generated</p>
              
              <div className="session-details-grid p-3 rounded-4 bg-white bg-opacity-10 mb-4 border border-white border-opacity-10">
                <div className="d-flex justify-content-between mb-2">
                   <span className="text-white-50 tiny fw-bold">APPOINTMENT ID</span>
                   <span className="text-white tiny fw-bold">{telemedicineSession.appointmentId || "N/A"}</span>
                </div>
                <div className="d-flex justify-content-between">
                   <span className="text-white-50 tiny fw-bold">SCHEDULED AT</span>
                   <span className="text-white tiny fw-bold">{telemedicineSession.scheduledAt}</span>
                </div>
              </div>

              <a className="btn btn-white w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2" href={telemedicineSession.meetingLink} target="_blank" rel="noreferrer">
                <Video size={16} />
                Join Jitsi Meeting
              </a>
            </div>
          )}
        </aside>
      </div>

      <style>{`
        .booking-shell {
          background-color: var(--bg-main);
          min-height: 100vh;
        }

        .card-custom {
          background: white;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-grid .actions {
           grid-column: span 2;
           margin-top: 1rem;
        }

        .form-grid input, .form-grid select, .form-grid textarea {
           background-color: #f8fafc;
           border: 1px solid #e2e8f0;
           padding: 0.75rem 1rem;
           border-radius: 12px;
           width: 100%;
           font-size: 0.95rem;
           color: #1e293b;
           transition: 0.2s;
        }

        .form-grid input:focus, .form-grid select:focus {
           border-color: #3b82f633;
           box-shadow: 0 0 0 4px #3b82f61a;
           outline: none;
           background-color: white;
        }

        .form-grid .field span {
           display: block;
           font-size: 0.85rem;
           font-weight: 700;
           color: #475569;
           margin-bottom: 0.5rem;
           text-transform: uppercase;
           letter-spacing: 0.5px;
        }

        .form-grid .actions button {
           background: #3b82f6;
           color: white;
           border: none;
           padding: 0.85rem 2rem;
           border-radius: 100px;
           font-weight: 700;
           box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
           transition: 0.3s;
        }

        .form-grid .actions button:hover {
           transform: translateY(-2px);
           box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.5);
        }

        .overview-pill {
           transition: all 0.2s ease;
        }

        .overview-pill:hover {
           border-color: #3b82f655 !important;
           background: #eff6ff !important;
        }

        .bullet-v2 {
           width: 6px;
           height: 6px;
           background: #3b82f6;
           border-radius: 50%;
           flex-shrink: 0;
        }

        .card-session-new {
           background: linear-gradient(135deg, #1e293b, #0f172a);
           position: relative;
           overflow: hidden;
        }

        .card-session-new::before {
           content: '';
           position: absolute;
           top: -50px;
           right: -50px;
           width: 150px;
           height: 150px;
           background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
           pointer-events: none;
        }

        .video-icon {
           width: 32px;
           height: 32px;
           background: rgba(255, 255, 255, 0.1);
           color: white;
           border-radius: 8px;
           display: flex;
           align-items: center;
           justify-content: center;
        }

        .btn-white {
           background: white;
           color: #0f172a;
           border: none;
        }

        .btn-white:hover {
           background: #f8fafc;
           transform: translateY(-2px);
        }

        .letter-spacing-1 { letter-spacing: 1px; }
        .fw-500 { font-weight: 500; }
        .tiny { font-size: 0.7rem; }

        @keyframes slideIn {
           from { opacity: 0; transform: translateX(20px); }
           to { opacity: 1; transform: translateX(0); }
        }

        .animate-slide-in {
           animation: slideIn 0.5s ease-out forwards;
        }

        @media (max-width: 768px) {
           .form-grid { grid-template-columns: 1fr; }
           .form-grid .actions { grid-column: span 1; }
        }
      `}</style>
    </section>
  );
}
