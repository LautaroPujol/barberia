import { CardSelect } from "../ui/Card";

export function BarberSelector({ barbers, selected, onSelect }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "5px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>
          Paso 2 de 4
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 600 }}>
          Elegí tu barbero
        </h1>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {barbers.map((b) => (
          <CardSelect key={b._id} active={selected?._id === b._id} onClick={() => onSelect(b)}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "linear-gradient(135deg, #c9a84c22, #c9a84c44)",
                border: "1px solid #c9a84c44",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--gold)"
              }}>
                {b.avatar}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "4px" }}>{b.name}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-dim)", letterSpacing: "1px" }}>{b.specialty}</div>
              </div>
            </div>
          </CardSelect>
        ))}
      </div>
    </div>
  );
}