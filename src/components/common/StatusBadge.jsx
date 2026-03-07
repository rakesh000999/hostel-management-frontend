import React from "react";

const stylesByStatus = {
    OPEN: "border-amber-200 bg-amber-100 text-amber-800",
    IN_PROGRESS: "border-sky-200 bg-sky-100 text-sky-800",
    RESOLVED: "border-emerald-200 bg-emerald-100 text-emerald-800",
};

const StatusBadge = ({ status }) => {
    const normalized = String(status || "OPEN").toUpperCase();
    const style = stylesByStatus[normalized] || "border-slate-200 bg-slate-100 text-slate-700";

    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}>
            {normalized.replaceAll("_", " ")}
        </span>
    );
};

export default StatusBadge;
