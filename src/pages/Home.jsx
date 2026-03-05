import React from 'react'
import Footer from '../components/Footer'
import { Link, useLocation } from 'react-router-dom'

import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, user } = useContext(AuthContext);
    const location = useLocation();
    const message = location.state?.message;

    return (
        <main className='min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-gray-100'>
            <header className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-800 via-transparent to-indigo-900 opacity-60"></div>
                <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-1/2">
                        {message && (
                            <p className="text-lg text-yellow-300 mb-3">{message}</p>
                        )}
                        {isAuthenticated && (
                            <p className="text-lg text-green-300 mb-3">Welcome back, {user?.name}!</p>
                        )}
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                            A Home Away From Home
                        </h1>
                        <p className="text-gray-300 mb-6 max-w-xl">
                            Comfortable, safe and affordable hostel accommodations with easy booking and friendly staff. Join our community today and enjoy hassle-free living.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to={isAuthenticated ? (user?.role === 'STUDENT' ? '/student-request' : '/dashboard') : '/bookings'}>
                                <button className='inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-5 py-3 rounded-lg shadow-lg'>
                                    {isAuthenticated ? (
                                        user?.role === 'STUDENT' ? 'Request Room' : 'Go to Dashboard'
                                    ) : (
                                        <>Book Now</>
                                    )}
                                </button>
                            </Link>

                            <Link to={isAuthenticated ? (user?.role === 'STUDENT' ? '/browse-rooms' : '/rooms') : '/browse-rooms'}>
                                <button className='inline-flex items-center gap-2 bg-transparent border border-gray-600 hover:border-amber-500 text-gray-200 px-5 py-3 rounded-lg'>View Rooms</button>
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 flex justify-center">
                        <div className="rounded-3xl overflow-hidden shadow-2xl w-full max-w-md">
                            <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=60" alt="hostel" className="w-full h-72 object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            <section className="max-w-6xl mx-auto px-6 py-12">
                <h2 className="text-3xl font-bold text-white mb-6">Why choose us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
                        <p className="text-gray-300">24/7 security with CCTV and strict access controls to keep residents safe.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Affordable Pricing</h3>
                        <p className="text-gray-300">Multiple plans to suit student budgets with easy monthly payments.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold mb-2">Community Events</h3>
                        <p className="text-gray-300">Regular community activities and support to make you feel at home.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}

export default Home