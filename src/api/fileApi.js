import axios from "axios";

const API_BASE = "http://localhost:8080/api/files";

export const getStudentDocumentUrl = (studentId, type) => {
  return `${API_BASE}/student/${studentId}/${type}`;
};
