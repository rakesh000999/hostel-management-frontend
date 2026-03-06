export const ROOM_DATA_CHANGED_EVENT = "hms:room-data-changed";

export const emitRoomDataChanged = () => {
  window.dispatchEvent(new Event(ROOM_DATA_CHANGED_EVENT));
};
