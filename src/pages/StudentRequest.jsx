import React, { useState, useContext, useEffect } from 'react';
import { submitRequest, getMyStatus } from '../api/studentRequestApi';
import { getAvailableRooms } from '../api/roomsApi';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentRequest = () => {
    const { user, token } = useContext(AuthContext);
    const effectiveToken =
        token ||
        localStorage.getItem('token') ||
        localStorage.getItem('jwtToken') ||
        localStorage.getItem('accessToken') ||
        localStorage.getItem('authToken');
    const navigate = useNavigate();
    const isStudent = user?.role === 'STUDENT';
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        roomId: '',
        dateOfBirth: '',
        gender: '',
        nationality: '',
        phone: '',
        address: '',
        guardianName: '',
        guardianContact: '',
        emergencyContact: '',
        checkInDate: '',
        checkOutDate: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [latestStatus, setLatestStatus] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [files, setFiles] = useState({
        identityDocument: null,
        photo: null
    });
    const [rooms, setRooms] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(true);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            fullName: user?.name || prev.fullName,
        }));
    }, [user]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getAvailableRooms();
                const availableRooms = (data || []).filter((room) => room.occupiedCount < room.capacity);
                setRooms(availableRooms);
            } catch {
                setError('Failed to load available rooms');
            } finally {
                setLoadingRooms(false);
            }
        };

        fetchRooms();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        setFiles(prev => ({ ...prev, [name]: selectedFiles[0] || null }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
        if (!formData.roomId) errs.roomId = 'Please select a room';
        if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
        if (!formData.phone.trim()) errs.phone = 'Phone number is required';
        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.trim())) errs.phone = 'Phone number must be 10 digits';
        if (!formData.emergencyContact.trim()) errs.emergencyContact = 'Emergency contact is required';
        if (!formData.checkInDate) errs.checkInDate = 'Check-in date is required';
        if (!formData.checkOutDate) errs.checkOutDate = 'Check-out date is required';
        if (formData.checkOutDate && new Date(formData.checkOutDate) < new Date(formData.checkInDate)) errs.checkOutDate = 'Check-out date cannot be before check-in date';
        if (!files.identityDocument) errs.identityDocument = 'Identity document is required';
        if (!files.photo) errs.photo = 'Photo is required';

        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const fetchLatestStatus = async () => {
        try {
            setStatusLoading(true);
            const status = await getMyStatus();
            setLatestStatus(status);
        } catch {
            setLatestStatus(null);
        } finally {
            setStatusLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!isStudent) {
            setError('Student access required');
            navigate('/login');
            return;
        }

        if (!effectiveToken) {
            setError('Authentication required. Please login again.');
            navigate('/login');
            return;
        }

        if (!validate()) return;
        setLoading(true);

        try {
            const payload = new FormData();
            payload.append('fullName', formData.fullName?.trim() || '');
            payload.append('dateOfBirth', formData.dateOfBirth || '');
            payload.append('gender', formData.gender || '');
            payload.append('nationality', formData.nationality || '');
            payload.append('phone', formData.phone?.trim() || '');
            payload.append('address', formData.address || '');
            payload.append('guardianName', formData.guardianName || '');
            payload.append('guardianContact', formData.guardianContact || '');
            payload.append('emergencyContact', formData.emergencyContact?.trim() || '');
            payload.append('checkInDate', formData.checkInDate || '');
            payload.append('checkOutDate', formData.checkOutDate || '');
            payload.append('roomId', String(Number(formData.roomId)));

            if (files.photo) {
                payload.append('photo', files.photo);
            }
            if (files.identityDocument) {
                payload.append('identityDocument', files.identityDocument);
            }

            const res = await submitRequest(payload, effectiveToken);
            setMessage(res.message || 'Student details submitted successfully');
            setFieldErrors({});
            await fetchLatestStatus();

            setFormData({
                fullName: user?.name || '',
                roomId: '',
                dateOfBirth: '',
                gender: '',
                nationality: '',
                phone: '',
                address: '',
                guardianName: '',
                guardianContact: '',
                emergencyContact: '',
                checkInDate: '',
                checkOutDate: ''
            });
            setFiles({
                identityDocument: null,
                photo: null
            });
        } catch (err) {
            console.error('Submit error:', err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError('Authentication failed for student request. Please login with a STUDENT account.');
                navigate('/login');
                return;
            }
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Hostel Registration Form</h2>
            {!isStudent && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    Student access required. Please login with a STUDENT account.
                </div>
            )}
            {loadingRooms && <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">Loading available rooms...</div>}
            {!loadingRooms && rooms.length === 0 && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">No room with empty slots is available right now.</div>
            )}
            {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {statusLoading && <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">Loading latest request status...</div>}
            {latestStatus?.status && (
                <div className="mb-4 p-3 bg-indigo-100 text-indigo-700 rounded">
                    Latest request status: <span className="font-semibold">{String(latestStatus.status).replace('_', ' ')}</span>
                </div>
            )}

            {!loadingRooms && rooms.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Select Room (empty slots only)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rooms.map((room) => {
                            const emptySlots = room.capacity - room.occupiedCount;
                            const roomImage = room.imageUrl || room.images?.[0] || '';
                            const selected = String(formData.roomId) === String(room.id);

                            return (
                                <button
                                    type="button"
                                    key={room.id}
                                    onClick={() => setFormData(prev => ({ ...prev, roomId: String(room.id) }))}
                                    className={`text-left border rounded-lg overflow-hidden ${selected ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'}`}
                                >
                                    <div className="h-40 bg-gray-100">
                                        {roomImage ? (
                                            <img src={roomImage} alt={`Room ${room.roomNumber}`} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">No image</div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="font-semibold text-gray-800">Room {room.roomNumber}</p>
                                        <p className="text-sm text-gray-600">Empty slots: {emptySlots}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {fieldErrors.roomId && <span className="text-red-500 text-sm mt-1 block">{fieldErrors.roomId}</span>}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="fullName" className="text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`input ${fieldErrors.fullName ? 'border-red-500' : ''}`}
                            required
                        />
                        {fieldErrors.fullName && <span className="text-red-500 text-sm mt-1">{fieldErrors.fullName}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                        <input
                            id="dateOfBirth"
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className={`input ${fieldErrors.dateOfBirth ? 'border-red-500' : ''}`}
                            required
                        />
                        {fieldErrors.dateOfBirth && <span className="text-red-500 text-sm mt-1">{fieldErrors.dateOfBirth}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="nationality" className="text-sm font-medium text-gray-700 mb-1">Nationality</label>
                        <input
                            id="nationality"
                            name="nationality"
                            type="text"
                            value={formData.nationality}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`input ${fieldErrors.phone ? 'border-red-500' : ''}`}
                            placeholder="10-digit number"
                        />
                        {fieldErrors.phone && <span className="text-red-500 text-sm mt-1">{fieldErrors.phone}</span>}
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="input"
                            rows="3"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="guardianName" className="text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                        <input
                            id="guardianName"
                            name="guardianName"
                            type="text"
                            value={formData.guardianName}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="guardianContact" className="text-sm font-medium text-gray-700 mb-1">Guardian Contact</label>
                        <input
                            id="guardianContact"
                            name="guardianContact"
                            type="tel"
                            value={formData.guardianContact}
                            onChange={handleChange}
                            className="input"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700 mb-1">Emergency Contact *</label>
                        <input
                            id="emergencyContact"
                            name="emergencyContact"
                            type="tel"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            className={`input ${fieldErrors.emergencyContact ? 'border-red-500' : ''}`}
                            required
                        />
                        {fieldErrors.emergencyContact && <span className="text-red-500 text-sm mt-1">{fieldErrors.emergencyContact}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="checkInDate" className="text-sm font-medium text-gray-700 mb-1">Check-in Date *</label>
                        <input
                            id="checkInDate"
                            type="date"
                            name="checkInDate"
                            value={formData.checkInDate}
                            onChange={handleChange}
                            className={`input ${fieldErrors.checkInDate ? 'border-red-500' : ''}`}
                            required
                        />
                        {fieldErrors.checkInDate && <span className="text-red-500 text-sm mt-1">{fieldErrors.checkInDate}</span>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="checkOutDate" className="text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                        <input
                            id="checkOutDate"
                            type="date"
                            name="checkOutDate"
                            value={formData.checkOutDate}
                            onChange={handleChange}
                            className={`input ${fieldErrors.checkOutDate ? 'border-red-500' : ''}`}
                        />
                        {fieldErrors.checkOutDate && <span className="text-red-500 text-sm mt-1">{fieldErrors.checkOutDate}</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="identityDocument" className="text-sm font-medium text-gray-700 mb-1">Identity Document *</label>
                        <input
                            id="identityDocument"
                            type="file"
                            name="identityDocument"
                            onChange={handleFileChange}
                            className={`input ${fieldErrors.identityDocument ? 'border-red-500' : ''}`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                        />
                        {fieldErrors.identityDocument && <span className="text-red-500 text-sm mt-1">{fieldErrors.identityDocument}</span>}
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="photo" className="text-sm font-medium text-gray-700 mb-1">Photo *</label>
                        <input
                            id="photo"
                            type="file"
                            name="photo"
                            onChange={handleFileChange}
                            className={`input ${fieldErrors.photo ? 'border-red-500' : ''}`}
                            accept=".jpg,.jpeg,.png"
                            required
                        />
                        {fieldErrors.photo && <span className="text-red-500 text-sm mt-1">{fieldErrors.photo}</span>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !isStudent}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {loading ? 'Submitting Details...' : 'Submit Student Details'}
                </button>
            </form>
        </div>
    );
};

export default StudentRequest;
