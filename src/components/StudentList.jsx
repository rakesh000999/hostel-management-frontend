import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get('/students')
      .then((res) => {
        setStudents(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h3 className="text-3xl font-bold text-emerald-500 mb-6 text-center">
        Students List
      </h3>

      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-emerald-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">ID</th>
              <th className="py-3 px-4 text-left font-semibold">Name</th>
              <th className="py-3 px-4 text-left font-semibold">Room No.</th>
              <th className="py-3 px-4 text-left font-semibold">Age</th>
              <th className="py-3 px-4 text-left font-semibold">Gender</th>
              <th className="py-3 px-4 text-left font-semibold">Email</th>
              <th className="py-3 px-4 text-left font-semibold">Phone</th>
              <th className="py-3 px-4 text-left font-semibold">Address</th>
              <th className="py-3 px-4 text-left font-semibold">Guardian Name</th>
              <th className="py-3 px-4 text-left font-semibold">Guardian Contact</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((s, index) => (
                <tr
                  key={s.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-emerald-50 transition-colors duration-150`}
                >
                  <td className="py-3 px-4">{s.id}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">{s.name}</td>
                  <td className="py-3 px-4">{s.room?.roomNumber || '-'}</td>
                  <td className="py-3 px-4">{s.age}</td>
                  <td className="py-3 px-4">{s.gender}</td>
                  <td className="py-3 px-4">{s.email}</td>
                  <td className="py-3 px-4">{s.phone}</td>
                  <td className="py-3 px-4">{s.address}</td>
                  <td className="py-3 px-4">{s.guardianName || '-'}</td>
                  <td className="py-3 px-4">{s.guardianContact || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
