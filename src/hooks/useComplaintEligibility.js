import { useEffect, useState } from "react";
import { getMyStatus } from "../api/studentRequestApi";

const getStatusCode = (payload) => String(payload?.status || "").toUpperCase();

const hasRoomAssignment = (payload) => {
  const status = getStatusCode(payload);

  if (["ROOM_ASSIGNED", "ALLOCATED", "ACTIVE", "HOSTEL_ASSIGNED"].includes(status)) {
    return true;
  }

  const roomHints = [
    payload?.assignedRoomId,
    payload?.roomId,
    payload?.student?.roomId,
    payload?.assignedRoomNumber,
    payload?.roomNumber,
  ];

  if (roomHints.some((value) => value !== null && value !== undefined && String(value).trim() !== "")) {
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
        const statusPayload = await getMyStatus();
        if (!mounted) return;
        setEligible(hasRoomAssignment(statusPayload));
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
