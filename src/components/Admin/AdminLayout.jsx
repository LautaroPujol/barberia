import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "◈" },
  { to: "/admin/appointments", label: "Turnos", icon: "📅" },
  { to: "/admin/barbers", label: "Barberos", icon: "✂" },
  { to: "/admin/services", label: "Servicios", icon: "📋" },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const admin = JSON.parse(localStorage.getItem("adminUser") || "{}");

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px", background: "#0f0f0f", borderRight: "1px solid #1e1a14",
        display: "flex", flexDirection: "column", position: "fixed", height: "100vh",
      }}>
        <div style={{ padding: "28px 24px", borderBottom: "1px solid #1e1a14" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", fontWeight: 700, letterSpacing: "2px" }}>
            <span style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Barber</span>
            <span style={{ color: "#e8dcc877", marginLeft: "6px" }}>Admin</span>
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", color: "#e8dcc833", marginTop: "4px", letterSpacing: "2px" }}>
            {admin.email}
          </div>
        </div>

        <nav style={{ flex: 1, padding: "16px 0" }}>
          {navItems.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 24px", textDecoration: "none",
              fontFamily: "'Lato', sans-serif", fontSize: "13px", letterSpacing: "1.5px",
              textTransform: "uppercase", transition: "all 0.2s",
              color: isActive ? "#c9a84c" : "#e8dcc855",
              background: isActive ? "#c9a84c11" : "transparent",
              borderLeft: isActive ? "2px solid #c9a84c" : "2px solid transparent",
            })}>
              <span style={{ fontSize: "16px" }}>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "20px 24px", borderTop: "1px solid #1e1a14" }}>
          <button onClick={handleLogout} style={{
            width: "100%", background: "transparent", border: "1px solid #2a2520",
            color: "#e8dcc855", padding: "10px", fontFamily: "'Lato', sans-serif",
            fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "#c84c4c"; e.target.style.color = "#c84c4c"; }}
            onMouseLeave={e => { e.target.style.borderColor = "#2a2520"; e.target.style.color = "#e8dcc855"; }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main style={{ marginLeft: "240px", flex: 1, padding: "40px", color: "#e8dcc8" }}>
        {children}
      </main>
    </div>
  );
}