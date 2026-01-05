import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import StudentDocuments from "../components/StudentDocuments";

const ViewStudentDetail = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/students/${id}`)
      .then((res) => {
        setStudent(res.data);
        console.log(res.data);

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student details:", err);
        setError("Failed to load student details.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading student details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500 italic">
        No student data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center items-center p-6">
      <div className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          🎓 Student Details
        </h2>

        <div className="space-y-4 text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Name:</span>{" "}
            {student.name}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Email:</span>{" "}
            {student.email || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Phone:</span>{" "}
            {student.phone || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Age:</span>{" "}
            {student.age || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Gender:</span>{" "}
            {student.gender || "N/A"}
          </p>
          {/* <p>
            <span className="font-semibold text-gray-900">Room:</span>{" "}
            {student.roomNumber || "Not Assigned"}
          </p> */}
          <p>
            <span className="font-semibold text-gray-900">Address:</span>{" "}
            {student.address || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Guardian Name:</span>{" "}
            {student.guardianName || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Guardian Contact:</span>{" "}
            {student.guardianContact || "N/A"}
          </p>
        </div>
        <StudentDocuments studentId={student.id} />
      </div>
    </div>
  );
};

export default ViewStudentDetail;
