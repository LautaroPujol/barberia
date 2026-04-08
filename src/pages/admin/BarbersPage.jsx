import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchAdminBarbers, createBarber, updateBarber, toggleBarberAvailability, deleteBarber } from "../../services/api";

const emptyForm = { name: "", specialty: "", avatar: "" };

export default function BarbersPage() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [reasonModal, setReasonModal] = useState(null); // { id, name }
  const [reason, setReason] = useState("");

  const load = async () => {
    setLoading(true);
    try { const data = await fetchAdminBarbers(); setBarbers(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("El nombre es obligatorio");
    try {
      if (editingId) { await updateBarber(editingId, form); }
      else { await createBarber({ ...form, avatar: form.name[0].toUpperCase() }); }
      setShowForm(false); setForm(emptyForm); setEditingId(null);
      load();
    } catch (err) { alert(err.message); }
  };

  const handleEdit = (b) => {
    setForm({ name: b.name, specialty: b.specialty, avatar: b.avatar });
    setEditingId(b._id); setShowForm(true);
  };

  const handleToggle = async (b) => {
    if (b.isAvailable) {
      // Va a deshabilitar — pedir motivo
      setReasonModal({ id: b._id, name: b.name });
      setReason("");
    } else {
      // Habilitar directamente
      try { await toggleBarberAvailability(b._id, true); load(); }
      catch (err) { alert(err.message); }
    }
  };

  const handleReasonConfirm = async () => {
    try {
      await toggleBarberAvailability(reasonModal.id, false, reason || "No disponible");
      setReasonModal(null); load();
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este barbero permanentemente?")) return;
    try { await deleteBarber(id); load(); }
    catch (err) { alert(err.message); }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
        <div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "5px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "8px" }}>Gestión</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 600 }}>Barberos</h1>
        </div>
        <button onClick={() => { setShowForm(true); setForm(emptyForm); setEditingId(null); }}
          style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a1208", border: "none", padding: "12px 28px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
          + Agregar barbero
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div style={{ background: "#141414", border: "1px solid #c9a84c44", padding: "28px", marginBottom: "28px" }}>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "20px" }}>
            {editingId ? "Editar barbero" : "Nuevo barbero"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            {[["Nombre", "name", "Ej: Rodrigo M."], ["Especialidad", "specialty", "Ej: Clásico & Fade"]].map(([label, key, placeholder]) => (
              <div key={key}>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#e8dcc855", textTransform: "uppercase", marginBottom: "8px" }}>{label}</div>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder}
                  style={{ width: "100%", background: "#0f0f0f", border: "none", borderBottom: "1px solid #3a3020", color: "#e8dcc8", padding: "10px 0", fontFamily: "'Lato', sans-serif", fontSize: "14px", outline: "none" }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={handleSubmit}
              style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", color: "#1a1208", border: "none", padding: "12px 28px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700, cursor: "pointer" }}>
              {editingId ? "Guardar cambios" : "Crear barbero"}
            </button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }}
              style={{ background: "transparent", border: "1px solid #2a2520", color: "#e8dcc855", padding: "12px 24px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal motivo */}
      {reasonModal && (
        <div style={{ position: "fixed", inset: 0, background: "#000000aa", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#141414", border: "1px solid #2a2520", padding: "32px", maxWidth: "400px", width: "100%" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", marginBottom: "8px" }}>Deshabilitar barbero</div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "13px", color: "#e8dcc877", marginBottom: "20px" }}>
              ¿Por qué no va a estar disponible <strong style={{ color: "#e8dcc8" }}>{reasonModal.name}</strong>?
            </div>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Ej: Enfermo, Vacaciones, etc."
              style={{ width: "100%", background: "#0f0f0f", border: "none", borderBottom: "1px solid #3a3020", color: "#e8dcc8", padding: "10px 0", fontFamily: "'Lato', sans-serif", fontSize: "14px", outline: "none", marginBottom: "20px" }}
            />
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={handleReasonConfirm}
                style={{ background: "#a84c4c", color: "white", border: "none", padding: "12px 24px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
                Deshabilitar
              </button>
              <button onClick={() => setReasonModal(null)}
                style={{ background: "transparent", border: "1px solid #2a2520", color: "#e8dcc855", padding: "12px 20px", fontFamily: "'Lato', sans-serif", fontSize: "11px", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista */}
      <div style={{ display: "grid", gap: "12px" }}>
        {loading ? (
          <div style={{ color: "#e8dcc833", fontFamily: "'Lato', sans-serif", padding: "20px" }}>Cargando...</div>
        ) : barbers.map(b => (
          <div key={b._id} style={{ background: "#141414", border: `1px solid ${b.isAvailable ? "#2a2520" : "#a84c4c44"}`, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: b.isAvailable ? "linear-gradient(135deg, #c9a84c22, #c9a84c44)" : "#2a1a1a", border: `1px solid ${b.isAvailable ? "#c9a84c44" : "#a84c4c44"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: "18px", color: b.isAvailable ? "#c9a84c" : "#a84c4c" }}>
                {b.avatar}
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#e8dcc8" }}>{b.name}</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", color: "#e8dcc855" }}>{b.specialty}</div>
                {!b.isAvailable && b.unavailableReason && (
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", color: "#a84c4c", marginTop: "2px" }}>⚠ {b.unavailableReason}</div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "1px", color: b.isAvailable ? "#6ca84c" : "#a84c4c", textTransform: "uppercase" }}>
                {b.isAvailable ? "● Disponible" : "● No disponible"}
              </span>
              <button onClick={() => handleToggle(b)}
                style={{ background: b.isAvailable ? "#a84c4c22" : "#6ca84c22", border: `1px solid ${b.isAvailable ? "#a84c4c44" : "#6ca84c44"}`, color: b.isAvailable ? "#a84c4c" : "#6ca84c", padding: "8px 14px", fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                {b.isAvailable ? "Deshabilitar" : "Habilitar"}
              </button>
              <button onClick={() => handleEdit(b)}
                style={{ background: "#c9a84c22", border: "1px solid #c9a84c44", color: "#c9a84c", padding: "8px 14px", fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                Editar
              </button>
              <button onClick={() => handleDelete(b._id)}
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