import { ButtonOutline } from "../ui/Button";

export function ConfirmationScreen({ selected, formatDate, onReset }) {
  const firstName = selected.name.split(" ")[0];

  return (
    <div className="fade-in" style={{ textAlign: "center", paddingTop: "40px" }}>
      <div className="success-ring" style={{
        width: "90px", height: "90px", borderRadius: "50%",
        background: "linear-gradient(135deg, #c9a84c22, #c9a84c44)",
        border: "2px solid var(--gold)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 32px",
        fontSize: "36px"
      }}>
        ✓
      </div>

      <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "5px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>
        Reserva confirmada
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "34px", fontWeight: 600, marginBottom: "12px" }}>
        ¡Gracias, {firstName}!
      </h1>

      <p style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "var(--text-muted)", marginBottom: "40px", lineHeight: "1.8" }}>
        Te esperamos el <span style={{ color: "var(--gold)" }}>{formatDate(selected.date)}</span><br />
        a las <span style={{ color: "var(--gold)" }}>{selected.time}hs</span> con {selected.barber?.name}
      </p>

      <div className="divider" style={{ width: "200px", margin: "0 auto 32px" }} />

      <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "1px", color: "var(--text-faint)" }}>
        Te enviaremos un recordatorio por WhatsApp al {selected.phone}
      </p>

      <ButtonOutline onClick={onReset} style={{ marginTop: "32px" }}>
        Nueva reserva
      </ButtonOutline>
    </div>
  );
}