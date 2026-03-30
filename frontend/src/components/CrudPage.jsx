import { useState, useEffect } from "react";
import { request, FormField, SectionHeader, DataTable, formatCell } from "../components/common";

export default function CrudPage({ title, subtitle, endpoint, initialForm, fields, idKey = "id" }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadItems = async () => {
    try {
      const data = await request(endpoint);
      setItems(data || []);
    } catch (error) {
      setMessage("Error loading data: " + error.message);
    }
  };

  useEffect(() => {
    loadItems();
  }, [endpoint]);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    const path = editingId ? `${endpoint}/${editingId}` : endpoint;
    const method = editingId ? "PUT" : "POST";

    const payload = { ...form };
    // Special handling for appointmentId in telemedicine
    if ("appointmentId" in payload && (payload.appointmentId === "" || payload.appointmentId === null)) {
      payload.appointmentId = null;
    }

    try {
      await request(path, { method, body: JSON.stringify(payload) });
      setForm(initialForm);
      setEditingId(null);
      await loadItems();
      setMessage(editingId ? `${title} updated successfully.` : `${title} created successfully.`);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-grid">
      <div className="panel">
        <SectionHeader title={editingId ? `Edit ${title}` : `Create ${title}`} subtitle={subtitle} />
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
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input type="checkbox" checked={form[field.name]} onChange={(e) => setForm({ ...form, [field.name]: e.target.checked })} />
                  <span style={{ fontSize: "0.875rem" }}>Enable/Verified</span>
                </div>
              ) : (
                <input
                  type={field.type || "text"}
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  required={field.required}
                  placeholder={field.label}
                />
              )}
            </FormField>
          ))}
          <div className="actions">
            <button type="submit">{editingId ? "Update Record" : "Save Record"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(initialForm); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </div>

      <div className="panel full-width">
        <SectionHeader title={`${title} Directory`} subtitle="View and manage all records." />
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
    </div>
  );
}
