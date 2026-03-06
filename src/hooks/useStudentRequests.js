import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignRoom,
  approveRequest,
  getAllRequests,
  getMyRequests,
  getMyRequestStatus,
  getPendingRequests,
  getRequestById,
  getRequestIdentityBlob,
  getRequestPhotoBlob,
  getStudents,
  getAvailableRooms,
  rejectRequest,
  submitStudentRequest,
} from "../api/studentRequests";

export const studentRequestKeys = {
  all: ["studentRequests"],
  myStatus: ["studentRequests", "myStatus"],
  myRequests: ["studentRequests", "myRequests"],
  pending: ["studentRequests", "pending"],
  allAdmin: ["studentRequests", "all"],
  details: (id) => ["studentRequests", "details", id],
  students: ["students"],
  rooms: ["rooms", "available"],
};

export const useAvailableRoomsQuery = () =>
  useQuery({
    queryKey: studentRequestKeys.rooms,
    queryFn: getAvailableRooms,
  });

export const useStudentsQuery = () =>
  useQuery({
    queryKey: studentRequestKeys.students,
    queryFn: getStudents,
  });

export const useMyRequestStatusQuery = () =>
  useQuery({
    queryKey: studentRequestKeys.myStatus,
    queryFn: getMyRequestStatus,
  });

export const useMyRequestsQuery = () =>
  useQuery({
    queryKey: studentRequestKeys.myRequests,
    queryFn: getMyRequests,
  });

export const usePendingRequestsQuery = () =>
  useQuery({
    queryKey: studentRequestKeys.pending,
    queryFn: getPendingRequests,
  });

export const useAllRequestsQuery = () =>
  useQuery({
    queryKey: studentRequestKeys.allAdmin,
    queryFn: getAllRequests,
  });

export const useRequestDetailsQuery = (requestId) =>
  useQuery({
    queryKey: studentRequestKeys.details(requestId),
    queryFn: () => getRequestById(requestId),
    enabled: Boolean(requestId),
  });

const invalidateAdminQueues = (queryClient, requestId) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: studentRequestKeys.pending }),
    queryClient.invalidateQueries({ queryKey: studentRequestKeys.allAdmin }),
    queryClient.invalidateQueries({ queryKey: studentRequestKeys.students }),
    queryClient.invalidateQueries({ queryKey: studentRequestKeys.rooms }),
    queryClient.invalidateQueries({ queryKey: studentRequestKeys.myStatus }),
    queryClient.invalidateQueries({ queryKey: studentRequestKeys.myRequests }),
    requestId
      ? queryClient.invalidateQueries({
          queryKey: studentRequestKeys.details(requestId),
        })
      : Promise.resolve(),
  ]);

export const useSubmitStudentRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitStudentRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: studentRequestKeys.myStatus,
        }),
        queryClient.invalidateQueries({
          queryKey: studentRequestKeys.myRequests,
        }),
        queryClient.invalidateQueries({ queryKey: studentRequestKeys.rooms }),
      ]);
    },
  });
};

export const useApproveRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveRequest,
    onSuccess: async (_, requestId) => {
      await invalidateAdminQueues(queryClient, requestId);
    },
  });
};

export const useAssignRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, roomId }) => assignRoom(requestId, roomId),
    onSuccess: async (_, variables) => {
      await invalidateAdminQueues(queryClient, variables?.requestId);
    },
  });
};

export const useRejectRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, reason }) => rejectRequest(requestId, reason),
    onSuccess: async (_, variables) => {
      await invalidateAdminQueues(queryClient, variables?.requestId);
    },
  });
};

export const useOpenPhotoMutation = () =>
  useMutation({
    mutationFn: async (requestId) => {
      const blob = await getRequestPhotoBlob(requestId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      return { message: "Photo opened in new tab." };
    },
  });

export const useOpenIdentityMutation = () =>
  useMutation({
    mutationFn: async (requestId) => {
      const blob = await getRequestIdentityBlob(requestId);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 15000);
      return { message: "Identity document opened in new tab." };
    },
  });
