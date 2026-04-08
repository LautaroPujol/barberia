import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchDashboard, fetchMonthlyStats } from "../../services/api";

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function StatCard({ label, value, sub, color = "#c9a84c" }) {
  return (
    <div style={{ background: "#141414", border: "1px solid #2a2520", borderTop: `2px solid ${color}`, padding: "24px 28px" }}>
      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#e8dcc855", textTransform: "uppercase", marginBottom: "12px" }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "#e8dcc8", marginBottom: "4px" }}>{value}</div>
      {sub && <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", color: "#e8dcc833" }}>{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchMonthlyStats()])
      .then(([dash, monthly]) => { setData(dash); setStats(monthly); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const maxTurnos = Math.max(...stats.map(s => s.turnos), 1);

  return (
    <AdminLayout>
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "5px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "8px" }}>Panel principal</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", fontWeight: 600 }}>Dashboard</h1>
      </div>

      {loading ? (
        <div style={{ color: "#e8dcc855", fontFamily: "'Lato', sans-serif" }}>Cargando...</div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
            <StatCard label="Turnos hoy" value={data?.totalToday ?? 0} sub="confirmados" />
            <StatCard label="Turnos este mes" value={data?.totalMonth ?? 0} sub="total" color="#6ca84c" />
            <StatCard label="Ingresos del mes" value={`$${(data?.monthlyRevenue ?? 0).toLocaleString("es-AR")}`} sub="estimado" color="#4c8ca8" />
            <StatCard label="Cancelados" value={data?.totalCancelled ?? 0} sub="histórico" color="#a84c4c" />
          </div>

          {/* Gráfico de barras */}
          <div style={{ background: "#141414", border: "1px solid #2a2520", padding: "28px", marginBottom: "40px" }}>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "24px" }}>
              Turnos — últimos 6 meses
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "120px" }}>
              {stats.map((s) => (
                <div key={`${s._id.year}-${s._id.month}`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", color: "#e8dcc877" }}>{s.turnos}</div>
                  <div style={{
                    width: "100%", background: "linear-gradient(to top, #c9a84c, #f0d080)",
                    height: `${(s.turnos / maxTurnos) * 90}px`, minHeight: "4px", transition: "height 0.5s",
                  }} />
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", color: "#e8dcc833", letterSpacing: "1px" }}>
                    {MONTHS[s._id.month - 1]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Próximos turnos */}
          <div style={{ background: "#141414", border: "1px solid #2a2520", padding: "28px" }}>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a84c", textTransform: "uppercase", marginBottom: "20px" }}>
              Próximos turnos de hoy
            </div>
            {data?.upcomingAppointments?.length === 0 ? (
              <div style={{ color: "#e8dcc833", fontFamily: "'Lato', sans-serif", fontSize: "13px" }}>No hay más turnos por hoy.</div>
            ) : (
              data?.upcomingAppointments?.map(a => (
                <div key={a._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1e1a14" }}>
                  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#c9a84c", minWidth: "50px" }}>{a.timeSlot}</div>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "15px", color: "#e8dcc8" }}>{a.clientName}</div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", color: "#e8dcc855" }}>{a.service?.name} · {a.barber?.name}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "12px", color: "#e8dcc833" }}>{a.clientPhone}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}