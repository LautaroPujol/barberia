import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchAllAppointments, updateAppointmentStatus } from "../../services/api";

const STATUS_LABELS = { confirmed: "Confirmado", cancelled: "Cancelado", completed: "Completado", pending: "Pendiente" };
const STATUS_COLORS = { confirmed: "#4c8ca8", cancelled: "#a84c4c", completed: "#6ca84c", pending: "#a8884c" };

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterStatus, setFilterStatus] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterStatus) params.status = filterStatus;
      const data = await fetchAllAppointments(params);
      setAppointments(data.appointments);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filterDate, filterStatus]);

  const handleStatus = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      load();
    } catch (err) { alert(err.message); }
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "5px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "8px" }}>Gestión</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 600 }}>Turnos</h1>
      </div>

      {/* Filtros */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "28px" }}>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          style={{ background: "#141414", border: "1px solid #2a2520", borderBottom: "1px solid #c9a84c55", color: "#e8dcc8", padding: "10px 14px", fontFamily: "'Lato', sans-serif", fontSize: "13px", outline: "none" }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ background: "#141414", border: "1px solid #2a2520", color: "#e8dcc8", padding: "10px 14px", fontFamily: "'Lato', sans-serif", fontSize: "13px", outline: "none" }}>
          <option value="">Todos los estados</option>
          <option value="confirmed">Confirmado</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <button onClick={() => setFilterDate("")} style={{ background: "transparent", border: "1px solid #2a2520", color: "#e8dcc855", padding: "10px 20px", fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
          Ver todos
        </button>
      </div>

      {/* Tabla */}
      <div style={{ background: "#141414", border: "1px solid #2a2520" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr 120px 160px", gap: "0", borderBottom: "1px solid #2a2520", padding: "12px 20px" }}>
          {["Hora", "Cliente", "Servicio", "Barbero", "Estado", "Acciones"].map(h => (
            <div key={h} style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#e8dcc833", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#e8dcc833", fontFamily: "'Lato', sans-serif" }}>Cargando...</div>
        ) : appointments.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#e8dcc833", fontFamily: "'Lato', sans-serif" }}>No hay turnos para mostrar.</div>
        ) : (
          appointments.map(a => (
            <div key={a._id} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr 120px 160px", gap: "0", padding: "16px 20px", borderBottom: "1px solid #1a1a1a", alignItems: "center" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#c9a84c" }}>{a.timeSlot}</div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", color: "#e8dcc8" }}>{a.clientName}</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", color: "#e8dcc844" }}>{a.clientPhone}</div>
              </div>
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "12px", color: "#e8dcc877" }}>{a.service?.name}</div>
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "12px", color: "#e8dcc877" }}>{a.barber?.name}</div>
              <div>
                <span style={{ background: `${STATUS_COLORS[a.status]}22`, border: `1px solid ${STATUS_COLORS[a.status]}55`, color: STATUS_COLORS[a.status], padding: "4px 10px", fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "1px" }}>
                  {STATUS_LABELS[a.status]}
                </span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                {a.status === "confirmed" && (
                  <>
                    <button onClick={() => handleStatus(a._id, "completed")}
                      style={{ background: "#6ca84c22", border: "1px solid #6ca84c44", color: "#6ca84c", padding: "6px 10px", fontFamily: "'Lato', sans-serif", fontSize: "10px", cursor: "pointer", letterSpacing: "1px" }}>
                      ✓ Listo
                    </button>
                    <button onClick={() => handleStatus(a._id, "cancelled")}
                      style={{ background: "#a84c4c22", border: "1px solid #a84c4c44", color: "#a84c4c", padding: "6px 10px", fontFamily: "'Lato', sans-serif", fontSize: "10px", cursor: "pointer", letterSpacing: "1px" }}>
                      ✕ Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}