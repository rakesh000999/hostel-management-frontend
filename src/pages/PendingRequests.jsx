import React, { useState, useEffect } from 'react';
import {
    getPendingRequests,
    approveRequest,
    rejectRequest,
    assignRoom
} from '../api/studentRequestApi';
import { getAvailableRooms } from '../api/roomsApi';

const PendingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState({});
    const [availableRooms, setAvailableRooms] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assigningRequest, setAssigningRequest] = useState(null);

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

    const fetchAvailableRooms = async () => {
        try {
            const rooms = await getAvailableRooms();
            setAvailableRooms(rooms);
        } catch (err) {
            console.error('Failed to load available rooms');
        }
    };

    useEffect(() => {
        fetch();
        fetchAvailableRooms();
    }, []);

    const handleApprove = async (id) => {
        try {
            await approveRequest(id);
            fetch();
        } catch (err) {
            alert('Failed to approve request');
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Reason for rejection (required):');
        if (!reason || !reason.trim()) {
            alert('Rejection reason is required');
            return;
        }
        try {
            await rejectRequest(id, reason.trim());
            fetch();
        } catch (err) {
            alert('Failed to reject request');
        }
    };

    const handleAssignRoom = async () => {
        if (!assigningRequest || !selectedRoom[assigningRequest.id]) {
            alert('Please select a room');
            return;
        }
        try {
            await assignRoom(assigningRequest.id, selectedRoom[assigningRequest.id]);
            setShowAssignModal(false);
            setAssigningRequest(null);
            fetch();
        } catch (err) {
            alert('Failed to assign room');
        }
    };

    const openAssignModal = (request) => {
        setAssigningRequest(request);
        setShowAssignModal(true);
    };

    if (loading) return <p className="p-4 text-center">Loading...</p>;
    if (error) return <p className="p-4 text-center text-red-600">{error}</p>;

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Pending Student Requests</h2>
            {requests.length === 0 && <p className="text-center text-gray-500">No pending requests.</p>}
            <div className="space-y-4 max-w-4xl mx-auto">
                {requests.map(r => (
                    <div key={r.id} className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800">{r.fullName}</h3>
                                <p className="text-sm text-gray-600 mb-2">{r.userEmail}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                                    <p><span className="font-medium">Phone:</span> {r.phone}</p>
                                    <p><span className="font-medium">Gender:</span> {r.gender || 'Not specified'}</p>
                                    <p><span className="font-medium">Check-in:</span> {new Date(r.checkInDate).toLocaleDateString()}</p>
                                    {r.checkOutDate && <p><span className="font-medium">Check-out:</span> {new Date(r.checkOutDate).toLocaleDateString()}</p>}
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2 ml-4">
                                <button
                                    onClick={() => handleApprove(r.id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleReject(r.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                                >
                                    Reject
                                </button>
                                {r.status === 'APPROVED' && (
                                    <button
                                        onClick={() => openAssignModal(r)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        Assign Room
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500">Submitted: {new Date(r.submittedAt).toLocaleString()}</p>
                        {r.assignedRoomNumber && (
                            <p className="text-sm text-green-600 font-medium mt-2">Room Assigned: {r.assignedRoomNumber}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Assign Room Modal */}
            {showAssignModal && assigningRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Assign Room to {assigningRequest.fullName}</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Available Room</label>
                            <select
                                value={selectedRoom[assigningRequest.id] || ''}
                                onChange={(e) => setSelectedRoom(prev => ({ ...prev, [assigningRequest.id]: e.target.value }))}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                            >
                                <option value="">Choose a room...</option>
                                {availableRooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.roomNumber} (Capacity: {room.capacity}, Available: {room.capacity - room.occupiedCount})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={handleAssignRoom}
                                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Assign Room
                            </button>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingRequests;
