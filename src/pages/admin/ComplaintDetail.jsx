import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getComplaintById, updateComplaintStatus } from "../../api/complaintsApi";
import LoadingState from "../../components/common/LoadingState";
import StatusBadge from "../../components/common/StatusBadge";

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting, errors },
    } = useForm({
        defaultValues: {
            status: "OPEN",
            adminRemark: "",
        },
    });

    useEffect(() => {
        const run = async () => {
            try {
                setLoading(true);
                setError("");
                const result = await getComplaintById(id);
                setComplaint(result);
                reset({
                    status: result.status || "OPEN",
                    adminRemark: result.adminRemark || "",
                });
            } catch (err) {
                setError(err?.response?.data?.message || err?.message || "Failed to fetch complaint details.");
            } finally {
                setLoading(false);
            }
        };

        run();
    }, [id, reset]);

    const onSubmit = async (values) => {
        if (!values.adminRemark.trim()) {
            toast.error("Admin remark is required.");
            return;
        }

        try {
            const updated = await updateComplaintStatus(id, {
                status: values.status,
                adminRemark: values.adminRemark.trim(),
            });
            setComplaint(updated);
            reset({
                status: updated.status || values.status,
                adminRemark: updated.adminRemark || values.adminRemark,
            });
            toast.success("Complaint status updated.");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to update complaint.");
        }
    };

    if (loading) {
        return <LoadingState label="Loading complaint detail..." />;
    }

    if (error) {
        return (
            <div className="p-4 sm:p-6">
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            </div>
        );
    }

    if (!complaint) {
        return (
            <div className="p-4 sm:p-6">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-700">
                    Complaint not found.
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <button
                type="button"
                onClick={() => navigate("/admin/complaints")}
                className="mb-4 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
                Back to Complaints
            </button>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p className="text-sm text-slate-500">Complaint #{complaint.id}</p>
                        <h2 className="text-2xl font-bold text-slate-900">{complaint.subject || complaint.title || "Untitled complaint"}</h2>
                    </div>
                    <StatusBadge status={complaint.status} />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-slate-50 p-3 text-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Student</p>
                        {complaint.studentId ? (
                            <Link
                                to={`/students/${complaint.studentId}`}
                                className="mt-1 inline-block font-medium text-indigo-700 hover:underline"
                            >
                                {complaint.studentDisplayName || `Student #${complaint.studentId}`}
                            </Link>
                        ) : (
                            <p className="mt-1 font-medium text-slate-800">{complaint.studentDisplayName || "-"}</p>
                        )}
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3 text-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">Category</p>
                        <p className="mt-1 font-medium text-slate-800">{complaint.category || "-"}</p>
                    </div>
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Description</p>
                    <p className="mt-2 text-sm text-slate-700">{complaint.description || "-"}</p>
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-lg font-semibold text-slate-900">Update Status</h3>

                <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Status</label>
                        <select
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            {...register("status", { required: true })}
                        >
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="RESOLVED">RESOLVED</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Admin Remark</label>
                        <textarea
                            rows={4}
                            placeholder="Add actionable update for student"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            {...register("adminRemark", {
                                required: "Admin remark is required",
                                minLength: { value: 3, message: "Remark should be at least 3 characters" },
                            })}
                        />
                        {errors.adminRemark ? (
                            <p className="mt-1 text-xs text-red-600">{errors.adminRemark.message}</p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {isSubmitting ? "Updating..." : "Update Complaint"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ComplaintDetail;
