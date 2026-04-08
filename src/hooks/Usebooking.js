import { useState, useEffect } from "react";
import { fetchServices, fetchBarbers, fetchAvailableSlots, createAppointment } from "../services/api";

const today = new Date();
today.setHours(0, 0, 0, 0);

const initialState = {
  service: null,
  barber: null,
  date: null,
  time: null,
  name: "",
  phone: "",
};

export function useBooking() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(initialState);
  const [confirmed, setConfirmed] = useState(false);

  // Datos desde el backend
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Estados de carga y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar servicios y barberos al montar
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [servicesData, barbersData] = await Promise.all([
          fetchServices(),
          fetchBarbers(),
        ]);
        setServices(servicesData);
        setBarbers(barbersData);
      } catch (err) {
        setError("No se pudo conectar con el servidor. Verificá que el backend esté corriendo.");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Cargar horarios disponibles cuando cambia barbero o fecha
  useEffect(() => {
    if (!selected.barber || !selected.date) return;

    const loadSlots = async () => {
      setLoading(true);
      try {
        const data = await fetchAvailableSlots(selected.barber._id, selected.date);
        setAvailableSlots(data.availableSlots);
      } catch (err) {
        setError("No se pudieron cargar los horarios disponibles.");
      } finally {
        setLoading(false);
      }
    };
    loadSlots();
  }, [selected.barber, selected.date]);

  const updateField = (field, value) =>
    setSelected((prev) => ({ ...prev, [field]: value }));

  const canProceed = () => {
    if (step === 1) return selected.service !== null;
    if (step === 2) return selected.barber !== null;
    if (step === 3) return selected.date !== null && selected.time !== null;
    if (step === 4) {
      const nameOk = selected.name.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(selected.name);
      const phoneOk = selected.phone.trim().length >= 8 && /^[\d\s\-\+\(\)]+$/.test(selected.phone);
      return nameOk && phoneOk;
    }
    return true;
  };

  const nextStep = () => { setError(null); setStep((s) => s + 1); };
  const prevStep = () => { setError(null); setStep((s) => s - 1); };

  const confirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await createAppointment({
        clientName: selected.name,
        clientPhone: selected.phone,
        serviceId: selected.service._id,
        barberId: selected.barber._id,
        date: selected.date.toISOString(),
        timeSlot: selected.time,
      });
      setConfirmed(true);
    } catch (err) {
      setError(err.message || "No se pudo confirmar el turno. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSelected(initialState);
    setConfirmed(false);
    setError(null);
    setAvailableSlots([]);
  };

  const formatDate = (d) => {
    if (!d) return "";
    return d.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  return {
    step, selected, confirmed, today,
    services, barbers, availableSlots,
    loading, error,
    updateField, canProceed,
    nextStep, prevStep, confirm, reset, formatDate,
  };
}