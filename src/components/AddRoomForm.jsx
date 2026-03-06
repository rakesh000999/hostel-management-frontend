import React, { useState } from "react";
import api from "../api/axios";
import { emitRoomDataChanged } from "../utils/roomEvents";

const AddRoomForm = () => {
  const [room, setRoom] = useState({
    roomNumber: "",
    capacity: "",
    rentPerMonth: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (error) {
      setError("");
    }
    if (message) {
      setMessage("");
    }

    if (name === "image") {
      setRoom({ ...room, image: files?.[0] || null });
      return;
    }

    setRoom({ ...room, [name]: value });
  };

  const validateForm = () => {
    const capacity = Number(room.capacity);
    const rentPerMonth = Number(room.rentPerMonth);
    const roomNumber = Number(room.roomNumber);

    if (!String(room.roomNumber).trim()) {
      return "Room number is required.";
    }

    if (!Number.isInteger(roomNumber) || roomNumber <= 0) {
      return "Room number must be a positive number.";
    }

    if (Number.isNaN(capacity) || capacity <= 0) {
      return "Capacity must be a positive number.";
    }

    if (Number.isNaN(rentPerMonth) || rentPerMonth <= 0) {
      return "Rent per month must be a positive number.";
    }

    if (!room.image) {
      return "Room image file is required.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = new FormData();
    payload.append("roomNumber", String(Number(room.roomNumber)));
    payload.append("capacity", String(Number(room.capacity)));
    payload.append("occupiedCount", "0");
    payload.append("rentPerMonth", String(Number(room.rentPerMonth)));
    payload.append("image", room.image);

    try {
      setIsSubmitting(true);
      setError("");
      setMessage("");
      await api.post("/rooms", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      emitRoomDataChanged();
      setMessage("Room added successfully.");
      setRoom({
        roomNumber: "",
        capacity: "",
        rentPerMonth: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Failed to add room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4"
    >
      <div>
        <h3 className="text-xl sm:text-2xl text-slate-900 font-bold">Add Room</h3>
        <p className="text-sm text-slate-500 mt-1">Upload an image and set room details.</p>
      </div>

      {message && (
        <div className="rounded-lg bg-green-100 text-green-700 px-3 py-2 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-100 text-red-700 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Room Number</label>
          <input
            type="number"
            name="roomNumber"
            value={room.roomNumber}
            onChange={handleChange}
            placeholder="e.g. 101"
            min="1"
            step="1"
            required
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={room.capacity}
            onChange={handleChange}
            placeholder="e.g. 3"
            min="1"
            step="1"
            required
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Rent Per Month</label>
          <input
            type="number"
            name="rentPerMonth"
            value={room.rentPerMonth}
            onChange={handleChange}
            placeholder="e.g. 4500"
            min="1"
            step="1"
            required
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Room Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          />
        </div>

      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-cyan-600 text-white font-semibold py-2.5 rounded-lg mt-2 hover:bg-cyan-700 transition duration-200 disabled:opacity-60"
      >
        {isSubmitting ? "Adding Room..." : "Add Room"}
      </button>
    </form>
  );
};

export default AddRoomForm;
