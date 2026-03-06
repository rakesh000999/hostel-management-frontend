import api from "./axios";

export const getAllRooms = async () => {
  const response = await api.get("/rooms");
  return response.data;
};

export const getAvailableRooms = async () => {
  const response = await api.get("/rooms/available");
  return response.data;
};

export const createRoomWithImage = async ({
  roomNumber,
  capacity,
  occupiedCount = 0,
  rentPerMonth,
  image,
}) => {
  const payload = new FormData();
  payload.append("roomNumber", String(roomNumber));
  payload.append("capacity", String(capacity));
  payload.append("occupiedCount", String(occupiedCount));
  payload.append("rentPerMonth", String(rentPerMonth));
  payload.append("image", image);

  const response = await api.post("/rooms", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateRoomWithImage = async (
  roomId,
  { roomNumber, capacity, occupiedCount, rentPerMonth, image },
) => {
  const payload = new FormData();
  payload.append("roomNumber", String(roomNumber));
  payload.append("capacity", String(capacity));
  payload.append("occupiedCount", String(occupiedCount));
  payload.append("rentPerMonth", String(rentPerMonth));
  if (image) {
    payload.append("image", image);
  }

  const response = await api.put(`/rooms/${roomId}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
