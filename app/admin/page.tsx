"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Doctors } from "@/constants";

const AdminPage = () => {
  const [appointments, setAppointments] = useState<any>({ documents: [], scheduledCount: 0, pendingCount: 0, cancelledCount: 0 });
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
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
          <p className="text-light-200">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/admin/availability"
            className="text-14-medium text-dark-700 hover:text-light-200 transition-colors"
          >
            📅 Availability
          </Link>
          <p className="text-16-semibold">Admin Dashboard</p>
        </div>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={appointments.scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={appointments.pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={appointments.cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        {/* Search & Filter Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-24-bold text-light-200">
              Search & Filter
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={clearFilters}
                variant="outline"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Filters
              </Button>
              <Button
                onClick={exportToCSV}
                disabled={filteredAppointments.length === 0}
                className="shad-primary-btn flex items-center gap-2"
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
                Export CSV ({filteredAppointments.length})
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-dark-500 bg-dark-400 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search Input */}
              <div>
                <label className="text-14-medium text-light-200 mb-2 block">
                  🔍 Search Patient
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
                <label className="text-14-medium text-light-200 mb-2 block">
                  👨‍⚕️ Doctor
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
                <label className="text-14-medium text-light-200 mb-2 block">
                  📊 Status
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
                <label className="text-14-medium text-light-200 mb-2 block">
                  📅 From Date
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
                <label className="text-14-medium text-light-200 mb-2 block">
                  📅 To Date
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
                <div className="w-full rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                  <p className="text-12-medium text-green-400">Results</p>
                  <p className="text-24-bold text-light-200">
                    {filteredAppointments.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <DataTable columns={columns} data={filteredAppointments} />
      </main>
    </div>
  );
};

export default AdminPage;
