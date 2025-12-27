/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "scheduled" | "cancelled";

declare type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

declare interface DoctorAvailability {
  $id?: string;
  doctorName: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  isAvailable: boolean;
}

declare interface DoctorBlockedSlot {
  $id?: string;
  doctorName: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason?: string;
}

declare interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
}

declare interface Prescription {
  $id?: string;
  patientId: string;
  doctorName: string;
  appointmentId?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  prescribedDate: Date;
  status: "active" | "completed" | "discontinued";
}

declare interface TestResult {
  $id?: string;
  patientId: string;
  doctorName: string;
  appointmentId?: string;
  testName: string;
  testType: string;
  result: string;
  resultDate: Date;
  normalRange?: string;
  notes?: string;
  status: "pending" | "completed" | "abnormal";
}

declare interface MedicalHistoryEntry {
  $id?: string;
  patientId: string;
  date: Date;
  type: "appointment" | "prescription" | "test" | "diagnosis";
  title: string;
  description: string;
  doctorName?: string;
}

declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
}
declare interface User extends CreateUserParams {
  $id: string;
}

declare interface RegisterUserParams extends CreateUserParams {
  userId: string;
  birthDate: Date;
  gender: Gender;
  address: string;
  occupation: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  primaryPhysician: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  allergies: string | undefined;
  currentMedication: string | undefined;
  familyMedicalHistory: string | undefined;
  pastMedicalHistory: string | undefined;
  identificationType: string | undefined;
  identificationNumber: string | undefined;
  identificationDocument: FormData | undefined;
  privacyConsent: boolean;
}

declare type CreateAppointmentParams = {
  userId: string;
  patient: string;
  primaryPhysician: string;
  reason: string;
  schedule: Date;
  status: Status;
  note: string | undefined;
};

declare type UpdateAppointmentParams = {
  appointmentId: string;
  userId: string;
  timeZone: string;
  appointment: Appointment;
  type: string;
};
