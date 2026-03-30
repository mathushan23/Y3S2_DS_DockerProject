const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function request(path, options = {}) {
  const url = `${apiBaseUrl}${path}`;
  console.log(`[API Request] ${options.method || "GET"} ${url}`, options);

  const token = localStorage.getItem("token");
 
  try {
    const response = await fetch(url, {
      headers: { 
        "Content-Type": "application/json", 
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...(options.headers || {}) 
      },
      ...options
    });

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
      // Prioritize the 'error' field from the backend, then 'message', then specific validation 'errors'
      const errorMsg = body?.error || body?.message || 
                      (body?.errors ? Object.values(body.errors).join(", ") : null) || 
                      `Request failed with status ${response.status}`;
      
      console.error(`[API Error] ${response.status} ${url}`, { errorMsg, body });
      throw new Error(errorMsg);
    }

    console.log(`[API Success] ${url}`, body);
    return body;
  } catch (err) {
    if (err.name === "TypeError" && err.message === "Failed to fetch") {
      const connectionError = `Unable to connect to the backend at ${apiBaseUrl}. Please ensure the backend services are running.`;
      console.error(`[Network Error] ${url}`, connectionError);
      throw new Error(connectionError);
    }
    console.error(`[Request Exception] ${url}`, err);
    throw err;
  }
}

export function FormField({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

export function DataTable({ columns, rows }) {
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

export function formatCell(value, type) {
  if (type === "checkbox") {
    return value ? "Yes" : "No";
  }
  return value ?? "-";
}
