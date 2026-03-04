import api from "./axios";

export const submitRequest = async (data) => {
  const response = await api.post("/student-requests/submit", data);
  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get("/student-requests/my-requests");
  return response.data;
};

export const getPendingRequests = async () => {
  const response = await api.get("/student-requests/pending");
  return response.data;
};

export const getAllRequests = async () => {
  const response = await api.get("/student-requests/all");
  return response.data;
};

export const getRequestById = async (id) => {
  const response = await api.get(`/student-requests/${id}`);
  return response.data;
};

export const approveRequest = async (id) => {
  const response = await api.post(`/student-requests/${id}/approve`);
  return response.data;
};

export const rejectRequest = async (id, reason) => {
  const response = await api.post(`/student-requests/${id}/reject`, { reason });
  return response.data;
};

export const assignRoom = async (id, roomId) => {
  const response = await api.post(`/student-requests/${id}/assign-room`, {
    roomId,
  });
  return response.data;
};

export const unassignRoom = async (id) => {
  const response = await api.post(`/student-requests/${id}/unassign-room`);
  return response.data;
};
