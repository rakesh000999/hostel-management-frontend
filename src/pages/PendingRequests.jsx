import React, { useState, useEffect } from 'react';
import {
    getPendingRequests,
    getAllRequests,
    getRequestById,
    approveRequest,
    rejectRequest,
    assignRoom,
    unassignRoom
} from '../api/studentRequestApi';
import { getAvailableRooms } from '../api/roomsApi';
import {
    getStudentRequestPhotoBlob,
    getStudentRequestIdentityBlob
} from '../api/fileApi';

const statusBadge = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    ROOM_ASSIGNED: 'bg-indigo-100 text-indigo-800'
};

const PendingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [listMode, setListMode] = useState('pending');

    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState('');

    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState('');

    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState('');

    const validateSelectedRoomId = () => {
        const parsedRoomId = Number(selectedRoomId);
        if (!selectedRoomId) {
            setActionMessage('Please select a room before approval.');
            return null;
        }
        if (!Number.isInteger(parsedRoomId) || parsedRoomId <= 0) {
            setActionMessage('Invalid room selected. Please choose a valid room.');
            return null;
        }
        return parsedRoomId;
    };

    const fetchList = async (mode = listMode) => {
        try {
            setLoading(true);
            setError('');
            const res = mode === 'all' ? await getAllRequests() : await getPendingRequests();
            setRequests(Array.isArray(res) ? res : []);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async () => {
        try {
            const rooms = await getAvailableRooms();
            const available = (rooms || []).filter(
                (room) => Number(room.capacity) > Number(room.occupiedCount)
            );
            setAvailableRooms(available);
        } catch {
            setAvailableRooms([]);
        }
    };

    useEffect(() => {
        fetchList('pending');
        fetchRooms();
    }, []);

    useEffect(() => {
        fetchList(listMode);
    }, [listMode]);

    const fetchRequestDetails = async (requestId) => {
        try {
            setDetailsLoading(true);
            setDetailsError('');
            setSelectedRequestId(requestId);
            const res = await getRequestById(requestId);
            setSelectedRequest(res);
            if (res?.assignedRoomId) {
                setSelectedRoomId(String(res.assignedRoomId));
            } else {
                setSelectedRoomId('');
            }
        } catch (err) {
            setDetailsError(err?.response?.data?.message || 'Failed to load request details');
            setSelectedRequest(null);
        } finally {
            setDetailsLoading(false);
        }
    };

    const refreshData = async () => {
        await fetchList();
        await fetchRooms();
        if (selectedRequestId) {
            await fetchRequestDetails(selectedRequestId);
        }
    };

    const runAction = async (fn, successMessage) => {
        try {
            setActionLoading(true);
            setActionMessage('');
            await fn();
            setActionMessage(successMessage);
            await refreshData();
        } catch (err) {
            setActionMessage(err?.response?.data?.message || 'Action failed');
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = () => {
        if (!selectedRequestId) return;

        const parsedRoomId = validateSelectedRoomId();
        if (!parsedRoomId) return;

        runAction(
            async () => {
                const requestStatus = String(selectedRequest?.status || '').toUpperCase();

                // Try approve only when still pending; if backend says already approved, continue.
                if (requestStatus !== 'APPROVED' && requestStatus !== 'ROOM_ASSIGNED') {
                    try {
                        await approveRequest(selectedRequestId);
                    } catch (approveError) {
                        const statusCode = approveError?.response?.status;
                        const backendMessage = String(
                            approveError?.response?.data?.message ||
                            approveError?.response?.data?.error ||
                            '',
                        ).toLowerCase();

                        const isSafeToContinue =
                            statusCode === 409 ||
                            backendMessage.includes('already approved') ||
                            backendMessage.includes('invalid status') ||
                            backendMessage.includes('cannot approve');

                        if (!isSafeToContinue) {
                            throw approveError;
                        }
                    }
                }

                await assignRoom(selectedRequestId, parsedRoomId);
            },
            'Request approved and room assigned successfully. Students page should sync now.'
        );
    };

    const handleReject = () => {
        if (!selectedRequestId) return;
        if (!rejectReason.trim()) {
            setActionMessage('Rejection reason is required');
            return;
        }

        runAction(
            () => rejectRequest(selectedRequestId, rejectReason.trim()),
            'Request rejected successfully'
        );
    };

    const handleAssignRoom = () => {
        if (!selectedRequestId) return;
        const parsedRoomId = validateSelectedRoomId();
        if (!parsedRoomId) return;

        runAction(
            () => assignRoom(selectedRequestId, parsedRoomId),
            'Room assigned successfully'
        );
    };

    const handleUnassignRoom = () => {
        if (!selectedRequestId) return;
        runAction(
            () => unassignRoom(selectedRequestId),
            'Room unassigned successfully'
        );
    };

    const openBlobInNewTab = (blob, fallbackName) => {
        const blobUrl = URL.createObjectURL(blob);
        const win = window.open(blobUrl, '_blank', 'noopener,noreferrer');
        if (!win) {
            const anchor = document.createElement('a');
            anchor.href = blobUrl;
            anchor.download = fallbackName;
            anchor.click();
        }
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
    };

    const handleViewPhoto = async () => {
        if (!selectedRequestId) return;
        try {
            setActionLoading(true);
            const blob = await getStudentRequestPhotoBlob(selectedRequestId);
            openBlobInNewTab(blob, `request-${selectedRequestId}-photo`);
        } catch (err) {
            setActionMessage(err?.response?.data?.message || 'Failed to fetch photo');
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewIdentity = async () => {
        if (!selectedRequestId) return;
        try {
            setActionLoading(true);
            const blob = await getStudentRequestIdentityBlob(selectedRequestId);
            openBlobInNewTab(blob, `request-${selectedRequestId}-identity`);
        } catch (err) {
            setActionMessage(err?.response?.data?.message || 'Failed to fetch identity document');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Request Review</h2>

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>
            )}
            {actionMessage && (
                <div className="mb-4 p-3 rounded bg-blue-100 text-blue-700">{actionMessage}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">Pending Requests</h3>
                        <div className="flex items-center gap-2">
                            <select
                                value={listMode}
                                onChange={(e) => setListMode(e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                            >
                                <option value="pending">Pending Only</option>
                                <option value="all">All Requests</option>
                            </select>
                            <button
                                onClick={() => fetchList()}
                                className="px-3 py-1 rounded bg-gray-800 text-white text-sm"
                                disabled={loading}
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-gray-600">Loading pending requests...</p>
                    ) : requests.length === 0 ? (
                        <p className="text-gray-600">No pending requests found.</p>
                    ) : (
                        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                            {requests.map((request) => (
                                <button
                                    key={request.id}
                                    type="button"
                                    className={`w-full text-left border rounded-lg p-3 transition ${selectedRequestId === request.id
                                        ? 'border-indigo-500 ring-2 ring-indigo-100'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => fetchRequestDetails(request.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-gray-800">{request.fullName}</p>
                                        <span className={`px-2 py-1 rounded text-xs ${statusBadge[request.status] || 'bg-gray-100 text-gray-800'}`}>
                                            {String(request.status || 'UNKNOWN').replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{request.userEmail}</p>
                                    <p className="text-sm text-gray-600">Phone: {request.phone || 'N/A'}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Request Details</h3>

                    {detailsLoading && <p className="text-gray-600">Loading request details...</p>}
                    {!detailsLoading && detailsError && (
                        <p className="text-red-600">{detailsError}</p>
                    )}
                    {!detailsLoading && !detailsError && !selectedRequest && (
                        <p className="text-gray-600">Select a request to review details.</p>
                    )}

                    {!detailsLoading && selectedRequest && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <p><span className="font-semibold">Name:</span> {selectedRequest.fullName}</p>
                                <p><span className="font-semibold">DOB:</span> {selectedRequest.dateOfBirth || 'N/A'}</p>
                                <p><span className="font-semibold">Gender:</span> {selectedRequest.gender || 'N/A'}</p>
                                <p><span className="font-semibold">Nationality:</span> {selectedRequest.nationality || 'N/A'}</p>
                                <p><span className="font-semibold">Phone:</span> {selectedRequest.phone || 'N/A'}</p>
                                <p><span className="font-semibold">Guardian:</span> {selectedRequest.guardianName || 'N/A'}</p>
                                <p><span className="font-semibold">Guardian Contact:</span> {selectedRequest.guardianContact || 'N/A'}</p>
                                <p><span className="font-semibold">Emergency:</span> {selectedRequest.emergencyContact || 'N/A'}</p>
                                <p><span className="font-semibold">Check-in:</span> {selectedRequest.checkInDate || 'N/A'}</p>
                                <p><span className="font-semibold">Check-out:</span> {selectedRequest.checkOutDate || 'N/A'}</p>
                                <p><span className="font-semibold">Address:</span> {selectedRequest.address || 'N/A'}</p>
                                <p><span className="font-semibold">Status:</span> {String(selectedRequest.status || 'UNKNOWN').replace('_', ' ')}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded bg-gray-700 text-white disabled:opacity-60"
                                    disabled={actionLoading}
                                    onClick={handleViewPhoto}
                                >
                                    View Photo
                                </button>
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded bg-gray-700 text-white disabled:opacity-60"
                                    disabled={actionLoading}
                                    onClick={handleViewIdentity}
                                >
                                    View Identity
                                </button>
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-60"
                                        disabled={actionLoading}
                                        onClick={handleApprove}
                                    >
                                        Approve + Assign
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-60"
                                        disabled={actionLoading}
                                        onClick={handleReject}
                                    >
                                        Reject
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500">
                                    Approval requires room selection so student onboarding stays synced.
                                </p>

                                <textarea
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Rejection reason"
                                    className="w-full border border-gray-300 rounded p-2"
                                    rows={3}
                                />

                                <div className="flex flex-col sm:flex-row gap-2">
                                    <select
                                        value={selectedRoomId}
                                        onChange={(e) => setSelectedRoomId(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded p-2"
                                    >
                                        <option value="">Select room for assignment</option>
                                        {availableRooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                Room {room.roomNumber} (Available: {room.capacity - room.occupiedCount})
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        className="px-3 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
                                        disabled={actionLoading}
                                        onClick={handleAssignRoom}
                                    >
                                        Assign Room
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-2 rounded bg-slate-600 text-white disabled:opacity-60"
                                        disabled={actionLoading}
                                        onClick={handleUnassignRoom}
                                    >
                                        Unassign Room
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PendingRequests;
