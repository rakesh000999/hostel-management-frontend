import { useEffect, useState } from "react";
import { getMyRequests, getMyStatus } from "../api/studentRequestApi";

const getStatusCode = (payload) => {
  const raw =
    payload?.status ||
    payload?.requestStatus ||
    payload?.currentStatus ||
    payload?.data?.status ||
    payload?.data?.requestStatus;

  return String(raw || "").toUpperCase();
};

const ELIGIBLE_STATUSES = new Set([
  "APPROVED",
  "ROOM_ASSIGNED",
  "ALLOCATED",
  "ACTIVE",
  "HOSTEL_ASSIGNED",
]);

const hasAnyRoomHints = (payload) => {
  const roomHints = [
    payload?.assignedRoomId,
    payload?.roomId,
    payload?.student?.roomId,
    payload?.assignedRoomNumber,
    payload?.roomNumber,
    payload?.data?.assignedRoomId,
    payload?.data?.roomId,
    payload?.data?.assignedRoomNumber,
    payload?.data?.roomNumber,
  ];

  return roomHints.some(
    (value) =>
      value !== null && value !== undefined && String(value).trim() !== "",
  );
};

const hasRoomAssignment = (payload) => {
  const status = getStatusCode(payload);

  if (ELIGIBLE_STATUSES.has(status)) {
    return true;
  }

  if (hasAnyRoomHints(payload)) {
    return true;
  }

  if (payload?.hasHostelAllocation === true || payload?.isHosteller === true) {
    return true;
  }

  return false;
};

export const useComplaintEligibility = () => {
  const [eligible, setEligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError("");

        const [statusPayload, requestsPayload] = await Promise.all([
          getMyStatus(),
          getMyRequests().catch(() => []),
        ]);

        const requests = Array.isArray(requestsPayload) ? requestsPayload : [];
        const eligibleFromHistory = requests.some((request) =>
          hasRoomAssignment(request),
        );
        const eligibleNow =
          hasRoomAssignment(statusPayload) || eligibleFromHistory;

        if (!mounted) return;
        setEligible(eligibleNow);
      } catch (err) {
        if (!mounted) return;
        setEligible(false);
        setError(
          err?.response?.data?.message ||
            "Unable to verify hostel assignment status.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    eligible,
    loading,
    error,
  };
};
