import { useState } from "react";

const validate = (name, phone) => {
  const errors = {};
  if (!name.trim()) {
    errors.name = "El nombre es obligatorio";
  } else if (name.trim().length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres";
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
    errors.name = "El nombre solo puede contener letras";
  }

  if (!phone.trim()) {
    errors.phone = "El teléfono es obligatorio";
  } else if (phone.trim().length < 8) {
    errors.phone = "El teléfono debe tener al menos 8 dígitos";
  } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
    errors.phone = "El teléfono solo puede contener números";
  }

  return errors;
};

export function ContactForm({ selected, onChangeName, onChangePhone, formatDate, onValidate }) {
  const [touched, setTouched] = useState({ name: false, phone: false });
  const errors = validate(selected.name, selected.phone);

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const summaryRows = [
    ["Servicio", selected.service?.name],
    ["Barbero", selected.barber?.name],
    ["Fecha", formatDate(selected.date)],
    ["Horario", selected.time],
    ["Total", `$${selected.service?.price?.toLocaleString("es-AR")}`],
  ];

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "5px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>
          Paso 4 de 4
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 600 }}>
          Tus datos
        </h1>
      </div>

      {/* Resumen */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--gold)",
        padding: "20px 24px",
        marginBottom: "32px"
      }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "4px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "14px" }}>
          Resumen
        </div>
        {summaryRows.map(([label, value]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", letterSpacing: "1px", color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "14px" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Inputs */}
      <div style={{ display: "grid", gap: "28px" }}>
        {/* Nombre */}
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
            Nombre completo
          </div>
          <input
            className="input-field"
            placeholder="Ej: Juan Pérez"
            value={selected.name}
            maxLength={60}
            onChange={(e) => onChangeName(e.target.value)}
            onBlur={() => handleBlur("name")}
            style={{ borderBottomColor: touched.name && errors.name ? "#c84c4c" : undefined }}
          />
          {touched.name && errors.name && (
            <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#c84c4c", marginTop: "6px" }}>
              ⚠ {errors.name}
            </div>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>
            WhatsApp
          </div>
          <input
            className="input-field"
            placeholder="Ej: 11 1234-5678"
            value={selected.phone}
            maxLength={20}
            onChange={(e) => onChangePhone(e.target.value)}
            onBlur={() => handleBlur("phone")}
            style={{ borderBottomColor: touched.phone && errors.phone ? "#c84c4c" : undefined }}
          />
          {touched.phone && errors.phone && (
            <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "#c84c4c", marginTop: "6px" }}>
              ⚠ {errors.phone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Exportamos la función validate para usarla en useBooking
export { validate as validateContact };