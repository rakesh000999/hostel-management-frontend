import client from "./client";

export const submitStudentRequest = async (formData) => {
  const response = await client.post("/student-requests/submit", formData);
  return response.data;
};

export const getMyRequestStatus = async () => {
  const response = await client.get("/student-requests/my-status");
  return response.data;
};

export const getMyRequests = async () => {
  const response = await client.get("/student-requests/my-requests");
  return response.data;
};

export const getPendingRequests = async () => {
  const response = await client.get("/student-requests/pending");
  return response.data;
};

export const getAllRequests = async () => {
  const response = await client.get("/student-requests/all");
  return response.data;
};

export const getRequestById = async (requestId) => {
  const response = await client.get(`/student-requests/${requestId}`);
  return response.data;
};

export const approveRequest = async (requestId) => {
  const response = await client.post(`/student-requests/${requestId}/approve`);
  return response.data;
};

export const assignRoom = async (requestId, roomId) => {
  const response = await client.post(
    `/student-requests/${requestId}/assign-room`,
    { roomId },
  );
  return response.data;
};

export const rejectRequest = async (requestId, reason) => {
  const response = await client.post(`/student-requests/${requestId}/reject`, {
    reason,
  });
  return response.data;
};

export const getRequestPhotoBlob = async (requestId) => {
  const response = await client.get(
    `/files/student-request/${requestId}/photo`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};

export const getRequestIdentityBlob = async (requestId) => {
  const response = await client.get(
    `/files/student-request/${requestId}/identity`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};

export const getStudents = async () => {
  const response = await client.get("/students");
  return response.data;
};

export const getAvailableRooms = async () => {
  const response = await client.get("/rooms/available");
  return response.data;
};
