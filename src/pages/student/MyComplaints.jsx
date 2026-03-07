import React, { useEffect, useState } from "react";
import { getMyComplaints } from "../../api/complaintsApi";
import LoadingState from "../../components/common/LoadingState";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                setError("");
                const list = await getMyComplaints();
                setComplaints(list);
            } catch (err) {
                setError(err?.response?.data?.message || err?.message || "Failed to fetch complaints.");
            } finally {
                setLoading(false);
            }
        };

        run();
    }, []);

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-7 text-white shadow-lg">
                <h2 className="text-2xl font-bold">My Complaints</h2>
                <p className="mt-1 text-sm text-indigo-100">Track complaint progress with live status updates.</p>
            </div>

            <div className="mt-6">
                {loading ? <LoadingState label="Loading your complaints..." /> : null}

                {!loading && error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                ) : null}

                {!loading && !error && complaints.length === 0 ? (
                    <EmptyState
                        title="No complaints yet"
                        message="Submit your first complaint from the complaint form page."
                    />
                ) : null}

                {!loading && !error && complaints.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-gray-700">
                                <thead className="bg-slate-800 text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left">ID</th>
                                        <th className="px-4 py-3 text-left">Subject</th>
                                        <th className="px-4 py-3 text-left">Category</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Created</th>
                                        <th className="px-4 py-3 text-left">Admin Remark</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={`border-t border-slate-100 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                                        >
                                            <td className="px-4 py-3">#{item.id}</td>
                                            <td className="px-4 py-3 font-medium text-slate-900">{item.subject || item.title || "-"}</td>
                                            <td className="px-4 py-3">{item.category || "-"}</td>
                                            <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                                            <td className="px-4 py-3">{item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}</td>
                                            <td className="px-4 py-3">{item.adminRemark || "-"}</td>
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

export default MyComplaints;
