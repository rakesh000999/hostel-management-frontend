import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createComplaint } from "../../api/complaintsApi";
import LoadingState from "../../components/common/LoadingState";
import { useComplaintEligibility } from "../../hooks/useComplaintEligibility";

const SubmitComplaint = () => {
    const { eligible, loading: eligibilityLoading, error: eligibilityError } =
        useComplaintEligibility();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            subject: "",
            category: "Hostel Room",
            description: "",
        },
    });

    const onSubmit = async (values) => {
        if (!values.subject.trim() || values.subject.trim().length < 4) {
            toast.error("Subject must be at least 4 characters long.");
            return;
        }

        if (!values.description.trim() || values.description.trim().length < 12) {
            toast.error("Description must be at least 12 characters long.");
            return;
        }

        try {
            await createComplaint({
                subject: values.subject.trim(),
                // Keep title for backward compatibility with any older backend contract.
                title: values.subject.trim(),
                category: values.category,
                description: values.description.trim(),
            });
            toast.success("Complaint submitted successfully.");
            reset({ subject: "", category: "Hostel Room", description: "" });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to submit complaint.");
        }
    };

    if (eligibilityLoading) {
        return <LoadingState label="Checking hostel allocation..." />;
    }

    if (!eligible) {
        return (
            <div className="mx-auto max-w-3xl p-4 sm:p-6">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 shadow-sm">
                    <h2 className="text-xl font-bold">Only Hostel Residents Can Submit Complaints</h2>
                    <p className="mt-2 text-sm">
                        Complaints are available only after room allocation. Please request a hostel room first.
                    </p>
                    {eligibilityError ? (
                        <p className="mt-2 text-xs text-amber-800">{eligibilityError}</p>
                    ) : null}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Link
                            to="/student-request"
                            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                        >
                            Request Room
                        </Link>
                        <Link
                            to="/my-requests"
                            className="rounded-md border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100"
                        >
                            Check Request Status
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl p-4 sm:p-6">
            <div className="rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-7 text-white shadow-lg">
                <h2 className="text-2xl font-bold">Submit Complaint</h2>
                <p className="mt-1 text-sm text-indigo-100">Report hostel issues for quick resolution.</p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Subject</label>
                        <input
                            type="text"
                            placeholder="e.g. Water leakage in room"
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            {...register("subject", { required: "Subject is required" })}
                        />
                        {errors.subject ? <p className="mt-1 text-xs text-red-600">{errors.subject.message}</p> : null}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Category</label>
                        <select
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            {...register("category", { required: true })}
                        >
                            <option>Hostel Room</option>
                            <option>Electricity</option>
                            <option>Water</option>
                            <option>Mess</option>
                            <option>Security</option>
                            <option>Maintenance</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
                        <textarea
                            rows={5}
                            placeholder="Describe your issue clearly..."
                            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            {...register("description", { required: "Description is required" })}
                        />
                        {errors.description ? (
                            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Complaint"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SubmitComplaint;
