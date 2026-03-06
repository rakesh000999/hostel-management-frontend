import api from "./axios";

const API_BASE = "http://localhost:8080/api/files";

export const getStudentDocumentUrl = (studentId, type) =>
  `${API_BASE}/student/${studentId}/${type}`;

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
