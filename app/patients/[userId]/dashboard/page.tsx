"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { generateAppointmentPDF, generateAllAppointmentsPDF } from "@/lib/pdf-generator";
import { Button } from "@/components/ui/button";
import { MedicalTimeline } from "@/components/MedicalTimeline";
import { PrescriptionList } from "@/components/PrescriptionList";
import { TestResults } from "@/components/TestResults";

interface Appointment {
  $id: string;
  schedule: string;
  status: string;
  primaryPhysician: string;
  reason: string;
  note?: string;
}

interface Patient {
  $id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
}

type TabType = "overview" | "timeline" | "prescriptions" | "tests";

export default function PatientDashboard({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Fetch patient data
        const patientResponse = await fetch(`/api/patient/${params.userId}`);
        const patientData = await patientResponse.json();
        setPatient(patientData);

        // Fetch patient appointments
        const appointmentsResponse = await fetch(`/api/appointments/${params.userId}`);
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [params.userId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-light-200">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled" || apt.status === "pending"
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === "cancelled" || new Date(apt.schedule) < new Date()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-dark-500/10 text-dark-700 border-dark-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadAppointment = (appointment: Appointment) => {
    if (!patient) return;

    const appointmentDate = new Date(appointment.schedule);
    generateAppointmentPDF({
      patientName: patient.name,
      patientEmail: patient.email,
      patientPhone: patient.phone,
      doctorName: appointment.primaryPhysician,
      appointmentDate: appointmentDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      appointmentTime: appointmentDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      reason: appointment.reason,
      status: appointment.status,
      note: appointment.note,
      appointmentId: appointment.$id,
    });
  };

  const handleDownloadAllAppointments = () => {
    if (!patient || appointments.length === 0) return;

    const appointmentData = appointments.map((apt) => {
      const date = new Date(apt.schedule);
      return {
        patientName: patient.name,
        patientEmail: patient.email,
        patientPhone: patient.phone,
        doctorName: apt.primaryPhysician,
        appointmentDate: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        appointmentTime: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        reason: apt.reason,
        status: apt.status,
        note: apt.note,
        appointmentId: apt.$id,
      };
    });

    generateAllAppointmentsPDF(appointmentData, patient.name);
  };

  return (
    <div className="flex h-screen max-h-screen">
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto remove-scrollbar">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-dark-500 bg-dark-200 px-[5%] py-5 shadow-lg">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/assets/icons/logo-full.svg"
              height={32}
              width={162}
              alt="logo"
              className="h-8 w-fit"
            />
          </Link>

          <div className="flex items-center gap-3">
            {appointments.length > 0 && (
              <Button
                onClick={handleDownloadAllAppointments}
                variant="outline"
                className="shad-gray-btn rounded-full px-5 py-2 flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download All
              </Button>
            )}
            <Link
              href={`/patients/${params.userId}/new-appointment`}
              className="shad-primary-btn rounded-full px-6 py-2"
            >
              Book Appointment
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 px-[5%] py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="header mb-2">Welcome back, {patient?.name?.split(" ")[0]}! 👋</h1>
            <p className="text-dark-700">
              Manage your appointments and health information
            </p>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <div className="flex gap-2 border-b border-dark-500 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 text-14-semibold transition-all whitespace-nowrap ${
                  activeTab === "overview"
                    ? "text-green-500 border-b-2 border-green-500"
                    : "text-dark-700 hover:text-light-200"
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab("timeline")}
                className={`px-6 py-3 text-14-semibold transition-all whitespace-nowrap ${
                  activeTab === "timeline"
                    ? "text-green-500 border-b-2 border-green-500"
                    : "text-dark-700 hover:text-light-200"
                }`}
              >
                📅 Medical History
              </button>
              <button
                onClick={() => setActiveTab("prescriptions")}
                className={`px-6 py-3 text-14-semibold transition-all whitespace-nowrap ${
                  activeTab === "prescriptions"
                    ? "text-green-500 border-b-2 border-green-500"
                    : "text-dark-700 hover:text-light-200"
                }`}
              >
                💊 Prescriptions
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-6 py-3 text-14-semibold transition-all whitespace-nowrap ${
                  activeTab === "tests"
                    ? "text-green-500 border-b-2 border-green-500"
                    : "text-dark-700 hover:text-light-200"
                }`}
              >
                🔬 Test Results
              </button>
            </div>
          </motion.div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <>
              {/* Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
              >
                <div className="stat-card bg-appointments">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/assets/icons/appointments.svg"
                      height={32}
                      width={32}
                      alt="appointments"
                      className="size-8 w-fit"
                    />
                    <h2 className="text-32-bold text-white">{appointments.length}</h2>
                  </div>
                  <p className="text-14-regular text-white mt-2">Total Appointments</p>
                </div>

                <div className="stat-card bg-pending">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/assets/icons/pending.svg"
                      height={32}
                      width={32}
                      alt="pending"
                      className="size-8 w-fit"
                    />
                    <h2 className="text-32-bold text-white">
                      {appointments.filter((a) => a.status === "pending").length}
                    </h2>
                  </div>
                  <p className="text-14-regular text-white mt-2">Pending</p>
                </div>

                <div className="stat-card bg-appointments">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/assets/icons/check.svg"
                      height={32}
                      width={32}
                      alt="scheduled"
                      className="size-8 w-fit"
                    />
                    <h2 className="text-32-bold text-white">
                      {appointments.filter((a) => a.status === "scheduled").length}
                    </h2>
                  </div>
                  <p className="text-14-regular text-white mt-2">Scheduled</p>
                </div>

                <div className="stat-card bg-cancelled">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/assets/icons/cancelled.svg"
                      height={32}
                      width={32}
                      alt="cancelled"
                      className="size-8 w-fit"
                    />
                    <h2 className="text-32-bold text-white">
                      {appointments.filter((a) => a.status === "cancelled").length}
                    </h2>
                  </div>
                  <p className="text-14-regular text-white mt-2">Cancelled</p>
                </div>
              </motion.div>
            </>
          )}

          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="sub-header">Upcoming Appointments</h2>
              <Link
                href={`/patients/${params.userId}/new-appointment`}
                className="text-14-regular text-green-500 hover:underline"
              >
                + Book New
              </Link>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="rounded-2xl border border-dark-500 bg-dark-400 p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dark-500">
                    <Image
                      src="/assets/icons/calendar.svg"
                      height={32}
                      width={32}
                      alt="calendar"
                    />
                  </div>
                  <div>
                    <h3 className="text-18-bold text-light-200 mb-2">
                      No upcoming appointments
                    </h3>
                    <p className="text-14-regular text-dark-700 mb-4">
                      Book your first appointment with our doctors
                    </p>
                    <Link
                      href={`/patients/${params.userId}/new-appointment`}
                      className="shad-primary-btn rounded-full px-6 py-2 inline-block"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.$id}
                    className="rounded-2xl border border-dark-500 bg-dark-400 p-6 hover:border-green-500 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600">
                            <span className="text-18-bold text-white">
                              {appointment.primaryPhysician.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-16-semibold text-light-200">
                              Dr. {appointment.primaryPhysician}
                            </h3>
                            <p className="text-14-regular text-dark-700">
                              {formatDate(appointment.schedule)}
                            </p>
                          </div>
                        </div>
                        <p className="text-14-regular text-dark-700 mb-2">
                          <span className="text-light-200">Reason:</span> {appointment.reason}
                        </p>
                        {appointment.note && (
                          <p className="text-14-regular text-dark-700">
                            <span className="text-light-200">Note:</span> {appointment.note}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div
                          className={`status-badge ${getStatusColor(appointment.status)}`}
                        >
                          <span className="text-12-semibold capitalize">
                            {appointment.status}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleDownloadAppointment(appointment)}
                          variant="outline"
                          size="sm"
                          className="shad-gray-btn flex items-center gap-2"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="sub-header mb-5">Past Appointments</h2>
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div
                    key={appointment.$id}
                    className="rounded-2xl border border-dark-500 bg-dark-400 p-6 opacity-75"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-dark-500">
                            <span className="text-18-bold text-white">
                              {appointment.primaryPhysician.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-16-semibold text-light-200">
                              Dr. {appointment.primaryPhysician}
                            </h3>
                            <p className="text-14-regular text-dark-700">
                              {formatDate(appointment.schedule)}
                            </p>
                          </div>
                        </div>
                        <p className="text-14-regular text-dark-700">
                          <span className="text-light-200">Reason:</span> {appointment.reason}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div
                          className={`status-badge ${getStatusColor(appointment.status)}`}
                        >
                          <span className="text-12-semibold capitalize">
                            {appointment.status}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleDownloadAppointment(appointment)}
                          variant="outline"
                          size="sm"
                          className="shad-gray-btn flex items-center gap-2"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Medical Timeline Tab */}
          {activeTab === "timeline" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="sub-header mb-5">Medical History Timeline</h2>
              <MedicalTimeline
                entries={[
                  ...appointments.map((apt) => ({
                    date: new Date(apt.schedule),
                    type: "appointment" as const,
                    title: `Appointment with Dr. ${apt.primaryPhysician}`,
                    description: apt.reason,
                    doctorName: apt.primaryPhysician,
                  })),
                  // Mock data - replace with real data from your backend
                  {
                    date: new Date("2024-12-15"),
                    type: "prescription" as const,
                    title: "New Prescription",
                    description: "Prescribed Amoxicillin 500mg for bacterial infection",
                    doctorName: "Dr. Smith",
                  },
                  {
                    date: new Date("2024-12-10"),
                    type: "test" as const,
                    title: "Blood Test Results",
                    description: "Complete Blood Count - All values normal",
                    doctorName: "Dr. Johnson",
                  },
                ]}
              />
            </motion.div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === "prescriptions" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="sub-header">My Prescriptions</h2>
                <div className="flex gap-2">
                  <button className="text-12-medium text-dark-700 hover:text-light-200 px-3 py-1 rounded-lg bg-dark-400 border border-dark-500">
                    All
                  </button>
                  <button className="text-12-medium text-dark-700 hover:text-light-200 px-3 py-1 rounded-lg bg-dark-400 border border-dark-500">
                    Active
                  </button>
                  <button className="text-12-medium text-dark-700 hover:text-light-200 px-3 py-1 rounded-lg bg-dark-400 border border-dark-500">
                    Completed
                  </button>
                </div>
              </div>
              <PrescriptionList
                prescriptions={[
                  // Mock data - replace with real data from your backend
                  {
                    $id: "1",
                    medicationName: "Amoxicillin",
                    dosage: "500mg",
                    frequency: "3 times daily",
                    duration: "7 days",
                    instructions: "Take with food. Complete full course even if symptoms improve.",
                    prescribedDate: new Date("2024-12-15"),
                    doctorName: "John Green",
                    status: "active",
                  },
                  {
                    $id: "2",
                    medicationName: "Ibuprofen",
                    dosage: "400mg",
                    frequency: "As needed",
                    duration: "30 days",
                    instructions: "Take for pain relief. Do not exceed 3 doses per day.",
                    prescribedDate: new Date("2024-11-20"),
                    doctorName: "Sarah Johnson",
                    status: "completed",
                  },
                ]}
              />
            </motion.div>
          )}

          {/* Test Results Tab */}
          {activeTab === "tests" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="sub-header">Test Results</h2>
                <button className="text-14-regular text-green-500 hover:underline flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download All Results
                </button>
              </div>
              <TestResults
                testResults={[
                  // Mock data - replace with real data from your backend
                  {
                    $id: "1",
                    testName: "Complete Blood Count",
                    testType: "Blood",
                    result: "Normal",
                    resultDate: new Date("2024-12-10"),
                    normalRange: "WBC: 4,500-11,000 cells/mcL",
                    notes: "All blood cell counts are within normal limits.",
                    doctorName: "Michael Lee",
                    status: "completed",
                  },
                  {
                    $id: "2",
                    testName: "Lipid Panel",
                    testType: "Blood",
                    result: "Borderline High",
                    resultDate: new Date("2024-11-28"),
                    normalRange: "Total Cholesterol: <200 mg/dL",
                    notes: "Total cholesterol: 210 mg/dL. Consider dietary modifications and follow-up in 3 months.",
                    doctorName: "Emily Davis",
                    status: "abnormal",
                  },
                  {
                    $id: "3",
                    testName: "Chest X-Ray",
                    testType: "XRay",
                    result: "Clear",
                    resultDate: new Date("2024-11-15"),
                    notes: "No abnormalities detected. Lungs are clear.",
                    doctorName: "John Green",
                    status: "completed",
                  },
                ]}
              />
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-dark-500 py-6 px-[5%]">
          <p className="text-14-regular text-dark-700 text-center">
            © 2025 CarePulse. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

