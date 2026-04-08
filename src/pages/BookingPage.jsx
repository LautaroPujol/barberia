import { useBooking } from "../hooks/useBooking";
import { StepIndicator } from "../components/ui/StepIndicator";
import { ButtonGold, ButtonOutline } from "../components/ui/Button";
import { ServiceSelector } from "../components/booking/ServiceSelector";
import { BarberSelector } from "../components/booking/BarberSelector";
import { DateTimePicker } from "../components/booking/DateTimePicker";
import { ContactForm } from "../components/booking/ContactForm";
import { ConfirmationScreen } from "../components/booking/ConfirmationScreen";

export default function BookingPage() {
  const {
    step, selected, confirmed, today,
    services, barbers, availableSlots,
    loading, error,
    updateField, canProceed,
    nextStep, prevStep, confirm, reset, formatDate,
  } = useBooking();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid #1e1a14", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "22px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>
            <span className="shine">Barber</span>
            <span style={{ color: "var(--text-muted)", marginLeft: "6px" }}>& Co.</span>
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "4px", color: "var(--text-faint)", marginTop: "2px", textTransform: "uppercase" }}>
            Est. Buenos Aires · 2010
          </div>
        </div>
        <a href="/admin/login" style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "3px", color: "#c9a84c33", textTransform: "uppercase", textDecoration: "none" }}>
          Admin
        </a>
      </header>

      <main style={{ flex: 1, maxWidth: "740px", margin: "0 auto", width: "100%", padding: "48px 24px 80px" }}>
        {loading && step === 1 && services.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", fontFamily: "var(--font-body)", color: "var(--text-muted)", letterSpacing: "2px" }}>Cargando...</div>
        )}
        {error && (
          <div style={{ background: "#2a0a0a", border: "1px solid #c84c4c", color: "#e8c8c8", padding: "14px 20px", marginBottom: "24px", fontFamily: "var(--font-body)", fontSize: "13px" }}>
            ⚠️ {error}
          </div>
        )}
        {!confirmed ? (
          <>
            <StepIndicator currentStep={step} />
            <div className="fade-in" key={step}>
              {step === 1 && <ServiceSelector services={services} selected={selected.service} onSelect={(s) => updateField("service", s)} />}
              {step === 2 && <BarberSelector barbers={barbers} selected={selected.barber} onSelect={(b) => updateField("barber", b)} />}
              {step === 3 && <DateTimePicker selectedDate={selected.date} selectedTime={selected.time} today={today} availableSlots={availableSlots} loading={loading} onSelectDate={(d) => updateField("date", d)} onSelectTime={(t) => updateField("time", t)} formatDate={formatDate} />}
              {step === 4 && <ContactForm selected={selected} onChangeName={(v) => updateField("name", v)} onChangePhone={(v) => updateField("phone", v)} formatDate={formatDate} />}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "48px" }}>
              {step > 1 ? <ButtonOutline onClick={prevStep}>← Anterior</ButtonOutline> : <div />}
              {step < 4
                ? <ButtonGold disabled={!canProceed() || loading} onClick={nextStep}>Continuar →</ButtonGold>
                : <ButtonGold disabled={!canProceed() || loading} onClick={confirm}>{loading ? "Confirmando..." : "Confirmar Turno ✓"}</ButtonGold>
              }
            </div>
          </>
        ) : (
          <ConfirmationScreen selected={selected} formatDate={formatDate} onReset={reset} />
        )}
      </main>

      <footer style={{ borderTop: "1px solid #1e1a14", padding: "20px 40px", display: "flex", justifyContent: "center", gap: "32px" }}>
        {["Av. Corrientes 1234, CABA", "Lun–Sáb 9:00–19:00", "+54 11 4000-0000"].map(t => (
          <span key={t} style={{ fontFamily: "var(--font-body)", fontSize: "11px", letterSpacing: "1px", color: "var(--text-faint)" }}>{t}</span>
        ))}
      </footer>
    </div>
  );
}