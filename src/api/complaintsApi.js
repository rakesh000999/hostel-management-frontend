import api from "./axios";

const pickFirstString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const normalizeComplaint = (item) => {
  if (!item || typeof item !== "object") {
    return item;
  }

  const studentDisplayName = pickFirstString(
    item.studentName,
    item.studentFullName,
    item.complainantName,
    item.userName,
    item.createdByName,
    item.createdBy,
    item.student?.name,
    item.student?.fullName,
    item.user?.name,
    item.user?.fullName,
    item.createdByUser?.name,
    item.createdByUser?.fullName,
  );

  const rawStudentId =
    item.studentId ??
    item.student?.id ??
    item.student?.studentId ??
    item.user?.id ??
    item.userId ??
    item.createdByUser?.id;

  const parsedStudentId = Number(rawStudentId);
  const studentId =
    Number.isFinite(parsedStudentId) && parsedStudentId > 0
      ? parsedStudentId
      : null;

  return {
    ...item,
    studentDisplayName,
    studentId,
  };
};

const toArray = (payload) => {
  const normalizeList = (list) => list.map(normalizeComplaint);

  if (Array.isArray(payload)) {
    return normalizeList(payload);
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  if (Array.isArray(payload.data)) {
    return normalizeList(payload.data);
  }

  if (Array.isArray(payload.content)) {
    return normalizeList(payload.content);
  }

  if (Array.isArray(payload.items)) {
    return normalizeList(payload.items);
  }

  return [];
};

const toObject = (payload) => {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  if (
    payload.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  ) {
    return normalizeComplaint(payload.data);
  }

  return normalizeComplaint(payload);
};

export const createComplaint = async (input) => {
  const response = await api.post("/complaints", input);
  return toObject(response.data);
};

export const getMyComplaints = async () => {
  const response = await api.get("/complaints/my");
  return toArray(response.data);
};

export const getAllComplaints = async () => {
  const response = await api.get("/complaints");
  return toArray(response.data);
};

export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return toObject(response.data);
};

export const updateComplaintStatus = async (id, input) => {
  const response = await api.put(`/complaints/${id}/status`, input);
  return toObject(response.data);
};
