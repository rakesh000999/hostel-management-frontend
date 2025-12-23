import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AddStudentForm = () => {
    const [rooms, setRooms] = useState([]);
    const [student, setStudent] = useState({
        name: '',
        dob: '',
        gender: '',
        nationality: '',
        email: '',
        phone: '',
        address: '',
        guardianName: '',
        guardianContact: '',
        emergencyContact: '',
        roomId: '',
        checkInDate: '',
        checkOutDate: ''
    });

    const [files, setFiles] = useState({
        identityDocument: null,
        photo: null
    });

    useEffect(() => {
        api.get('/rooms').then(res => setRooms(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(student).forEach(([key, value]) =>
            formData.append(key, value)
        );

        if (files.identityDocument) {
            formData.append('identityDocument', files.identityDocument);
        }
        if (files.photo) {
            formData.append('photo', files.photo);
        }

        await api.post(`/students/room/${student.roomId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert('Student added successfully');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-6 space-y-6"
        >
            <h2 className="text-3xl font-bold text-blue-700 text-center">
                Student Registration
            </h2>

            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" placeholder="Full Name" onChange={handleChange}
                    className="input" required />
                <input type="number" name="dob" placeholder="Year of Birth / Age"
                    onChange={handleChange} className="input" required />
                <input name="gender" placeholder="Gender"
                    onChange={handleChange} className="input" />
                <input name="nationality" placeholder="Nationality"
                    onChange={handleChange} className="input" />
                <input type="email" name="email" placeholder="Email"
                    onChange={handleChange} className="input" />
                <input name="phone" placeholder="Phone"
                    onChange={handleChange} className="input" />
                <input name="address" placeholder="Address"
                    onChange={handleChange} className="input col-span-full" />
            </section>

            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="guardianName" placeholder="Guardian Name"
                    onChange={handleChange} className="input" />
                <input name="guardianContact" placeholder="Guardian Contact"
                    onChange={handleChange} className="input" />
                <input name="emergencyContact" placeholder="Emergency Contact"
                    onChange={handleChange} className="input" required />

                <select name="roomId" onChange={handleChange}
                    className="input bg-white" required>
                    <option value="">Select Room</option>
                    {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                            Room {room.roomNumber}
                        </option>
                    ))}
                </select>

                <input type="date" name="checkInDate"
                    onChange={handleChange} className="input" />
                <input type="date" name="checkOutDate"
                    onChange={handleChange} className="input" />
            </section>

            
            <section className="space-y-3">
                <label className="font-semibold text-gray-700">Upload Documents</label>

                <input type="file" name="identityDocument"
                    onChange={handleFileChange}
                    className="file-input" required />

                <input type="file" name="photo"
                    onChange={handleFileChange}
                    className="file-input" />
            </section>

            <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
            >
                Register Student
            </button>
        </form>
    );
};

export default AddStudentForm;
