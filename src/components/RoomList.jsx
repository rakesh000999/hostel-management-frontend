import { useEffect, useState } from "react";
import api from "../api/axios";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api
      .get("/rooms")
      .then((res) => {
        setRooms(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-bold text-blue-600 mb-6 text-center flex items-center justify-center gap-2">
        🏠 Room List
      </h3>

      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
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
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50 transition duration-150`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {r.roomNumber}
                  </td>
                  <td className="py-3 px-4">{r.capacity}</td>
                  <td className="py-3 px-4">{r.occupiedCount}</td>
                  <td className="py-3 px-4">Rs. {r.rentPerMonth}</td>
                  <td className="py-3 px-4">
                    {r.students && r.students.length > 0 ? (
                      <ul className="list-decimal list-inside space-y-1">
                        {r.students.map((s) => (
                          <li key={s.id} className="text-gray-800">
                            {s.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic">No students assigned</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
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
