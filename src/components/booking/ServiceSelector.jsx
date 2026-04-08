import { CardSelect } from "../ui/Card";

export function ServiceSelector({ services, selected, onSelect }) {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "5px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>
          Paso 1 de 4
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 600 }}>
          Elegí tu servicio
        </h1>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {services.map((s) => (
          <CardSelect key={s._id} active={selected?._id === s._id} onClick={() => onSelect(s)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <span style={{ fontSize: "24px" }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "17px", marginBottom: "4px" }}>{s.name}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-dim)", letterSpacing: "1px" }}>{s.duration} min</div>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--gold)" }}>
                ${s.price.toLocaleString("es-AR")}
              </div>
            </div>
          </CardSelect>
        ))}
      </div>
    </div>
  );
}