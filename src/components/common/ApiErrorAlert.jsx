import React from 'react';

const ApiErrorAlert = ({ error, className = '' }) => {
    if (!error) {
        return null;
    }

    const status = error.status ? `(${error.status})` : '';

    return (
        <div className={`rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 ${className}`}>
            <p className="font-semibold">{error.error || 'Request failed'} {status}</p>
            <p className="text-sm">{error.message || 'Something went wrong.'}</p>
            {error.path ? <p className="text-xs mt-1">Path: {error.path}</p> : null}
        </div>
    );
};

export default ApiErrorAlert;
