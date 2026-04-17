import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, AlertTriangle, ArrowRight, Brain, CalendarClock, ShieldAlert, Sparkles, Stethoscope } from "lucide-react";
import { request, FormField, SectionHeader } from "../components/common";

const initialForm = {
  symptoms: "",
  age: "",
  gender: "",
  duration: "",
  existingConditions: ""
};

function parseConditions(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getUrgencyTone(level) {
  switch (level) {
    case "EMERGENCY":
      return "danger";
    case "HIGH":
      return "warning";
    case "LOW":
      return "success";
    default:
      return "info";
  }
}

export default function SymptomChecker() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const urgencyTone = useMemo(
    () => getUrgencyTone(result?.urgencyLevel),
    [result?.urgencyLevel]
  );

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await request("/api/symptoms/analyze", {
        method: "POST",
        body: JSON.stringify({
          symptoms: form.symptoms,
          age: form.age ? Number(form.age) : null,
          gender: form.gender || null,
          duration: form.duration || null,
          existingConditions: parseConditions(form.existingConditions)
        })
      });

      setResult(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const continueToBooking = () => {
    if (!result?.recommendedSpecialty) {
      return;
    }

    navigate("/appointments", {
      state: {
        recommendedSpecialty: result.recommendedSpecialty,
        symptomSummary: result.summary,
        urgencyLevel: result.urgencyLevel
      }
    });
  };

  return (
    <section className="symptom-shell container-fluid p-4">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="symptom-main d-grid gap-4">
            <div className="card-custom hero-panel-new shadow-sm border-0 rounded-4 p-4 overflow-hidden position-relative">
              <div className="row align-items-center position-relative z-1">
                <div className="col-md-7">
                  <div className="badge-ai-new mb-3">
                    <Sparkles size={16} className="me-2 text-primary" />
                    <span>AI-assisted symptom triage</span>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">AI Symptom Checker</h2>
                  <p className="text-secondary mb-4">Describe symptoms in plain language to get a preliminary care direction and a doctor specialty recommendation before you book.</p>
                </div>
                <div className="col-md-5">
                   <div className="metrics-grid-new">
                      <div className="metric-pill shadow-sm border">
                         <ShieldAlert size={18} className="text-danger" />
                         <div className="ms-3">
                            <strong className="text-dark small d-block">Urgency signal</strong>
                            <span className="text-muted tiny">LOW to EMERGENCY</span>
                         </div>
                      </div>
                      <div className="metric-pill shadow-sm border mt-3">
                         <Stethoscope size={18} className="text-primary" />
                         <div className="ms-3">
                            <strong className="text-dark small d-block">Specialty mapping</strong>
                            <span className="text-muted tiny">Routes into doctor booking</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="card-custom shadow-sm border-0 rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold text-dark mb-1">Patient Assessment</h4>
                  <p className="text-secondary small">Use clear symptom phrases for better AI analysis.</p>
                </div>
                <div className="step-badge">Phase 1</div>
              </div>

              <form className="form-grid-new" onSubmit={submit}>
                <div className="full-width mb-4">
                   <label className="fw-bold text-secondary small mb-2 d-block">DESCRIBE YOUR SYMPTOMS</label>
                   <textarea
                    className="form-control bg-light border-light-subtle rounded-4 p-3 shadow-none"
                    value={form.symptoms}
                    onChange={(event) => setForm({ ...form, symptoms: event.target.value })}
                    rows={6}
                    placeholder="Example: persistent fever for three days, dry cough, mild chest discomfort..."
                    required
                  />
                </div>

                <div className="row g-3 mb-4">
                   <div className="col-md-3">
                      <label className="fw-bold text-secondary tiny mb-1 d-block">AGE</label>
                      <input
                        type="number"
                        className="form-control bg-light border-light-subtle rounded-3 py-2"
                        value={form.age}
                        onChange={(event) => setForm({ ...form, age: event.target.value })}
                        placeholder="Optional"
                      />
                   </div>
                   <div className="col-md-3">
                      <label className="fw-bold text-secondary tiny mb-1 d-block">GENDER</label>
                      <select
                        className="form-select bg-light border-light-subtle rounded-3 py-2"
                        value={form.gender}
                        onChange={(event) => setForm({ ...form, gender: event.target.value })}
                      >
                        <option value="">Select</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                      </select>
                   </div>
                   <div className="col-md-3">
                      <label className="fw-bold text-secondary tiny mb-1 d-block">DURATION</label>
                      <input
                        className="form-control bg-light border-light-subtle rounded-3 py-2"
                        value={form.duration}
                        onChange={(event) => setForm({ ...form, duration: event.target.value })}
                        placeholder="e.g. 3 days"
                      />
                   </div>
                   <div className="col-md-3">
                      <label className="fw-bold text-secondary tiny mb-1 d-block">CHRONIC CONDITIONS</label>
                      <input
                        className="form-control bg-light border-light-subtle rounded-3 py-2"
                        value={form.existingConditions}
                        onChange={(event) => setForm({ ...form, existingConditions: event.target.value })}
                        placeholder="e.g. diabetes"
                      />
                   </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm" disabled={loading}>
                    {loading ? "Analyzing Context..." : "Start AI Analysis"}
                  </button>
                  <p className="text-muted tiny mb-0 fst-italic">This tool is for guidance only and doesn't replace professional medical advice.</p>
                </div>
              </form>

              {error && <p className="alert alert-danger mt-4 small border-0 py-2 rounded-3">{error}</p>}
            </div>
          </div>
        </div>

        <aside className="col-lg-4">
          <div className="sticky-aside">
            {result && (
              <div className={`card-custom symptom-result-new shadow-sm border-0 rounded-4 overflow-hidden animate-slide-up tone-${urgencyTone}`}>
                <div className="result-header p-4 d-flex justify-content-between align-items-center border-bottom bg-light">
                  <div className="d-flex align-items-center gap-2">
                    <div className="brain-icon-v2">
                       <Brain size={18} />
                    </div>
                    <span className="fw-bold text-dark small">Gemini AI Engine</span>
                  </div>
                  <span className={`urgency-tag urgency-${result.urgencyLevel?.toLowerCase()}`}>
                    {result.urgencyLevel}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="fw-bold text-dark h4 mb-3">{result.recommendedSpecialty}</h3>
                  <p className="text-secondary small mb-4 lh-base">{result.summary}</p>

                  <div className="concerns-box mb-4 p-3 rounded-4 bg-light bg-opacity-50 border">
                    <h6 className="fw-bold text-dark small mb-3 opacity-75 d-flex align-items-center gap-2">
                       <Activity size={14} className="text-primary" />
                       POSSIBLE CONCERNS
                    </h6>
                    <ul className="list-unstyled mb-0">
                      {result.possibleConcerns?.map((concern) => (
                        <li key={concern} className="small text-secondary fw-500 mb-2">• {concern}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="next-steps mb-4">
                    <h6 className="fw-bold text-dark small mb-3 opacity-75 d-flex align-items-center gap-2">
                       <CalendarClock size={14} className="text-primary" />
                       RECOMMENDED STEPS
                    </h6>
                    <ul className="list-unstyled mb-0">
                      {result.nextSteps?.map((step) => (
                        <li key={step} className="small text-secondary fw-500 mb-2">• {step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="disclaimer-chip p-3 rounded-4 bg-danger-subtle border-0 mb-4 d-flex gap-2 align-items-start">
                    <AlertTriangle size={16} className="text-danger flex-shrink-0 mt-1" />
                    <span className="tiny text-danger fw-bold">{result.disclaimer}</span>
                  </div>

                  <button className="btn btn-primary w-100 rounded-pill py-2 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2" type="button" onClick={continueToBooking}>
                    Find Best Doctors
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
            
            {!result && !loading && (
               <div className="card-custom shadow-sm border-0 rounded-4 p-5 text-center bg-light-subtle border-dashed">
                  <Brain size={48} className="text-muted opacity-25 mb-3" />
                  <p className="text-muted small">Your AI health analysis will appear here after submission.</p>
               </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        .symptom-shell {
          background-color: var(--bg-main);
          min-height: 100vh;
        }

        .card-custom {
          background: white;
        }

        .hero-panel-new {
           background-image: radial-gradient(at 100% 0%, #f0f9ff 0%, transparent 40%);
        }

        .badge-ai-new {
          display: inline-flex;
          align-items: center;
          background: #eff6ff;
          color: #1d4ed8;
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .metric-pill {
           background: white;
           padding: 1rem;
           border-radius: 16px;
           display: flex;
           align-items: center;
        }

        .step-badge {
           background: #f8fafc;
           color: #64748b;
           padding: 6px 14px;
           border-radius: 100px;
           font-size: 0.75rem;
           font-weight: 800;
           border: 1px solid #e2e8f0;
        }

        .brain-icon-v2 {
           width: 36px;
           height: 36px;
           background: #eff6ff;
           color: #3b82f6;
           border-radius: 10px;
           display: flex;
           align-items: center;
           justify-content: center;
        }

        .urgency-tag {
           padding: 4px 12px;
           border-radius: 6px;
           font-size: 0.7rem;
           font-weight: 800;
           text-transform: uppercase;
        }

        .urgency-emergency { background: #fee2e2; color: #ef4444; }
        .urgency-high { background: #fef3c7; color: #d97706; }
        .urgency-low { background: #dcfce7; color: #10b981; }

        .symptom-result-new {
           border-top: 4px solid #3b82f6 !important;
        }

        .tone-danger { border-top-color: #ef4444 !important; }
        .tone-warning { border-top-color: #d97706 !important; }
        .tone-success { border-top-color: #10b981 !important; }

        .sticky-aside {
           position: sticky;
           top: 2rem;
        }

        .tiny { font-size: 0.7rem; }
        .fw-500 { font-weight: 500; }
        .border-dashed { border-style: dashed !important; border-width: 2px !important; }

        @keyframes slideUp {
           from { opacity: 0; transform: translateY(20px); }
           to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up {
           animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @media (max-width: 991px) {
           .sticky-aside { position: static; margin-top: 1.5rem; }
        }
      `}</style>
    </section>
  );
}
