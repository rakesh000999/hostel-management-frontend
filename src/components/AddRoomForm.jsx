import React, { useState } from "react";
import api from "../api/axios";

const AddRoomForm = () => {
  const [room, setRoom] = useState({
    roomNumber: "",
    capacity: "",
    rentPerMonth: "Rs. ",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rooms", room);
      alert("Room added successfully!");
      setRoom({ roomNumber: "", capacity: "", rentPerMonth: "Rs. " });
    } catch (error) {
      console.error(error);
      alert("Failed to add room.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-200"
    >
      <h3 className="text-2xl text-blue-700 font-bold text-center mb-4">
        Add Room
      </h3>

      <div className="space-y-3">
        <input
          type="text"
          name="roomNumber"
          value={room.roomNumber}
          onChange={handleChange}
          placeholder="Room Number"
          required
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          type="number"
          name="capacity"
          value={room.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          required
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

        <input
          type="number"
          name="rentPerMonth"
          value={room.rentPerMonth}
          onChange={handleChange}
          placeholder="Rent per month"
          required
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />

      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg mt-4 hover:bg-green-600 transition duration-200"
      >
        Add Room
      </button>
    </form>
  );
};

export default AddRoomForm;
