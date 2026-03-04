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
        if (!formData.fullName) errs.fullName = 'Full name is required';
        if (!formData.dateOfBirth) errs.dateOfBirth = 'Birth date is required';
        if (!formData.phone) errs.phone = 'Phone number is required';
        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) errs.phone = 'Enter 10-digit phone';
        if (!formData.emergencyContact) errs.emergencyContact = 'Emergency contact required';
        if (!formData.checkInDate) errs.checkInDate = 'Check-in date required';
        if (formData.checkOutDate && formData.checkOutDate < formData.checkInDate) errs.checkOutDate = 'Check-out date cannot be before check-in';
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
            setMessage(res.message || 'Submitted successfully');
            setFieldErrors({});
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">Hostel Registration Form</h2>
            {message && <p className="text-green-600 mb-4">{message}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Full Name"
                            required
                            className="input"
                        />
                        {fieldErrors.fullName && <span className="text-red-500 text-sm">{fieldErrors.fullName}</span>}
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                        {fieldErrors.dateOfBirth && <span className="text-red-500 text-sm">{fieldErrors.dateOfBirth}</span>}
                    </div>
                    <input
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        placeholder="Gender"
                        className="input"
                    />
                    <input
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        placeholder="Nationality"
                        className="input"
                    />
                    <div className="flex flex-col">
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="input"
                        />
                        {fieldErrors.phone && <span className="text-red-500 text-sm">{fieldErrors.phone}</span>}
                    </div>
                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="input col-span-full"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleChange}
                        placeholder="Guardian Name"
                        className="input"
                    />
                    <input
                        name="guardianContact"
                        value={formData.guardianContact}
                        onChange={handleChange}
                        placeholder="Guardian Contact"
                        className="input"
                    />
                    <div className="flex flex-col">
                        <input
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            placeholder="Emergency Contact"
                            className="input"
                            required
                        />
                        {fieldErrors.emergencyContact && <span className="text-red-500 text-sm">{fieldErrors.emergencyContact}</span>}
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="date"
                            name="checkInDate"
                            value={formData.checkInDate}
                            onChange={handleChange}
                            placeholder="Check-in Date"
                            className="input"
                            required
                        />
                        {fieldErrors.checkInDate && <span className="text-red-500 text-sm">{fieldErrors.checkInDate}</span>}
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="date"
                            name="checkOutDate"
                            value={formData.checkOutDate}
                            onChange={handleChange}
                            placeholder="Check-out Date"
                            className="input"
                        />
                        {fieldErrors.checkOutDate && <span className="text-red-500 text-sm">{fieldErrors.checkOutDate}</span>}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default StudentRequest;
