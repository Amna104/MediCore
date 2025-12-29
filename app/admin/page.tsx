"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Doctors } from "@/constants";

const AdminPage = () => {
  const [appointments, setAppointments] = useState<any>({ 
    documents: [], 
    scheduledCount: 0, 
    pendingCount: 0, 
    cancelledCount: 0 
  });
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, searchTerm, selectedDoctor, selectedStatus, startDate, endDate]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments/all");
      const data = await response.json();
      setAppointments(data);
      setFilteredAppointments(data.documents);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...appointments.documents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (apt: any) =>
          apt.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.patient?.phone?.includes(searchTerm)
      );
    }

    // Doctor filter
    if (selectedDoctor !== "all") {
      filtered = filtered.filter((apt: any) => apt.primaryPhysician === selectedDoctor);
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter((apt: any) => apt.status === selectedStatus);
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(
        (apt: any) => new Date(apt.schedule) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (apt: any) => new Date(apt.schedule) <= new Date(endDate)
      );
    }

    setFilteredAppointments(filtered);
  };

  const exportToCSV = () => {
    const csvData = filteredAppointments.map((apt: any) => ({
      "Patient Name": apt.patient?.name || "N/A",
      "Email": apt.patient?.email || "N/A",
      "Phone": apt.patient?.phone || "N/A",
      "Doctor": apt.primaryPhysician,
      "Date": new Date(apt.schedule).toLocaleDateString(),
      "Time": new Date(apt.schedule).toLocaleTimeString(),
      "Status": apt.status,
      "Reason": apt.reason,
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(","),
      ...csvData.map((row: any) =>
        headers.map((header) => `"${row[header]}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDoctor("all");
    setSelectedStatus("all");
    setStartDate("");
    setEndDate("");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-200">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-lg font-medium text-light-200">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-200">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 border-b border-dark-500 bg-dark-300/95 backdrop-blur-xl shadow-lg">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="cursor-pointer group">
              <h1 className="text-3xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-green-300 group-hover:via-green-400 group-hover:to-emerald-400">
                  Medi
                </span>
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-300 group-hover:via-blue-400 group-hover:to-cyan-400">
                  Core
                </span>
              </h1>
            </Link>
            <div className="hidden items-center gap-2 rounded-full bg-green-500/10 px-4 py-1.5 md:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-500">Admin Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/availability"
              className="flex items-center gap-2 rounded-lg border border-dark-500 bg-dark-400/50 px-4 py-2 text-sm font-medium text-light-200 transition-all hover:border-green-500 hover:bg-dark-400"
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Manage Availability
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg bg-dark-400/50 px-4 py-2 text-sm font-medium text-light-200 transition-all hover:bg-dark-400"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-8 py-8">
        {/* Welcome Section */}
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold text-white">
                Welcome back, Administrator
              </h1>
              <p className="text-lg text-dark-700">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="hidden items-center gap-2 rounded-xl border border-dark-500 bg-dark-400/50 px-6 py-3 backdrop-blur-sm md:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                <svg
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-light-200">
                  Total Appointments
                </p>
                <p className="text-2xl font-bold text-white">
                  {appointments.documents.length}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stats Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-6 md:grid-cols-3"
        >
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled Appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending Approvals"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled Appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </motion.section>

        {/* Search & Filter Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Appointment Management</h2>
              <p className="mt-1 text-sm text-dark-700">
                Search, filter, and manage all appointments
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="flex items-center gap-2 rounded-lg border-dark-500 bg-dark-400/50 px-4 py-2 text-sm font-medium text-light-200 transition-all hover:border-green-500 hover:bg-dark-400"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Filters
              </Button>
              <Button
                onClick={exportToCSV}
                disabled={filteredAppointments.length === 0}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                Export to CSV
                {filteredAppointments.length > 0 && (
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {filteredAppointments.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-dark-500 bg-dark-400/50 p-6 backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Search Input */}
              <div>
                <label className="mb-2 block text-sm font-medium text-light-200">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Search Patient
                  </div>
                </label>
                <Input
                  type="text"
                  placeholder="Name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="shad-input"
                />
              </div>

              {/* Doctor Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-light-200">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Filter by Doctor
                  </div>
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="shad-select"
                >
                  <option value="all">All Doctors</option>
                  {Doctors.map((doctor) => (
                    <option key={doctor.name} value={doctor.name}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="mb-2 block text-sm font-medium text-light-200">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Filter by Status
                  </div>
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="shad-select"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-light-200">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    From Date
                  </div>
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="shad-input"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-light-200">
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    To Date
                  </div>
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="shad-input"
                />
              </div>

              {/* Results Count */}
              <div className="flex items-end">
                <div className="w-full rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5 p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                    <p className="text-sm font-medium text-green-400">Filtered Results</p>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {filteredAppointments.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Data Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataTable columns={columns} data={filteredAppointments} />
        </motion.section>
      </main>
    </div>
  );
};

export default AdminPage;
