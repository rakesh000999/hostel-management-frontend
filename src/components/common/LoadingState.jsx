import React from "react";

const LoadingState = ({ label = "Loading..." }) => {
    return (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
                <p className="text-sm text-slate-600">{label}</p>
            </div>
        </div>
    );
};

export default LoadingState;
