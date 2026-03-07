import React from "react";

const EmptyState = ({ title = "No data found", message = "Nothing to show yet." }) => {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
        </div>
    );
};

export default EmptyState;
