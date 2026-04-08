import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await adminLogin(email, password);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "400px", padding: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, letterSpacing: "3px", marginBottom: "8px" }}>
            <span style={{ background: "linear-gradient(135deg, #c9a84c, #f0d080)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Barber</span>
            <span style={{ color: "#e8dcc877", marginLeft: "6px" }}>Admin</span>
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "4px", color: "#e8dcc833", textTransform: "uppercase" }}>
            Panel de administración
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: "24px" }}>
          {error && (
            <div style={{ background: "#2a0a0a", border: "1px solid #c84c4c44", color: "#e8a8a8", padding: "12px 16px", fontFamily: "'Lato', sans-serif", fontSize: "13px" }}>
              ⚠️ {error}
            </div>
          )}
          <div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#e8dcc855", textTransform: "uppercase", marginBottom: "8px" }}>Email</div>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: "100%", background: "#141414", border: "none", borderBottom: "1px solid #3a3020", color: "#e8dcc8", padding: "12px 0", fontFamily: "'Lato', sans-serif", fontSize: "15px", outline: "none" }}
              placeholder="admin@barberco.com"
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#e8dcc855", textTransform: "uppercase", marginBottom: "8px" }}>Contraseña</div>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: "100%", background: "#141414", border: "none", borderBottom: "1px solid #3a3020", color: "#e8dcc8", padding: "12px 0", fontFamily: "'Lato', sans-serif", fontSize: "15px", outline: "none" }}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} style={{
            background: "linear-gradient(135deg, #c9a84c, #f0d080, #c9a84c)",
            color: "#1a1208", border: "none", padding: "16px",
            fontFamily: "'Lato', sans-serif", fontSize: "12px", letterSpacing: "3px",
            textTransform: "uppercase", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1, marginTop: "8px",
          }}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a href="/" style={{ fontFamily: "'Lato', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#e8dcc833", textDecoration: "none", textTransform: "uppercase" }}>
            ← Volver al sitio
          </a>
        </div>
      </div>
    </div>
  );
}