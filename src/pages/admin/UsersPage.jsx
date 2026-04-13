import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

const BASE_URL = import.meta.env.VITE_API_URL + "/api";
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentAdmin = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUsers(data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setError(""); setSuccess("");
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return setError("Todos los campos son obligatorios");
    }
    if (form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres");
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        method: "POST", headers: authHeader(), body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(`Usuario ${data.admin.email} creado correctamente`);
      setShowForm(false);
      setForm({ name: "", email: "", password: "" });
      load();
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async (id, email) => {
    if (!confirm(`¿Eliminar al administrador ${email}?`)) return;
    setError(""); setSuccess("");
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${id}`, { method: "DELETE", headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("Administrador eliminado");
      load();
    } catch (err) { setError(err.message); }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "5px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "8px" }}>Gestión</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 600 }}>Administradores</h1>
        </div>
        {currentAdmin.isMain && (
          <button onClick={() => { setShowForm(true); setForm({ name: "", email: "", password: "" }); setError(""); }}
            style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a1208", border: "none", padding: "12px 28px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
            + Nuevo administrador
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: "#2a0a0a", border: "1px solid #c84c4c44", color: "#e8a8a8", padding: "12px 16px", fontFamily: "'Lato', sans-serif", fontSize: "13px", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#0a2a0a", border: "1px solid #4ca84c44", color: "#a8e8a8", padding: "12px 16px", fontFamily: "'Lato', sans-serif", fontSize: "13px", marginBottom: "20px" }}>
          ✓ {success}
        </div>
      )}

      {/* Formulario nuevo admin */}
      {showForm && (
        <div style={{ background: "#141414", border: "1px solid #c9a84c44", padding: "28px", marginBottom: "28px" }}>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "20px" }}>
            Nuevo administrador
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            {[["Nombre", "name", "text", "Ej: Rodrigo"], ["Email", "email", "email", "admin@barberia.com"], ["Contraseña", "password", "password", "Mínimo 6 caracteres"]].map(([label, key, type, placeholder]) => (
              <div key={key}>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#e8dcc855", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                  style={{ width: "100%", background: "#0f0f0f", border: "none", borderBottom: "1px solid #3a3020", color: "#e8dcc8", padding: "10px 0", fontFamily: "'Lato', sans-serif", fontSize: "14px", outline: "none" }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleCreate}
              style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a1208", border: "none", padding: "12px 28px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
              Crear administrador
            </button>
            <button onClick={() => setShowForm(false)}
              style={{ background: "transparent", border: "1px solid #2a2520", color: "#e8dcc855", padding: "12px 24px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de admins */}
      <div style={{ display: "grid", gap: "12px" }}>
        {loading ? (
          <div style={{ color: "#e8dcc833", fontFamily: "'Lato', sans-serif", padding: "20px" }}>Cargando...</div>
        ) : users.map(u => (
          <div key={u._id} style={{ background: "#141414", border: `1px solid ${u.isMain ? "#c9a84c44" : "#2a2520"}`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: u.isMain ? "linear-gradient(135deg, #c9a84c22, #c9a84c44)" : "#1a1a1a", border: `1px solid ${u.isMain ? "#c9a84c44" : "#2a2520"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "18px", color: u.isMain ? "#c9a84c" : "#e8dcc855" }}>
                {(u.name || u.email)[0].toUpperCase()}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#e8dcc8" }}>{u.name || "Sin nombre"}</div>
                  {u.isMain && <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "9px", letterSpacing: "2px", color: "#c9a84c", background: "#c9a84c11", border: "1px solid #c9a84c44", padding: "2px 8px", textTransform: "uppercase" }}>Principal</span>}
                </div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "12px", color: "#e8dcc855" }}>{u.email}</div>
              </div>
            </div>
            {currentAdmin.isMain && !u.isMain && (
              <button onClick={() => handleDelete(u._id, u.email)}
                style={{ background: "#a84c4c22", border: "1px solid #a84c4c44", color: "#a84c4c", padding: "8px 16px", fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}