import React, { useEffect, useState } from 'react'
import api from '../api/axios';

const AddStudentForm = () => {

    const [room, setRoom] = useState('');
    const [student, setStudent] = useState({
        name: '',
        age: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        guardianName: '',
        guardianContact: '',
        roomId: '',

    });

    useEffect(() => {
        api.get('/rooms')
            .then((res) => {
                setRoom(res.data)
                console.log(res.data);
                console.log("asdf");
            })
    }, []);

    const handlechange = (e) => {
        const { name, value } = e.target;
        
        setStudent({ ...student, [name]: value });

    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const res = await api.post(`/students/room/${student.roomId}`, student);
        alert('Student added successfully!');
    }

    return (

        <form onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-4 border border-gray-200">
            <h3 className="text-2xl text-blue-700 font-bold text-center mb-4">Add Student</h3>

            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    name='name'
                    value={student.name}
                    onChange={handlechange}
                />

                <input
                    type="number"
                    placeholder="Age"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    name='age'
                    value={student.age}
                    onChange={handlechange}
                />

                <input
                    type="text"
                    placeholder="Gender"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    name='gender'
                    value={student.gender}
                    onChange={handlechange}
                />

                <input
                    type="text"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    name='email'
                    value={student.email}
                    onChange={handlechange}
                />

                <input
                    type="text"
                    placeholder="Phone Number"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    name='phone'
                    value={student.phone}
                    onChange={handlechange}
                />

                <input
                    type="text"
                    placeholder="Address"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    name='address'
                    value={student.address}
                    onChange={handlechange}
                />

                <input
                    type="text"
                    placeholder="Guardian Name"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    name='guardianName'
                    value={student.guardianName}
                    onChange={handlechange}
                />

                <input
                    type="text"
                    placeholder="Guardian Contact"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    name='guardianContact'
                    value={student.guardianContact}
                    onChange={handlechange}
                />

                <select
                    className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    name='roomId'
                    value={student.roomId}
                    onChange={handlechange}
                >
                    <option value="">Select Room</option>
                    {room &&
                        room.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.roomNumber}
                            </option>
                        ))}
                </select>
            </div>

            <button
                type="submit"
                className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg mt-4 hover:bg-green-600 transition duration-200"
            >
                Add Student
            </button>
        </form>

    )
}

export default AddStudentForm