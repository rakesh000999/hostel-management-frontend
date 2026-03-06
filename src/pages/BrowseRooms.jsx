import React, { useState, useEffect } from 'react';
import { getAllRooms, getAvailableRooms } from '../api/roomsApi';
import { ROOM_DATA_CHANGED_EVENT } from '../utils/roomEvents';
import SecureImage from '../components/common/SecureImage';

const BrowseRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    const getOccupiedCount = (room) => {
        const fromStudents = Array.isArray(room?.students) ? room.students.length : null;
        const fromBackend = Number(room?.occupiedCount);
        const rawCount = fromStudents !== null ? fromStudents : Number.isFinite(fromBackend) ? fromBackend : 0;
        const capacity = Number(room?.capacity);

        if (!Number.isFinite(capacity)) {
            return Math.max(0, rawCount);
        }

        return Math.min(Math.max(0, rawCount), Math.max(0, capacity));
    };

    const fetchRooms = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = showAvailableOnly ? await getAvailableRooms() : await getAllRooms();
            setRooms(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();

        const onRoomDataChanged = () => {
            fetchRooms();
        };

        window.addEventListener(ROOM_DATA_CHANGED_EVENT, onRoomDataChanged);
        const intervalId = window.setInterval(fetchRooms, 15000);

        return () => {
            window.removeEventListener(ROOM_DATA_CHANGED_EVENT, onRoomDataChanged);
            window.clearInterval(intervalId);
        };
    }, [showAvailableOnly]);

    if (loading) return <div className="p-6 text-center">Loading rooms...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">🏠 Available Rooms</h2>

                <div className="mb-6 flex justify-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                            className={`px-6 py-2 rounded-lg font-medium transition ${showAvailableOnly
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {showAvailableOnly ? 'Show All Rooms' : 'Show Available Only'}
                        </button>
                        <button
                            onClick={fetchRooms}
                            disabled={loading}
                            className="px-6 py-2 rounded-lg font-medium transition bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No rooms available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            (() => {
                                const occupiedCount = getOccupiedCount(room);
                                const capacity = Number(room.capacity) || 0;
                                const availableCount = Math.max(0, capacity - occupiedCount);
                                const isAvailable = availableCount > 0;

                                return (
                                    <div
                                        key={room.id}
                                        className={`bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 ${isAvailable ? 'border-2 border-green-200' : 'border-2 border-red-200'
                                            }`}
                                    >
                                        {room.imageUrl ? (
                                            <div className="relative h-48 bg-gray-200">
                                                <SecureImage
                                                    src={room.imageUrl}
                                                    alt={`Room ${room.roomNumber}`}
                                                    className="w-full h-full object-cover"
                                                    fallback={
                                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                            No Image
                                                        </div>
                                                    }
                                                />
                                                {!isAvailable && (
                                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                                                        FULL
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500">No Image</span>
                                            </div>
                                        )}

                                        <div className="p-4">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">Room {room.roomNumber}</h3>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p><span className="font-medium">Capacity:</span> {capacity}</p>
                                                <p><span className="font-medium">Occupied:</span> {occupiedCount}</p>
                                                <p><span className="font-medium">Available:</span> {availableCount}</p>
                                                <p><span className="font-medium">Rent:</span> Rs. {room.rentPerMonth}/month</p>
                                            </div>

                                            {isAvailable ? (
                                                <div className="mt-4">
                                                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        Available
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="mt-4">
                                                    <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                                        Fully Occupied
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseRooms;