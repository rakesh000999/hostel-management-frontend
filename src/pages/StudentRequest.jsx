import React, { useState, useContext } from 'react';
import { submitRequest } from '../api/studentRequestApi';
import AuthContext from '../context/AuthContext';

const StudentRequest = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
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
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
        if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required';
        if (!formData.phone.trim()) errs.phone = 'Phone number is required';
        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.trim())) errs.phone = 'Phone number must be 10 digits';
        if (!formData.emergencyContact.trim()) errs.emergencyContact = 'Emergency contact is required';
        if (!formData.checkInDate) errs.checkInDate = 'Check-in date is required';
        if (formData.checkOutDate && new Date(formData.checkOutDate) < new Date(formData.checkInDate)) errs.checkOutDate = 'Check-out date cannot be before check-in date';

        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        if (!validate()) return;
        setLoading(true);

        try {
            const res = await submitRequest(formData);
            setMessage(res.message || 'Request submitted successfully');
            setFieldErrors({});
            // Reset form
            setFormData({
                fullName: user?.name || '',
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
        } catch (err) {
            console.error('Submit error:', err);
            setError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Hostel Registration Form</h2>
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                <strong>Note:</strong> Document upload functionality is currently not available. Please ensure you have the required documents ready for submission at the hostel office.
            </div>
            {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {loading ? 'Submitting Request...' : 'Submit Hostel Request'}
                </button>
            </form>
        </div>
    );
};

export default StudentRequest;
