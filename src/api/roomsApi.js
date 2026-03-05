import api from "./axios";

export const getAllRooms = async () => {
  const response = await api.get("/rooms");
  return response.data;
};

export const getAvailableRooms = async () => {
  const response = await api.get("/rooms/available");
  return response.data;
};
