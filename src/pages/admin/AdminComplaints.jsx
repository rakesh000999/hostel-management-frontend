import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllComplaints } from "../../api/complaintsApi";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                setError("");
                const list = await getAllComplaints();
                setComplaints(list);
            } catch (err) {
                setError(err?.response?.data?.message || err?.message || "Failed to fetch complaints.");
            } finally {
                setLoading(false);
            }
        };

        run();
    }, []);

    const summary = useMemo(() => {
        return {
            open: complaints.filter((item) => String(item.status).toUpperCase() === "OPEN").length,
            inProgress: complaints.filter((item) => String(item.status).toUpperCase() === "IN_PROGRESS").length,
            resolved: complaints.filter((item) => String(item.status).toUpperCase() === "RESOLVED").length,
        };
    }, [complaints]);

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-7 text-white shadow-lg">
                <h2 className="text-2xl font-bold">Complaint Management</h2>
                <p className="mt-1 text-sm text-indigo-100">Review and resolve all student complaints.</p>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-amber-700">Open</p>
                    <p className="text-2xl font-bold text-amber-800">{summary.open}</p>
                </div>
                <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-sky-700">In Progress</p>
                    <p className="text-2xl font-bold text-sky-800">{summary.inProgress}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-emerald-700">Resolved</p>
                    <p className="text-2xl font-bold text-emerald-800">{summary.resolved}</p>
                </div>
            </div>

            <div className="mt-6">
                {loading ? <LoadingState label="Loading complaints..." /> : null}

                {!loading && error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                {!loading && !error && complaints.length === 0 ? (
                    <EmptyState title="No complaints found" message="Complaints submitted by students will appear here." />
                ) : null}

                {!loading && !error && complaints.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead className="bg-slate-800 text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left">ID</th>
                                        <th className="px-4 py-3 text-left">Student</th>
                                        <th className="px-4 py-3 text-left">Subject</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Created</th>
                                        <th className="px-4 py-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={`border-t border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                                        >
                                            <td className="px-4 py-3">#{item.id}</td>
                                            <td className="px-4 py-3">
                                                {item.studentId ? (
                                                    <Link
                                                        to={`/students/${item.studentId}`}
                                                        className="font-medium text-indigo-700 hover:underline"
                                                    >
                                                        {item.studentDisplayName || `Student #${item.studentId}`}
                                                    </Link>
                                                ) : (
                                                    <span>{item.studentDisplayName || "-"}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900">{item.subject || item.title || "-"}</td>
                                            <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                                            <td className="px-4 py-3">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
                                            <td className="px-4 py-3">
                                                <Link
                                                    to={`/admin/complaints/${item.id}`}
                                                    className="inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AdminComplaints;
