export const STUDENT_REQUEST_STATUSES = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ROOM_ASSIGNED: "ROOM_ASSIGNED",
};

/**
 * @typedef {Object} StudentRequestDto
 * @property {number} id
 * @property {'PENDING'|'APPROVED'|'REJECTED'|'ROOM_ASSIGNED'} status
 * @property {string} fullName
 * @property {string} [dateOfBirth]
 * @property {string} [gender]
 * @property {string} [nationality]
 * @property {string} [phone]
 * @property {string} [address]
 * @property {string} [guardianName]
 * @property {string} [guardianContact]
 * @property {string} [emergencyContact]
 * @property {string} [checkInDate]
 * @property {string} [checkOutDate]
 * @property {number} [roomId]
 * @property {number} [assignedRoomId]
 * @property {string} [assignedRoomNumber]
 * @property {number} [studentId]
 * @property {string} [message]
 * @property {string} [submittedAt]
 * @property {string} [rejectionReason]
 * @property {string} [userEmail]
 */

/**
 * @typedef {Object} StudentSummaryDto
 * @property {number} id
 * @property {string} [name]
 * @property {string} [fullName]
 * @property {string} [email]
 * @property {string} [phone]
 * @property {string} [gender]
 * @property {string} [address]
 * @property {string|number} [roomNumber]
 * @property {{roomNumber?: string|number}} [room]
 */
