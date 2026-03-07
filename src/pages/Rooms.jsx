import React from 'react'
import RoomList from '../components/RoomList'
import AddRoomForm from '../components/AddRoomForm'

const Rooms = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl bg-linear-to-r from-cyan-600 to-blue-600 px-6 py-7 text-white shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold">Room Management</h1>
          <p className="mt-1 text-sm sm:text-base text-cyan-100">
            Create rooms, manage occupancy, and monitor assigned students.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="xl:col-span-1 xl:sticky xl:top-24">
            <AddRoomForm />
          </div>
          <div className="xl:col-span-2">
            <RoomList />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rooms