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
    <section className="symptom-shell">
      <div className="symptom-main">
        <div className="symptom-hero">
          <div className="symptom-hero-copy">
            <div className="symptom-hero-badge">
              <Sparkles size={16} />
              <span>AI-assisted symptom triage</span>
            </div>
            <SectionHeader
              title="AI Symptom Checker"
              subtitle="Describe symptoms in plain language to get a preliminary care direction and a doctor specialty recommendation before you book."
            />
          </div>

          <div className="symptom-hero-grid">
            <div className="symptom-hero-metric">
              <ShieldAlert size={18} />
              <div>
                <strong>Urgency signal</strong>
                <span>LOW to EMERGENCY</span>
              </div>
            </div>
            <div className="symptom-hero-metric">
              <Stethoscope size={18} />
              <div>
                <strong>Specialty mapping</strong>
                <span>Routes into doctor booking</span>
              </div>
            </div>
            <div className="symptom-hero-metric">
              <CalendarClock size={18} />
              <div>
                <strong>Faster handoff</strong>
                <span>Pre-fills appointment context</span>
              </div>
            </div>
          </div>
        </div>

        <div className="symptom-panel">
          <div className="symptom-panel-head">
            <div>
              <h3>Patient Input</h3>
              <p>Use clear symptom phrases. Include duration and existing conditions where relevant.</p>
            </div>
            <div className="symptom-panel-tag">Step 1</div>
          </div>

          <form className="form-grid" onSubmit={submit}>
            <FormField label="Symptoms">
              <textarea
                className="symptom-textarea"
                value={form.symptoms}
                onChange={(event) => setForm({ ...form, symptoms: event.target.value })}
                rows={7}
                placeholder="Example: fever for three days, sore throat, dry cough, mild chest discomfort"
                required
              />
            </FormField>

            <div className="symptom-form-grid">
              <FormField label="Age">
                <input
                  type="number"
                  min="0"
                  value={form.age}
                  onChange={(event) => setForm({ ...form, age: event.target.value })}
                  placeholder="Optional"
                />
              </FormField>

              <FormField label="Gender">
                <select
                  value={form.gender}
                  onChange={(event) => setForm({ ...form, gender: event.target.value })}
                >
                  <option value="">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>

              <FormField label="Duration">
                <input
                  value={form.duration}
                  onChange={(event) => setForm({ ...form, duration: event.target.value })}
                  placeholder="Example: 3 days"
                />
              </FormField>

              <FormField label="Existing Conditions">
                <input
                  value={form.existingConditions}
                  onChange={(event) => setForm({ ...form, existingConditions: event.target.value })}
                  placeholder="Example: asthma, diabetes"
                />
              </FormField>
            </div>

            <div className="symptom-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Symptoms"}
              </button>
              <p>Clinical guidance only. This does not replace a licensed doctor.</p>
            </div>
          </form>

          {error && <p className="message error">{error}</p>}
        </div>
      </div>

      <aside className="symptom-aside">


        {result && (
          <div className={`symptom-card symptom-result tone-${urgencyTone}`}>
            <div className="symptom-result-head">
              <div className="symptom-icon"><Brain size={18} /></div>
              <span className="symptom-ai-badge">
                {result.aiGenerated ? "Gemini Analysis" : "Fallback Analysis"}
              </span>
            </div>

            <h3>{result.recommendedSpecialty}</h3>
            <p className="symptom-summary">{result.summary}</p>

            <div className="symptom-result-stat">
              <Activity size={16} />
              <span>Urgency: {result.urgencyLevel}</span>
            </div>

            <div className="symptom-result-stat">
              <Stethoscope size={16} />
              <span>Recommended specialty: {result.recommendedSpecialty}</span>
            </div>

            <div className="symptom-section">
              <h4>Possible concerns</h4>
              <ul>
                {result.possibleConcerns?.map((concern) => (
                  <li key={concern}>{concern}</li>
                ))}
              </ul>
            </div>

            <div className="symptom-section">
              <h4>Next steps</h4>
              <ul>
                {result.nextSteps?.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="symptom-disclaimer">
              <AlertTriangle size={16} />
              <span>{result.disclaimer}</span>
            </div>

            <button className="symptom-book-btn" type="button" onClick={continueToBooking}>
              Find Doctors
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </aside>

      <style>{`
        .symptom-shell {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(340px, 0.95fr);
          gap: 1.5rem;
          align-items: start;
        }

        .symptom-main {
          display: grid;
          gap: 1.25rem;
        }

        .symptom-hero,
        .symptom-panel,
        .symptom-card {
          background: rgba(15, 23, 42, 0.72);
          border: 1px solid rgba(148, 163, 184, 0.15);
          border-radius: 24px;
          padding: 1.5rem;
          box-shadow: 0 18px 40px rgba(2, 6, 23, 0.18);
        }

        .symptom-hero {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(56, 189, 248, 0.16), transparent 30%),
            linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(30, 41, 59, 0.86));
        }

        .symptom-hero::after {
          content: "";
          position: absolute;
          inset: auto -30px -40px auto;
          width: 180px;
          height: 180px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.18), transparent 70%);
          pointer-events: none;
        }

        .symptom-hero-copy .section-header {
          margin-bottom: 0;
        }

        .symptom-hero-copy .section-header h2 {
          color: #f8fafc;
          margin-top: 0.9rem;
        }

        .symptom-hero-copy .section-header p {
          color: rgba(226, 232, 240, 0.82);
          max-width: 780px;
        }

        .symptom-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.48rem 0.8rem;
          border-radius: 999px;
          background: rgba(14, 165, 233, 0.12);
          border: 1px solid rgba(125, 211, 252, 0.2);
          color: #bae6fd;
          font-size: 0.84rem;
          font-weight: 600;
        }

        .symptom-hero-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.85rem;
          margin-top: 1.35rem;
        }

        .symptom-hero-metric {
          display: flex;
          gap: 0.8rem;
          align-items: flex-start;
          padding: 1rem;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.44);
          border: 1px solid rgba(148, 163, 184, 0.12);
          color: #e2e8f0;
        }

        .symptom-hero-metric strong {
          display: block;
          font-size: 0.95rem;
          color: #f8fafc;
        }

        .symptom-hero-metric span {
          display: block;
          margin-top: 0.2rem;
          color: rgba(226, 232, 240, 0.72);
          font-size: 0.84rem;
        }

        .symptom-panel-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .symptom-panel-head h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .symptom-panel-head p {
          margin: 0.35rem 0 0;
          color: rgba(226, 232, 240, 0.72);
        }

        .symptom-panel-tag {
          padding: 0.45rem 0.75rem;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.12);
          color: #93c5fd;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }

        .symptom-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }

        .symptom-panel .field span {
          color: #dbeafe;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .symptom-panel input,
        .symptom-panel select,
        .symptom-panel textarea {
          background: rgba(248, 250, 252, 0.98);
          border-color: rgba(191, 219, 254, 0.55);
          color: #0f172a;
          box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        .symptom-panel input::placeholder,
        .symptom-panel textarea::placeholder {
          color: #64748b;
        }

        .symptom-panel input:focus,
        .symptom-panel select:focus,
        .symptom-panel textarea:focus {
          outline: none;
          border-color: #38bdf8;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.16);
          background: #ffffff;
        }

        .symptom-textarea {
          min-height: 190px;
          resize: vertical;
        }

        .symptom-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .symptom-actions p {
          margin: 0;
          color: rgba(226, 232, 240, 0.62);
          font-size: 0.88rem;
        }

        .symptom-aside {
          display: grid;
          gap: 1rem;
          align-content: start;
          position: sticky;
          top: 104px;
        }

        .symptom-card h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.9rem;
          color: #f8fafc;
        }

        .symptom-card ul {
          display: grid;
          gap: 0.75rem;
          padding-left: 1rem;
          margin: 0;
          color: rgba(226, 232, 240, 0.86);
        }

        .symptom-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #7dd3fc;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.18), rgba(59, 130, 246, 0.22));
          border: 1px solid rgba(125, 211, 252, 0.18);
          margin-bottom: 1rem;
        }

        .symptom-result-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .symptom-ai-badge {
          padding: 0.45rem 0.7rem;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.14);
          color: #93c5fd;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .symptom-summary {
          color: rgba(226, 232, 240, 0.84);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .symptom-result-stat,
        .symptom-disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          color: rgba(226, 232, 240, 0.88);
          margin-bottom: 0.8rem;
        }

        .symptom-section {
          margin-top: 1.2rem;
        }

        .symptom-section h4 {
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
          color: #f8fafc;
        }

        .symptom-book-btn {
          width: 100%;
          margin-top: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.55rem;
        }

        .tone-danger {
          border-color: rgba(248, 113, 113, 0.35);
          box-shadow: 0 22px 44px rgba(127, 29, 29, 0.18);
        }

        .tone-warning {
          border-color: rgba(251, 191, 36, 0.32);
          box-shadow: 0 22px 44px rgba(120, 53, 15, 0.18);
        }

        .tone-success {
          border-color: rgba(74, 222, 128, 0.28);
          box-shadow: 0 22px 44px rgba(20, 83, 45, 0.16);
        }

        .tone-info {
          border-color: rgba(96, 165, 250, 0.28);
          box-shadow: 0 22px 44px rgba(30, 64, 175, 0.16);
        }

        @media (max-width: 1024px) {
          .symptom-shell {
            grid-template-columns: 1fr;
          }

          .symptom-aside {
            position: static;
          }

          .symptom-hero-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .symptom-form-grid {
            grid-template-columns: 1fr;
          }

          .symptom-panel-head,
          .symptom-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </section>
  );
}
