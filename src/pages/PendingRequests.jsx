import React, { useState, useEffect } from 'react';
import {
    getPendingRequests,
    approveRequest,
    rejectRequest,
    assignRoom
} from '../api/studentRequestApi';

const PendingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState({});

    const fetch = async () => {
        try {
            const res = await getPendingRequests();
            setRequests(res);
        } catch (err) {
            setError('Failed to load pending requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const handleApprove = async (id) => {
        await approveRequest(id);
        fetch();
    };

    const handleReject = async (id) => {
        const reason = prompt('Reason for rejection');
        if (!reason) return;
        await rejectRequest(id, reason);
        fetch();
    };

    // Assignment handled later if needed

    if (loading) return <p className="p-4">Loading...</p>;
    if (error) return <p className="p-4 text-red-600">{error}</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pending Student Requests</h2>
            {requests.length === 0 && <p>No pending requests.</p>}
            <div className="space-y-4">
                {requests.map(r => (
                    <div key={r.id} className="p-4 bg-white rounded shadow">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{r.fullName}</p>
                                <p className="text-sm text-gray-600">{r.userEmail}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleApprove(r.id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(r.id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Submitted: {new Date(r.submittedAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PendingRequests;
