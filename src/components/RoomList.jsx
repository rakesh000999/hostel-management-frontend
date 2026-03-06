import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { ROOM_DATA_CHANGED_EVENT } from "../utils/roomEvents";
import SecureImage from "./common/SecureImage";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/rooms");
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError(err?.response?.data?.message || "Failed to fetch rooms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    const onRoomDataChanged = () => {
      fetchRooms();
    };

    window.addEventListener(ROOM_DATA_CHANGED_EVENT, onRoomDataChanged);
    const intervalId = window.setInterval(fetchRooms, 15000);

    return () => {
      window.removeEventListener(ROOM_DATA_CHANGED_EVENT, onRoomDataChanged);
      window.clearInterval(intervalId);
    };
  }, []);

  const totalRooms = rooms.length;
  const totalCapacity = rooms.reduce((sum, room) => sum + (Number(room.capacity) || 0), 0);
  const totalOccupied = rooms.reduce((sum, room) => sum + getOccupiedCount(room), 0);
  const totalAvailable = Math.max(0, totalCapacity - totalOccupied);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Room List</h3>
          <p className="text-sm text-slate-500">Live room occupancy and student assignment overview.</p>
        </div>

        <button
          type="button"
          onClick={fetchRooms}
          disabled={loading}
          className="rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-900 disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Total Rooms</p>
          <p className="text-xl font-bold text-slate-900">{totalRooms}</p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Total Capacity</p>
          <p className="text-xl font-bold text-slate-900">{totalCapacity}</p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Occupied</p>
          <p className="text-xl font-bold text-slate-900">{totalOccupied}</p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
          <p className="text-xs text-slate-500">Available</p>
          <p className="text-xl font-bold text-emerald-600">{totalAvailable}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Room Image</th>
              <th className="py-3 px-4 text-left font-semibold">Room No.</th>
              <th className="py-3 px-4 text-left font-semibold">Capacity</th>
              <th className="py-3 px-4 text-left font-semibold">Occupied</th>
              <th className="py-3 px-4 text-left font-semibold">Rent (per month)</th>
              <th className="py-3 px-4 text-left font-semibold">Students</th>
            </tr>
          </thead>

          <tbody>
            {rooms.length > 0 ? (
              rooms.map((r, index) => (
                <tr
                  key={r.id}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition duration-150`}
                >
                  <td className="py-3 px-4">
                    {r.imageUrl ? (
                      <SecureImage
                        src={r.imageUrl}
                        alt={`Room ${r.roomNumber}`}
                        className="h-12 w-16 rounded object-cover border border-gray-200"
                        fallback={<span className="text-gray-400 italic">No image</span>}
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {r.roomNumber}
                  </td>
                  <td className="py-3 px-4">{r.capacity}</td>
                  <td className="py-3 px-4">{getOccupiedCount(r)}</td>
                  <td className="py-3 px-4">Rs. {r.rentPerMonth}</td>
                  <td className="py-3 px-4">
                    {r.students && r.students.length > 0 ? (
                      <ul className="list-decimal list-inside space-y-1">
                        {r.students.map((s) => (
                          <li key={s.id} className="text-gray-800">
                            <Link to={`/students/${s.id}`}>{s.name}</Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">
                        No students assigned
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No rooms available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomList;
