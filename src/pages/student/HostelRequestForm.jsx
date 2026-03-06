import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import ApiErrorAlert from '../../components/common/ApiErrorAlert';
import {
    useAvailableRoomsQuery,
    useMyRequestStatusQuery,
    useSubmitStudentRequestMutation,
} from '../../hooks/useStudentRequests';

const requestSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.string().min(1, 'Gender is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    phone: z.string().min(7, 'Phone is required'),
    address: z.string().min(3, 'Address is required'),
    guardianName: z.string().min(2, 'Guardian name is required'),
    guardianContact: z.string().min(7, 'Guardian contact is required'),
    emergencyContact: z.string().min(7, 'Emergency contact is required'),
    checkInDate: z.string().min(1, 'Check-in date is required'),
    checkOutDate: z.string().min(1, 'Check-out date is required'),
    roomId: z.coerce.number().int().positive('Please select a room'),
    photo: z
        .any()
        .refine((file) => file instanceof File, 'Photo is required'),
    identityDocument: z
        .any()
        .refine((file) => file instanceof File, 'Identity document is required'),
});

const toMultipartFormData = (values) => {
    const data = new FormData();
    data.append('fullName', values.fullName);
    data.append('dateOfBirth', values.dateOfBirth);
    data.append('gender', values.gender);
    data.append('nationality', values.nationality);
    data.append('phone', values.phone);
    data.append('address', values.address);
    data.append('guardianName', values.guardianName);
    data.append('guardianContact', values.guardianContact);
    data.append('emergencyContact', values.emergencyContact);
    data.append('checkInDate', values.checkInDate);
    data.append('checkOutDate', values.checkOutDate);
    data.append('roomId', String(values.roomId));
    data.append('photo', values.photo);
    data.append('identityDocument', values.identityDocument);
    return data;
};

const HostelRequestForm = () => {
    const {
        data: rooms = [],
        isLoading: isRoomsLoading,
        error: roomsError,
    } = useAvailableRoomsQuery();

    const {
        data: myStatus,
        isLoading: isStatusLoading,
        error: statusError,
    } = useMyRequestStatusQuery();

    const submitMutation = useSubmitStudentRequestMutation();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            fullName: '',
            dateOfBirth: '',
            gender: '',
            nationality: '',
            phone: '',
            address: '',
            guardianName: '',
            guardianContact: '',
            emergencyContact: '',
            checkInDate: '',
            checkOutDate: '',
            roomId: 0,
            photo: undefined,
            identityDocument: undefined,
        },
    });

    const onSubmit = async (values) => {
        const formData = toMultipartFormData(values);

        try {
            const response = await submitMutation.mutateAsync(formData);
            toast.success(response?.message || 'Hostel request submitted successfully');
            reset();
        } catch (error) {
            toast.error(error?.message || 'Failed to submit request');
        }
    };

    const fieldError = (name) =>
        errors?.[name] ? <p className="text-xs text-red-600 mt-1">{errors[name].message}</p> : null;

    return (
        <div className="mx-auto max-w-5xl p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Hostel Request Form</h1>

            <ApiErrorAlert error={roomsError || statusError || submitMutation.error} className="mb-4" />

            {isStatusLoading ? (
                <div className="mb-4 rounded bg-blue-50 border border-blue-200 p-3 text-blue-700">Loading latest status...</div>
            ) : myStatus?.status ? (
                <div className="mb-4 rounded bg-indigo-50 border border-indigo-200 p-3 text-indigo-700">
                    Latest status: <span className="font-semibold">{String(myStatus.status).replace('_', ' ')}</span>
                </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input className="mt-1 w-full rounded border border-gray-300 p-2" {...register('fullName')} />
                        {fieldError('fullName')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date" className="mt-1 w-full rounded border border-gray-300 p-2" {...register('dateOfBirth')} />
                        {fieldError('dateOfBirth')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select className="mt-1 w-full rounded border border-gray-300 p-2" {...register('gender')}>
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {fieldError('gender')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nationality</label>
                        <input className="mt-1 w-full rounded border border-gray-300 p-2" {...register('nationality')} />
                        {fieldError('nationality')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input className="mt-1 w-full rounded border border-gray-300 p-2" {...register('phone')} />
                        {fieldError('phone')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                        <input className="mt-1 w-full rounded border border-gray-300 p-2" {...register('emergencyContact')} />
                        {fieldError('emergencyContact')}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea className="mt-1 w-full rounded border border-gray-300 p-2" rows={3} {...register('address')} />
                        {fieldError('address')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                        <input className="mt-1 w-full rounded border border-gray-300 p-2" {...register('guardianName')} />
                        {fieldError('guardianName')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Guardian Contact</label>
                        <input className="mt-1 w-full rounded border border-gray-300 p-2" {...register('guardianContact')} />
                        {fieldError('guardianContact')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Check In Date</label>
                        <input type="date" className="mt-1 w-full rounded border border-gray-300 p-2" {...register('checkInDate')} />
                        {fieldError('checkInDate')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Check Out Date</label>
                        <input type="date" className="mt-1 w-full rounded border border-gray-300 p-2" {...register('checkOutDate')} />
                        {fieldError('checkOutDate')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Room</label>
                        <select
                            className="mt-1 w-full rounded border border-gray-300 p-2"
                            disabled={isRoomsLoading}
                            {...register('roomId')}
                        >
                            <option value="">Select room</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Room {room.roomNumber} (Available: {Math.max(0, Number(room.capacity || 0) - Number(room.occupiedCount || 0))})
                                </option>
                            ))}
                        </select>
                        {fieldError('roomId')}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="mt-1 w-full rounded border border-gray-300 p-2"
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                setValue('photo', file, { shouldValidate: true });
                            }}
                        />
                        {fieldError('photo')}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Identity Document</label>
                        <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            className="mt-1 w-full rounded border border-gray-300 p-2"
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                setValue('identityDocument', file, { shouldValidate: true });
                            }}
                        />
                        {fieldError('identityDocument')}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="mt-6 w-full rounded bg-indigo-600 px-4 py-3 text-white font-semibold disabled:opacity-60"
                >
                    {submitMutation.isPending ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default HostelRequestForm;
