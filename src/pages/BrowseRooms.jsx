import React, { useState, useEffect } from 'react';
import { getAllRooms, getAvailableRooms } from '../api/roomsApi';

const BrowseRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const data = showAvailableOnly ? await getAvailableRooms() : await getAllRooms();
            setRooms(data);
        } catch (err) {
            setError('Failed to load rooms');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [showAvailableOnly]);

    if (loading) return <div className="p-6 text-center">Loading rooms...</div>;
    if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">🏠 Available Rooms</h2>

                <div className="mb-6 flex justify-center">
                    <button
                        onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                        className={`px-6 py-2 rounded-lg font-medium transition ${showAvailableOnly
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {showAvailableOnly ? 'Show All Rooms' : 'Show Available Only'}
                    </button>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No rooms available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map((room) => (
                            <div
                                key={room.id}
                                className={`bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 ${room.capacity > room.occupiedCount ? 'border-2 border-green-200' : 'border-2 border-red-200'
                                    }`}
                            >
                                {room.images && room.images.length > 0 ? (
                                    <div className="relative h-48 bg-gray-200">
                                        <img
                                            src={room.images[0]}
                                            alt={`Room ${room.roomNumber}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-room.jpg'; // Fallback image
                                            }}
                                        />
                                        {room.capacity <= room.occupiedCount && (
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
                                        <p><span className="font-medium">Capacity:</span> {room.capacity}</p>
                                        <p><span className="font-medium">Occupied:</span> {room.occupiedCount}</p>
                                        <p><span className="font-medium">Available:</span> {room.capacity - room.occupiedCount}</p>
                                        <p><span className="font-medium">Rent:</span> Rs. {room.rentPerMonth}/month</p>
                                    </div>

                                    {room.capacity > room.occupiedCount ? (
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseRooms;