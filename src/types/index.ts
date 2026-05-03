export type Role = "ADMIN" | "DOCTOR" | "STAFF" | "PATIENT";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Patient {
  id: string;
  patientId: string;
  name: string;
  age: number;
  gender: Gender;
  contact: string;
  address?: string;
  bloodGroup?: string;
  medicalHistory?: string;
  createdAt: Date;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availability?: any;
}

export type BedStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export interface Bed {
  id: string;
  bedNumber: string;
  ward: string;
  status: BedStatus;
  admission?: Admission;
}

export interface Admission {
  id: string;
  patientId: string;
  patient?: Patient;
  bedId: string;
  admissionDate: Date;
  dischargeDate?: Date;
  nursingRecords?: string;
}
