import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SecureImage from "../components/common/SecureImage";
import { getRoomById } from "../api/roomsApi";
import api from "../api/axios";

const getOccupiedCount = (room) => {
  const fromStudents = Array.isArray(room?.students) ? room.students.length : null;
  const fromBackend = Number(room?.occupiedCount);
  const rawCount = fromStudents !== null ? fromStudents : Number.isFinite(fromBackend) ? fromBackend : 0;
  const capacity = Number(room?.capacity);

  if (!Number.isFinite(capacity)) {
    return Math.max(0, rawCount);
  }

  return Math.min(Math.max(0, rawCount), Math.max(0, capacity));
};

const studentBelongsToRoom = (student, room) => {
  const roomId = Number(room?.id);
  const studentRoomId = Number(student?.roomId || student?.room?.id);
  const roomNumber = String(room?.roomNumber || "").trim();
  const studentRoomNumber = String(
    student?.roomNumber || student?.room?.roomNumber || student?.assignedRoomNumber || "",
  ).trim();

  if (Number.isFinite(roomId) && Number.isFinite(studentRoomId) && studentRoomId === roomId) {
    return true;
  }

  if (roomNumber && studentRoomNumber && roomNumber === studentRoomNumber) {
    return true;
  }

  return false;
};

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [studentsInRoom, setStudentsInRoom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRoomById(id);
        setRoom(data);

        const occupied = getOccupiedCount(data);
        const directStudents = Array.isArray(data?.students) ? data.students : [];

        if (directStudents.length > 0 || occupied === 0) {
          setStudentsInRoom(directStudents);
          return;
        }

        // Fallback: infer room students from students API when backend room detail
        // does not include embedded student list.
        setStudentsLoading(true);
        try {
          const studentsResponse = await api.get("/students");
          const allStudents = Array.isArray(studentsResponse.data)
            ? studentsResponse.data
            : [];
          const filtered = allStudents.filter((student) =>
            studentBelongsToRoom(student, data),
          );
          setStudentsInRoom(filtered);
        } catch {
          setStudentsInRoom([]);
        } finally {
          setStudentsLoading(false);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load room details.");
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading room details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="p-6 text-slate-600">
        Room not found.
      </div>
    );
  }

  const occupied = getOccupiedCount(room);
  const capacity = Number(room.capacity) || 0;
  const available = Math.max(0, capacity - occupied);
  const students = Array.isArray(studentsInRoom) ? studentsInRoom : [];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <button
          type="button"
          onClick={() => navigate("/rooms")}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Back to Rooms
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Room</p>
              <h1 className="text-3xl font-bold text-slate-900">#{room.roomNumber}</h1>
              <p className="mt-1 text-sm text-slate-500">Detailed occupancy and residents information.</p>
            </div>
            <div className="h-28 w-36 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {room.imageUrl ? (
                <SecureImage
                  src={room.imageUrl}
                  alt={`Room ${room.roomNumber}`}
                  className="h-full w-full object-cover"
                  fallback={<div className="h-full w-full flex items-center justify-center text-xs text-slate-500">No image</div>}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-slate-500">No image</div>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Capacity</p>
              <p className="text-xl font-bold text-slate-900">{capacity}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Occupied</p>
              <p className="text-xl font-bold text-slate-900">{occupied}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Available</p>
              <p className="text-xl font-bold text-emerald-600">{available}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Rent / Month</p>
              <p className="text-xl font-bold text-slate-900">Rs. {room.rentPerMonth || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-semibold text-slate-900">Students In This Room</h2>
          <p className="mt-1 text-sm text-slate-500">Click a student to view profile details.</p>

          {studentsLoading ? (
            <p className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
              Resolving room occupants...
            </p>
          ) : students.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              {occupied > 0
                ? "Occupied count exists, but student links are missing in response."
                : "No students assigned yet."}
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student.id} className={`border-t border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                      <td className="px-4 py-3">#{student.id}</td>
                      <td className="px-4 py-3 font-medium">
                        <Link to={`/students/${student.id}`} className="text-indigo-700 hover:underline">
                          {student.name || student.fullName || "Unnamed"}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{student.email || "-"}</td>
                      <td className="px-4 py-3">{student.phone || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
