import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { emitRoomDataChanged } from '../utils/roomEvents';

const getRoomNumber = (student) =>
    student?.roomNumber || student?.room?.roomNumber || student?.assignedRoomNumber || '';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        guardianName: '',
        guardianContact: '',
        gender: '',
        roomId: '',
    });
    const [savingEdit, setSavingEdit] = useState(false);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError('');
            setMessage('');

            const [studentsRes, roomsRes] = await Promise.all([
                api.get('/students'),
                api.get('/rooms'),
            ]);

            const studentsData = Array.isArray(studentsRes.data) ? studentsRes.data : [];
            const roomsData = Array.isArray(roomsRes.data) ? roomsRes.data : [];

            // Only show students that are actually created and already have room allocation.
            const allocatedStudents = studentsData.filter((student) => Boolean(getRoomNumber(student)));

            setStudents(allocatedStudents);
            setRooms(roomsData);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const startEdit = (student) => {
        setMessage('');
        setError('');
        setEditingStudentId(student.id);
        setEditForm({
            name: student?.name || student?.fullName || '',
            email: student?.email || '',
            phone: student?.phone || '',
            address: student?.address || '',
            guardianName: student?.guardianName || '',
            guardianContact: student?.guardianContact || '',
            gender: student?.gender || '',
            roomId: String(student?.room?.id || student?.roomId || ''),
        });
    };

    const cancelEdit = () => {
        setEditingStudentId(null);
        setEditForm({
            name: '',
            email: '',
            phone: '',
            address: '',
            guardianName: '',
            guardianContact: '',
            gender: '',
            roomId: '',
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const saveEdit = async () => {
        if (!editingStudentId) return;

        if (!editForm.name.trim()) {
            setError('Student name is required.');
            return;
        }

        if (!editForm.roomId || Number(editForm.roomId) <= 0) {
            setError('Please select a valid room.');
            return;
        }

        try {
            setSavingEdit(true);
            setError('');
            await api.put(`/students/${editingStudentId}`, {
                name: editForm.name.trim(),
                email: editForm.email.trim(),
                phone: editForm.phone.trim(),
                address: editForm.address.trim(),
                guardianName: editForm.guardianName.trim(),
                guardianContact: editForm.guardianContact.trim(),
                gender: editForm.gender,
                roomId: Number(editForm.roomId),
            });
            emitRoomDataChanged();

            setMessage('Student details updated successfully.');
            cancelEdit();
            await fetchStudents();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to update student details.');
        } finally {
            setSavingEdit(false);
        }
    };

    const deleteStudent = async (studentId) => {
        const confirmed = window.confirm('Are you sure you want to delete this student?');
        if (!confirmed) return;

        try {
            setError('');
            setMessage('');
            await api.delete(`/students/${studentId}`);
            emitRoomDataChanged();
            setMessage('Student deleted successfully.');
            if (editingStudentId === studentId) {
                cancelEdit();
            }
            await fetchStudents();
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to delete student.');
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-emerald-600 text-center sm:text-left">
                    Students List
                </h3>
                <button
                    type="button"
                    onClick={fetchStudents}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {message && <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{message}</div>}
            {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>}

            <div className="hidden lg:block overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white">
                <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-emerald-500 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left font-semibold">ID</th>
                            <th className="py-3 px-4 text-left font-semibold">Name</th>
                            <th className="py-3 px-4 text-left font-semibold">Gender</th>
                            <th className="py-3 px-4 text-left font-semibold">Email</th>
                            <th className="py-3 px-4 text-left font-semibold">Phone</th>
                            <th className="py-3 px-4 text-left font-semibold">Room No.</th>
                            <th className="py-3 px-4 text-left font-semibold">Address</th>
                            <th className="py-3 px-4 text-left font-semibold">Guardian Name</th>
                            <th className="py-3 px-4 text-left font-semibold">Guardian Contact</th>
                            <th className="py-3 px-4 text-left font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.length > 0 ? (
                            students.map((student, index) => (
                                <tr
                                    key={student.id}
                                    className={`border-b ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-emerald-50 transition-colors duration-150`}
                                >
                                    <td className="py-3 px-4">{student.id}</td>
                                    <td className="py-3 px-4 font-medium text-gray-900">{student.name || student.fullName || '-'}</td>
                                    <td className="py-3 px-4">{student.gender || '-'}</td>
                                    <td className="py-3 px-4">{student.email || '-'}</td>
                                    <td className="py-3 px-4">{student.phone || '-'}</td>
                                    <td className="py-3 px-4">{getRoomNumber(student) || '-'}</td>
                                    <td className="py-3 px-4">{student.address || '-'}</td>
                                    <td className="py-3 px-4">{student.guardianName || '-'}</td>
                                    <td className="py-3 px-4">{student.guardianContact || '-'}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(student)}
                                                className="px-2 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteStudent(student.id)}
                                                className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center py-6 text-gray-500 italic">
                                    No approved students with allocated rooms found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="lg:hidden space-y-3">
                {students.length > 0 ? (
                    students.map((student) => (
                        <div key={student.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                            <p className="text-sm text-gray-500">ID: {student.id}</p>
                            <h4 className="text-lg font-semibold text-gray-900">{student.name || student.fullName || '-'}</h4>
                            <p className="text-sm text-gray-700">Gender: {student.gender || '-'}</p>
                            <p className="text-sm text-gray-700">Email: {student.email || '-'}</p>
                            <p className="text-sm text-gray-700">Phone: {student.phone || '-'}</p>
                            <p className="text-sm text-gray-700">Room: {getRoomNumber(student) || '-'}</p>
                            <p className="text-sm text-gray-700">Address: {student.address || '-'}</p>
                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => startEdit(student)}
                                    className="px-3 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => deleteStudent(student.id)}
                                    className="px-3 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center py-6 text-gray-500 italic bg-white rounded-xl border border-gray-200">
                        No approved students with allocated rooms found.
                    </p>
                )}
            </div>

            {editingStudentId && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl p-5 shadow-xl">
                        <h4 className="text-xl font-semibold mb-4">Edit Student</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded p-2"
                                placeholder="Name"
                            />
                            <input
                                name="gender"
                                value={editForm.gender}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded p-2"
                                placeholder="Gender"
                            />
                            <input
                                name="email"
                                value={editForm.email}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded p-2"
                                placeholder="Email"
                            />
                            <input
                                name="phone"
                                value={editForm.phone}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded p-2"
                                placeholder="Phone"
                            />
                            <input
                                name="guardianName"
                                value={editForm.guardianName}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded p-2"
                                placeholder="Guardian Name"
                            />
                            <input
                                name="guardianContact"
                                value={editForm.guardianContact}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded p-2"
                                placeholder="Guardian Contact"
                            />
                            <select
                                name="roomId"
                                value={editForm.roomId}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded p-2"
                            >
                                <option value="">Select Room</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        Room {room.roomNumber}
                                    </option>
                                ))}
                            </select>
                            <input
                                name="address"
                                value={editForm.address}
                                onChange={handleEditChange}
                                className="border border-gray-300 rounded p-2 sm:col-span-2"
                                placeholder="Address"
                            />
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-4 py-2 rounded bg-gray-300 text-gray-800"
                                disabled={savingEdit}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveEdit}
                                className="px-4 py-2 rounded bg-indigo-600 text-white"
                                disabled={savingEdit}
                            >
                                {savingEdit ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
