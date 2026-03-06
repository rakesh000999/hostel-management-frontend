import React from 'react';
import ApiErrorAlert from '../../components/common/ApiErrorAlert';
import { useMyRequestStatusQuery, useMyRequestsQuery } from '../../hooks/useStudentRequests';

const statusClass = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    ROOM_ASSIGNED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
};

const statusLabel = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    ROOM_ASSIGNED: 'Room Assigned',
    REJECTED: 'Rejected',
};

const StatusBadge = ({ status }) => (
    <span className={`inline-flex rounded px-2 py-1 text-xs font-semibold ${statusClass[status] || 'bg-gray-100 text-gray-700'}`}>
        {statusLabel[status] || status}
    </span>
);

const MyRequestStatus = () => {
    const statusQuery = useMyRequestStatusQuery();
    const requestsQuery = useMyRequestsQuery();

    const isLoading = statusQuery.isLoading || requestsQuery.isLoading;
    const error = statusQuery.error || requestsQuery.error;

    const requests = Array.isArray(requestsQuery.data) ? requestsQuery.data : [];

    return (
        <div className="mx-auto max-w-5xl p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">My Request Status</h1>

            <ApiErrorAlert error={error} className="mb-4" />

            {isLoading ? (
                <div className="rounded border border-blue-200 bg-blue-50 p-3 text-blue-700">Loading your request status...</div>
            ) : (
                <>
                    {statusQuery.data?.status ? (
                        <div className="mb-4 rounded border border-indigo-200 bg-indigo-50 p-4">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-gray-700">Current Status</p>
                                <StatusBadge status={statusQuery.data.status} />
                            </div>
                            {statusQuery.data.message ? (
                                <p className="text-sm mt-2 text-gray-700">{statusQuery.data.message}</p>
                            ) : null}
                        </div>
                    ) : null}

                    {requests.length === 0 ? (
                        <div className="rounded border border-gray-200 bg-white p-6 text-center text-gray-500">
                            You have not submitted any hostel request yet.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {requests.map((request) => (
                                <div key={request.id} className="rounded border border-gray-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <h2 className="font-semibold text-gray-900">Request #{request.id}</h2>
                                        <StatusBadge status={request.status} />
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Submitted: {request.submittedAt ? new Date(request.submittedAt).toLocaleString() : 'N/A'}</p>
                                    {request.assignedRoomNumber ? (
                                        <p className="text-sm text-gray-700 mt-1">Assigned Room: {request.assignedRoomNumber}</p>
                                    ) : null}
                                    {request.rejectionReason ? (
                                        <p className="text-sm text-red-700 mt-1">Rejection reason: {request.rejectionReason}</p>
                                    ) : null}
                                    {request.message ? (
                                        <p className="text-sm text-gray-700 mt-1">{request.message}</p>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyRequestStatus;
