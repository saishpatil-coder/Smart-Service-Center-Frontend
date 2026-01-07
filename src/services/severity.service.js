import api from "@/lib/axios";

export const fetchSeverities = () => api.get(`/severities`);
export const updateSeverity = (id, data) =>
  api.put(`/severities/${id}`, data);
export const createSeverity = (data) =>
  api.post(`/severities`, data);
export const deleteSeverity = (id) =>
  api.delete(`/severities/${id}`);
