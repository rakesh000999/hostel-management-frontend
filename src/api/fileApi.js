import api from "./axios";

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"}/files`;

export const getStudentDocumentUrl = (studentId, type) =>
  `${API_BASE}/student/${studentId}/${type}`;

export const getStudentPhotoBlob = async (studentId) => {
  const response = await api.get(`/files/student/${studentId}/photo`, {
    responseType: "blob",
  });
  return response.data;
};

export const getStudentIdentityBlob = async (studentId) => {
  const response = await api.get(`/files/student/${studentId}/identity`, {
    responseType: "blob",
  });
  return response.data;
};

export const getStudentRequestPhotoBlob = async (requestId) => {
  const response = await api.get(`/files/student-request/${requestId}/photo`, {
    responseType: "blob",
  });
  return response.data;
};

export const getStudentRequestIdentityBlob = async (requestId) => {
  const response = await api.get(
    `/files/student-request/${requestId}/identity`,
    {
      responseType: "blob",
    },
  );
  return response.data;
};
