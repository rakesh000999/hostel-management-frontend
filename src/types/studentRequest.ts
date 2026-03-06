export type StudentRequestStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ROOM_ASSIGNED";

export interface SubmitStudentRequestFormData {
    fullName: string;
    dateOfBirth: string; // yyyy-MM-dd
    gender: string;
    nationality: string;
    phone: string;
    address: string;
    guardianName: string;
    guardianContact: string;
    emergencyContact: string;
    checkInDate: string; // yyyy-MM-dd
    checkOutDate: string; // yyyy-MM-dd
    roomId: number;
    photo: File;
    identityDocument: File;
}

export interface StudentRequestDto {
    id: number;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    phone: string;
    address: string;
    guardianName: string;
    guardianContact: string;
    emergencyContact: string;
    checkInDate: string;
    checkOutDate: string;
    roomId?: number;
    assignedRoomId?: number;
    assignedRoomNumber?: string;
    userEmail?: string;
    status: StudentRequestStatus;
    submittedAt?: string;
    rejectionReason?: string;
}

export interface RejectRequestPayload {
    reason: string;
}

export interface AssignRoomPayload {
    roomId: number;
}
