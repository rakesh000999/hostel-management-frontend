import React from 'react'
import { Twitter, Facebook, Instagram, MapPin, Mail } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h4 className="text-xl font-bold mb-2">Hostel Management</h4>
                    <p className="text-gray-400">Comfortable, secure and affordable living for students. Reach out for bookings or tours.</p>
                    <div className="flex items-center gap-4 mt-4">
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-gray-800">
                            <Twitter />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-gray-800">
                            <Facebook />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded hover:bg-gray-800">
                            <Instagram />
                        </a>
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h5 className="font-semibold mb-2 flex items-center gap-2"><MapPin size={16} /> Our Location</h5>
                        <p className="text-gray-400">123 Campus Road, College Town, Country</p>
                        <div className="mt-4 rounded overflow-hidden shadow-lg">
                            <iframe
                                title="hostel-map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019853490622!2d-122.41941508468186!3d37.77492977975943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085818c2a2e3bdf%3A0x4a6e0b8fd6b2fa6f!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1600000000000!5m2!1sen!2sus"
                                width="100%"
                                height="200"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>

                    <div>
                        <h5 className="font-semibold mb-2 flex items-center gap-2"><Mail size={16} /> Contact</h5>
                        <p className="text-gray-400">Email: info@hostel.example</p>
                        <p className="text-gray-400">Phone: +1 234 567 890</p>
                        <div className="mt-4">
                            <a href="/bookings" className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg shadow">Make a Booking</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 py-4">
                <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Hostel Management — All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer