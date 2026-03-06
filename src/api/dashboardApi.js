import api from "./axios";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export const getTotalStudentsCount = async () => {
  const response = await api.get("/students");
  const students = Array.isArray(response.data) ? response.data : [];
  return students.length;
};
