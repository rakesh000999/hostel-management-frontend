import React, { useState } from 'react'
import api from '../api/axios'

const BookingForm = () => {

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        checkInDate: "",
        checkOutDate: "",
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await api.post(`/bookings`, formData)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">

                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Book Your Stay
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    Fill in the details below to reserve your room
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">
                                Check-in Date
                            </label>
                            <input
                                type="date"
                                name="checkInDate"
                                value={formData.checkInDate}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">
                                Check-out Date
                            </label>
                            <input
                                type="date"
                                name="checkOutDate"
                                value={formData.checkOutDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Confirm Booking
                    </button>

                </form>
            </div>
        </div>
    )
}

export default BookingForm
