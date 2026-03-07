import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteRoom,
  getAllRooms,
  updateRoomWithImage,
} from "../api/roomsApi";
import { emitRoomDataChanged, ROOM_DATA_CHANGED_EVENT } from "../utils/roomEvents";
import SecureImage from "./common/SecureImage";

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

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingRoom, setEditingRoom] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [editForm, setEditForm] = useState({
    roomNumber: "",
    capacity: "",
    occupiedCount: "",
    rentPerMonth: "",
    image: null,
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllRooms();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
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

  const startEdit = (room) => {
    setMessage("");
    setError("");
    setEditingRoom(room);
    setEditForm({
      roomNumber: String(room.roomNumber || ""),
      capacity: String(room.capacity || ""),
      occupiedCount: String(getOccupiedCount(room)),
      rentPerMonth: String(room.rentPerMonth || ""),
      image: null,
    });
  };

  const cancelEdit = () => {
    setEditingRoom(null);
    setEditForm({
      roomNumber: "",
      capacity: "",
      occupiedCount: "",
      rentPerMonth: "",
      image: null,
    });
  };

  const handleEditChange = (event) => {
    const { name, value, files } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "image" ? files?.[0] || null : value,
    }));
  };

  const saveEdit = async () => {
    if (!editingRoom) {
      return;
    }

    const roomNumber = Number(editForm.roomNumber);
    const capacity = Number(editForm.capacity);
    const occupiedCount = Number(editForm.occupiedCount);
    const rentPerMonth = Number(editForm.rentPerMonth);

    if (!Number.isInteger(roomNumber) || roomNumber <= 0) {
      setError("Room number must be a positive integer.");
      return;
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      setError("Capacity must be a positive integer.");
      return;
    }

    if (!Number.isInteger(occupiedCount) || occupiedCount < 0 || occupiedCount > capacity) {
      setError("Occupied count must be between 0 and capacity.");
      return;
    }

    if (!Number.isFinite(rentPerMonth) || rentPerMonth <= 0) {
      setError("Rent per month must be a positive number.");
      return;
    }

    try {
      setSavingEdit(true);
      setError("");
      setMessage("");

      await updateRoomWithImage(editingRoom.id, {
        roomNumber,
        capacity,
        occupiedCount,
        rentPerMonth,
        image: editForm.image || undefined,
      });

      setMessage("Room updated successfully.");
      cancelEdit();
      emitRoomDataChanged();
      await fetchRooms();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update room.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (roomId) => {
    const confirmed = window.confirm("Are you sure you want to delete this room?");
    if (!confirmed) {
      return;
    }

    try {
      setDeletingRoomId(roomId);
      setError("");
      setMessage("");
      await deleteRoom(roomId);
      setMessage("Room deleted successfully.");
      emitRoomDataChanged();
      await fetchRooms();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete room.");
    } finally {
      setDeletingRoomId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Room List</h3>
          <p className="text-sm text-slate-500">Click room number to view room details and students.</p>
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

      {message && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {message}
        </div>
      )}
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
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.length > 0 ? (
              rooms.map((room, index) => (
                <tr
                  key={room.id}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition duration-150`}
                >
                  <td className="py-3 px-4">
                    {room.imageUrl ? (
                      <SecureImage
                        src={room.imageUrl}
                        alt={`Room ${room.roomNumber}`}
                        className="h-12 w-16 rounded object-cover border border-gray-200"
                        fallback={<span className="text-gray-400 italic">No image</span>}
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    <Link to={`/rooms/${room.id}`} className="text-indigo-700 hover:underline">
                      {room.roomNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{room.capacity}</td>
                  <td className="py-3 px-4">{getOccupiedCount(room)}</td>
                  <td className="py-3 px-4">Rs. {room.rentPerMonth}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(room)}
                        className="px-2.5 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(room.id)}
                        disabled={deletingRoomId === room.id}
                        className="px-2.5 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                      >
                        {deletingRoomId === room.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500 italic">
                  No rooms available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingRoom ? (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl p-5 shadow-xl">
            <h4 className="text-xl font-semibold mb-4">Edit Room #{editingRoom.roomNumber}</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                name="roomNumber"
                value={editForm.roomNumber}
                onChange={handleEditChange}
                className="border border-gray-300 rounded p-2"
                placeholder="Room Number"
                type="number"
                min="1"
              />
              <input
                name="capacity"
                value={editForm.capacity}
                onChange={handleEditChange}
                className="border border-gray-300 rounded p-2"
                placeholder="Capacity"
                type="number"
                min="1"
              />
              <input
                name="occupiedCount"
                value={editForm.occupiedCount}
                onChange={handleEditChange}
                className="border border-gray-300 rounded p-2"
                placeholder="Occupied Count"
                type="number"
                min="0"
              />
              <input
                name="rentPerMonth"
                value={editForm.rentPerMonth}
                onChange={handleEditChange}
                className="border border-gray-300 rounded p-2"
                placeholder="Rent Per Month"
                type="number"
                min="1"
              />
              <input
                name="image"
                onChange={handleEditChange}
                className="border border-gray-300 rounded p-2 sm:col-span-2"
                type="file"
                accept="image/*"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800"
                disabled={savingEdit}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="px-4 py-2 rounded bg-indigo-600 text-white"
                disabled={savingEdit}
              >
                {savingEdit ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RoomList;
