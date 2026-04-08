import { useState } from "react";
import { ButtonOutline } from "../ui/Button";

const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAY_NAMES = ["Do","Lu","Ma","Mi","Ju","Vi","Sá"];

function getDaysInMonth(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function DateTimePicker({ selectedDate, selectedTime, today, availableSlots, loading, onSelectDate, onSelectTime, formatDate }) {
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const days = getDaysInMonth(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "5px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "12px" }}>
          Paso 3 de 4
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "32px", fontWeight: 600 }}>
          Fecha y horario
        </h1>
      </div>

      {/* Calendario */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "28px", marginBottom: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <ButtonOutline onClick={prevMonth} style={{ padding: "8px 16px", fontSize: "16px" }}>‹</ButtonOutline>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", letterSpacing: "2px" }}>
            {MONTH_NAMES[currentMonth]} {currentYear}
          </div>
          <ButtonOutline onClick={nextMonth} style={{ padding: "8px 16px", fontSize: "16px" }}>›</ButtonOutline>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", textAlign: "center", marginBottom: "8px" }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)", padding: "4px" }}>{d}</div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {Array(firstDay).fill(null).map((_, i) => <div key={i} />)}
          {days.map(day => {
            const isPast = day < today;
            const isSunday = day.getDay() === 0;
            const isSelected = selectedDate?.toDateString() === day.toDateString();
            const isDisabled = isPast || isSunday;
            return (
              <div
                key={day.toDateString()}
                className={`day-cell ${isDisabled ? "disabled" : ""} ${isSelected ? "active" : ""}`}
                style={{ margin: "0 auto" }}
                onClick={() => !isDisabled && onSelectDate(day)}
              >
                {day.getDate()}
              </div>
            );
          })}
        </div>

        <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "2px", color: "var(--text-faint)", textAlign: "center", marginTop: "16px" }}>
          LOS DOMINGOS NO ATENDEMOS
        </div>
      </div>

      {/* Horarios disponibles */}
      {selectedDate && (
        <div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "4px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>
            Horarios disponibles — {formatDate(selectedDate)}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", padding: "20px" }}>
              Cargando horarios...
            </div>
          ) : availableSlots.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-body)", padding: "20px" }}>
              No hay horarios disponibles para este día.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {availableSlots.map(t => (
                <div
                  key={t}
                  className={`time-chip ${selectedTime === t ? "active" : ""}`}
                  onClick={() => onSelectTime(t)}
                >
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}