import React from 'react'
import RoomList from '../components/RoomList'
import AddRoomForm from '../components/AddRoomForm'

const Rooms = () => {
  return (
    <div>
      <AddRoomForm/>
      <hr />
      <RoomList />
    </div>
  )
}

export default Rooms