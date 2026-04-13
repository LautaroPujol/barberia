const BASE_URL = import.meta.env.VITE_API_URL + "/api";
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error en la solicitud");
  return data;
};

const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});

// --- Público ---
export const fetchServices = () => fetch(`${BASE_URL}/services`).then(handleResponse);
export const fetchBarbers = () => fetch(`${BASE_URL}/barbers`).then(handleResponse);

export const fetchAvailableSlots = (barberId, date) => {
  const dateStr = date.toISOString().split("T")[0];
  return fetch(`${BASE_URL}/appointments/available?barberId=${barberId}&date=${dateStr}`).then(handleResponse);
};

export const createAppointment = (data) =>
  fetch(`${BASE_URL}/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse);

// --- Admin: Auth ---
export const adminLogin = (email, password) =>
  fetch(`${BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);

// --- Admin: Dashboard ---
export const fetchDashboard = () =>
  fetch(`${BASE_URL}/admin/dashboard`, { headers: authHeader() }).then(handleResponse);

export const fetchMonthlyStats = () =>
  fetch(`${BASE_URL}/admin/stats/monthly`, { headers: authHeader() }).then(handleResponse);

// --- Admin: Turnos ---
export const fetchAllAppointments = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return fetch(`${BASE_URL}/admin/appointments?${query}`, { headers: authHeader() }).then(handleResponse);
};

export const updateAppointmentStatus = (id, status) =>
  fetch(`${BASE_URL}/admin/appointments/${id}/status`, {
    method: "PATCH", headers: authHeader(), body: JSON.stringify({ status }),
  }).then(handleResponse);

// --- Admin: Barberos ---
export const fetchAdminBarbers = () =>
  fetch(`${BASE_URL}/admin/barbers`, { headers: authHeader() }).then(handleResponse);

export const createBarber = (data) =>
  fetch(`${BASE_URL}/admin/barbers`, {
    method: "POST", headers: authHeader(), body: JSON.stringify(data),
  }).then(handleResponse);

export const updateBarber = (id, data) =>
  fetch(`${BASE_URL}/admin/barbers/${id}`, {
    method: "PATCH", headers: authHeader(), body: JSON.stringify(data),
  }).then(handleResponse);

export const toggleBarberAvailability = (id, isAvailable, unavailableReason = "") =>
  fetch(`${BASE_URL}/admin/barbers/${id}/availability`, {
    method: "PATCH", headers: authHeader(),
    body: JSON.stringify({ isAvailable, unavailableReason }),
  }).then(handleResponse);

export const deleteBarber = (id) =>
  fetch(`${BASE_URL}/admin/barbers/${id}`, {
    method: "DELETE", headers: authHeader(),
  }).then(handleResponse);

// --- Admin: Servicios ---
export const fetchAdminServices = () =>
  fetch(`${BASE_URL}/admin/services`, { headers: authHeader() }).then(handleResponse);

export const createService = (data) =>
  fetch(`${BASE_URL}/admin/services`, {
    method: "POST", headers: authHeader(), body: JSON.stringify(data),
  }).then(handleResponse);

export const updateService = (id, data) =>
  fetch(`${BASE_URL}/admin/services/${id}`, {
    method: "PATCH", headers: authHeader(), body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteService = (id) =>
  fetch(`${BASE_URL}/admin/services/${id}`, {
    method: "DELETE", headers: authHeader(),
  }).then(handleResponse);