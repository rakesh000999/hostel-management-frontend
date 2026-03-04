import React, { useState, useEffect } from 'react';
import { getMyRequests } from '../api/studentRequestApi';

const badgeStyles = {
    PENDING: 'bg-yellow-200 text-yellow-800',
    APPROVED: 'bg-green-200 text-green-800',
    REJECTED: 'bg-red-200 text-red-800',
    ROOM_ASSIGNED: 'bg-indigo-200 text-indigo-800',
    CANCELLED: 'bg-gray-200 text-gray-800'
};

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getMyRequests();
                setRequests(res);
            } catch (err) {
                setError('Failed to load requests');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Requests</h2>
            {requests.length === 0 && (
                <p>No requests found.</p>
            )}
            <div className="space-y-4">
                {requests.map(req => (
                    <div key={req.id} className="border rounded-lg p-4 bg-white shadow">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{req.fullName}</h3>
                            <span className={`px-2 py-1 rounded ${badgeStyles[req.status] || 'bg-gray-200'}`}>
                                {req.status.replace('_', ' ')}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600">Submitted: {new Date(req.submittedAt).toLocaleString()}</p>
                        {req.assignedRoomNumber && (
                            <p className="text-sm text-gray-800">Room: {req.assignedRoomNumber}</p>
                        )}
                        {req.rejectionReason && (
                            <p className="text-sm text-red-600">Reason: {req.rejectionReason}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyRequests;
