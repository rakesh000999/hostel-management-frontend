import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import StudentDocuments from "../components/StudentDocuments";

const ViewStudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Show loading till the data is being fetched
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Back
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-lg sm:p-8">
          <h2 className="text-3xl font-bold text-blue-700">Student Details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Review profile information and securely preview submitted documents.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Name</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{student.name || "N/A"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{student.email || "N/A"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{student.phone || "N/A"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Gender</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{student.gender || "N/A"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
              <p className="text-xs uppercase tracking-wide text-slate-500">Address</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{student.address || "N/A"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Guardian Name</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{student.guardianName || "N/A"}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Guardian Contact</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{student.guardianContact || "N/A"}</p>
            </div>
          </div>

          <div className="mt-6">
            <StudentDocuments studentId={student.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentDetail;
