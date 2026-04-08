import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchAdminServices, createService, updateService, deleteService } from "../../services/api";

const emptyForm = { name: "", duration: "", price: "", icon: "✂" };
const ICONS = ["✂", "🪒", "✦", "◈", "⭐", "🎨"];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try { const data = await fetchAdminServices(); setServices(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price || !form.duration) return alert("Completá todos los campos");
    try {
      const payload = { ...form, price: Number(form.price), duration: Number(form.duration) };
      if (editingId) { await updateService(editingId, payload); }
      else { await createService(payload); }
      setShowForm(false); setForm(emptyForm); setEditingId(null);
      load();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, duration: s.duration, price: s.price, icon: s.icon });
    setEditingId(s._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    try { await deleteService(id); load(); }
    catch (err) { alert(err.message); }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "5px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "8px" }}>Gestión</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 600 }}>Servicios</h1>
        </div>
        <button onClick={() => { setShowForm(true); setForm(emptyForm); setEditingId(null); }}
          style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a1208", border: "none", padding: "12px 28px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
          + Agregar servicio
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div style={{ background: "#141414", border: "1px solid #c9a84c44", padding: "28px", marginBottom: "28px" }}>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "20px" }}>
            {editingId ? "Editar servicio" : "Nuevo servicio"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            {[["Nombre", "name", "Ej: Corte de Cabello", "text"], ["Duración (min)", "duration", "Ej: 30", "number"], ["Precio ($)", "price", "Ej: 3500", "number"]].map(([label, key, placeholder, type]) => (
              <div key={key}>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#e8dcc855", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                  style={{ width: "100%", background: "#0f0f0f", border: "none", borderBottom: "1px solid #3a3020", color: "#e8dcc8", padding: "10px 0", fontFamily: "'Lato', sans-serif", fontSize: "14px", outline: "none" }}
                />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#e8dcc855", textTransform: "uppercase", marginBottom: "12px" }}>Ícono</div>
            <div style={{ display: "flex", gap: "10px" }}>
              {ICONS.map(icon => (
                <button key={icon} onClick={() => setForm(f => ({ ...f, icon }))}
                  style={{ width: "44px", height: "44px", background: form.icon === icon ? "#c9a84c22" : "#0f0f0f", border: `1px solid ${form.icon === icon ? "#c9a84c" : "#2a2520"}`, fontSize: "20px", cursor: "pointer" }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleSubmit}
              style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a1208", border: "none", padding: "12px 28px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
              {editingId ? "Guardar cambios" : "Crear servicio"}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }}
              style={{ background: "transparent", border: "1px solid #2a2520", color: "#e8dcc855", padding: "12px 24px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div style={{ display: "grid", gap: "12px" }}>
        {loading ? (
          <div style={{ color: "#e8dcc833", fontFamily: "'Lato', sans-serif", padding: "20px" }}>Cargando...</div>
        ) : services.map(s => (
          <div key={s._id} style={{ background: "#141414", border: "1px solid #2a2520", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "26px" }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#e8dcc8" }}>{s.name}</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", color: "#e8dcc855" }}>{s.duration} min</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "#c9a84c" }}>
                ${s.price.toLocaleString("es-AR")}
              </div>
              <button onClick={() => handleEdit(s)}
                style={{ background: "#c9a84c22", border: "1px solid #c9a84c44", color: "#c9a84c", padding: "8px 14px", fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                Editar
              </button>
              <button onClick={() => handleDelete(s._id)}
                style={{ background: "transparent", border: "1px solid #2a2520", color: "#e8dcc833", padding: "8px 14px", fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}