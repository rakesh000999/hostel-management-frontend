import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import ApiErrorAlert from '../../components/common/ApiErrorAlert';
import {
    useAllRequestsQuery,
    useApproveRequestMutation,
    useAssignRoomMutation,
    useAvailableRoomsQuery,
    useOpenIdentityMutation,
    useOpenPhotoMutation,
    usePendingRequestsQuery,
    useRejectRequestMutation,
    useRequestDetailsQuery,
} from '../../hooks/useStudentRequests';
import { emitRoomDataChanged } from '../../utils/roomEvents';

const statusClass = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    ROOM_ASSIGNED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
};

const RequestQueue = () => {
    const [tab, setTab] = useState('pending');
    const [selectedId, setSelectedId] = useState(null);
    const [assignRoomId, setAssignRoomId] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    const pendingQuery = usePendingRequestsQuery();
    const allQuery = useAllRequestsQuery();
    const roomsQuery = useAvailableRoomsQuery();
    const detailsQuery = useRequestDetailsQuery(selectedId);

    const approveMutation = useApproveRequestMutation();
    const assignMutation = useAssignRoomMutation();
    const rejectMutation = useRejectRequestMutation();
    const openPhotoMutation = useOpenPhotoMutation();
    const openIdentityMutation = useOpenIdentityMutation();

    const activeQuery = tab === 'pending' ? pendingQuery : allQuery;
    const requests = useMemo(() => (Array.isArray(activeQuery.data) ? activeQuery.data : []), [activeQuery.data]);
    const rooms = useMemo(() => (Array.isArray(roomsQuery.data) ? roomsQuery.data : []), [roomsQuery.data]);

    const details = detailsQuery.data;

    const actionBusy =
        approveMutation.isPending ||
        assignMutation.isPending ||
        rejectMutation.isPending ||
        openPhotoMutation.isPending ||
        openIdentityMutation.isPending;

    const showServerMessage = (res, fallback) => {
        toast.success(res?.message || fallback);
    };

    const onApprove = async () => {
        if (!selectedId) return;
        try {
            const response = await approveMutation.mutateAsync(selectedId);
            showServerMessage(response, 'Request approved successfully');
        } catch (error) {
            toast.error(error?.message || 'Approve failed');
        }
    };

    const onAssignRoom = async () => {
        if (!selectedId) return;
        const parsed = Number(assignRoomId);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            toast.error('Please select a valid room');
            return;
        }

        try {
            const response = await assignMutation.mutateAsync({ requestId: selectedId, roomId: parsed });
            emitRoomDataChanged();
            showServerMessage(response, 'Room assigned successfully');
        } catch (error) {
            toast.error(error?.message || 'Assign room failed');
        }
    };

    const onReject = async () => {
        if (!selectedId) return;
        if (!rejectReason.trim()) {
            toast.error('Rejection reason is required');
            return;
        }

        try {
            const response = await rejectMutation.mutateAsync({
                requestId: selectedId,
                reason: rejectReason.trim(),
            });
            showServerMessage(response, 'Request rejected');
        } catch (error) {
            toast.error(error?.message || 'Reject failed');
        }
    };

    const openPhoto = async () => {
        if (!selectedId) return;
        try {
            const response = await openPhotoMutation.mutateAsync(selectedId);
            showServerMessage(response, 'Photo opened');
        } catch (error) {
            toast.error(error?.message || 'Failed to open photo');
        }
    };

    const openIdentity = async () => {
        if (!selectedId) return;
        try {
            const response = await openIdentityMutation.mutateAsync(selectedId);
            showServerMessage(response, 'Identity opened');
        } catch (error) {
            toast.error(error?.message || 'Failed to open identity');
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Request Queue</h1>

            <ApiErrorAlert
                error={
                    activeQuery.error ||
                    detailsQuery.error ||
                    roomsQuery.error ||
                    approveMutation.error ||
                    assignMutation.error ||
                    rejectMutation.error
                }
                className="mb-4"
            />

            <div className="mb-4 flex gap-2">
                <button
                    type="button"
                    onClick={() => setTab('pending')}
                    className={`rounded px-4 py-2 ${tab === 'pending' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300'}`}
                >
                    Pending
                </button>
                <button
                    type="button"
                    onClick={() => setTab('all')}
                    className={`rounded px-4 py-2 ${tab === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300'}`}
                >
                    All
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 rounded border border-gray-200 bg-white">
                    {activeQuery.isLoading ? (
                        <p className="p-4 text-gray-600">Loading requests...</p>
                    ) : requests.length === 0 ? (
                        <p className="p-6 text-center text-gray-500">No requests found.</p>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {requests.map((request) => (
                                <button
                                    key={request.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedId(request.id);
                                        setAssignRoomId(String(request.assignedRoomId || ''));
                                    }}
                                    className={`w-full p-4 text-left hover:bg-gray-50 ${selectedId === request.id ? 'bg-indigo-50' : ''}`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="font-semibold text-gray-900">{request.fullName}</p>
                                        <span className={`rounded px-2 py-1 text-xs font-semibold ${statusClass[request.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {String(request.status || '').replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{request.userEmail || 'No email'}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded border border-gray-200 bg-white p-4">
                    {selectedId == null ? (
                        <p className="text-gray-500">Select a request to see details.</p>
                    ) : detailsQuery.isLoading ? (
                        <p className="text-gray-600">Loading request details...</p>
                    ) : details ? (
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold text-gray-900">Request #{details.id}</h2>
                            <p className="text-sm text-gray-700">Name: {details.fullName}</p>
                            <p className="text-sm text-gray-700">Phone: {details.phone || 'N/A'}</p>
                            <p className="text-sm text-gray-700">Status: {String(details.status || '').replace('_', ' ')}</p>
                            <p className="text-sm text-gray-700">Assigned Room: {details.assignedRoomNumber || 'N/A'}</p>

                            <div className="flex flex-wrap gap-2">
                                <button type="button" disabled={actionBusy} onClick={openPhoto} className="rounded bg-gray-800 text-white px-3 py-2 text-sm disabled:opacity-60">
                                    View Photo
                                </button>
                                <button type="button" disabled={actionBusy} onClick={openIdentity} className="rounded bg-gray-800 text-white px-3 py-2 text-sm disabled:opacity-60">
                                    View Identity
                                </button>
                            </div>

                            <div className="pt-2 border-t border-gray-100 space-y-2">
                                <button
                                    type="button"
                                    disabled={actionBusy}
                                    onClick={onApprove}
                                    className="w-full rounded bg-green-600 text-white px-3 py-2 text-sm disabled:opacity-60"
                                >
                                    {approveMutation.isPending ? 'Approving...' : 'Approve'}
                                </button>

                                <div className="flex gap-2">
                                    <select
                                        value={assignRoomId}
                                        onChange={(event) => setAssignRoomId(event.target.value)}
                                        disabled={actionBusy || roomsQuery.isLoading}
                                        className="flex-1 rounded border border-gray-300 p-2 text-sm"
                                    >
                                        <option value="">Select room</option>
                                        {rooms.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                Room {room.roomNumber}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        disabled={actionBusy}
                                        onClick={onAssignRoom}
                                        className="rounded bg-indigo-600 text-white px-3 py-2 text-sm disabled:opacity-60"
                                    >
                                        {assignMutation.isPending ? 'Assigning...' : 'Assign'}
                                    </button>
                                </div>

                                <textarea
                                    value={rejectReason}
                                    onChange={(event) => setRejectReason(event.target.value)}
                                    rows={3}
                                    placeholder="Rejection reason"
                                    className="w-full rounded border border-gray-300 p-2 text-sm"
                                    disabled={actionBusy}
                                />
                                <button
                                    type="button"
                                    disabled={actionBusy}
                                    onClick={onReject}
                                    className="w-full rounded bg-red-600 text-white px-3 py-2 text-sm disabled:opacity-60"
                                >
                                    {rejectMutation.isPending ? 'Rejecting...' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">Unable to load request details.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequestQueue;
