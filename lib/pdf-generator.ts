import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AppointmentData {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: string;
  note?: string;
  appointmentId: string;
}

export const generateAppointmentPDF = (appointment: AppointmentData) => {
  const doc = new jsPDF();

  // Colors
  const primaryColor = [36, 174, 124]; // Green
  const darkColor = [13, 15, 16]; // Dark background
  const lightColor = [238, 238, 238]; // Light text

  // Header with logo text
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("MediCore", 20, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Healthcare Management System", 20, 28);

  // Document title
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Appointment Details", 20, 55);

  // Appointment ID and Status
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Appointment ID: ${appointment.appointmentId}`, 20, 65);

  // Status badge
  let statusColor: number[];
  switch (appointment.status.toLowerCase()) {
    case "scheduled":
      statusColor = [34, 197, 94]; // Green
      break;
    case "pending":
      statusColor = [59, 130, 246]; // Blue
      break;
    case "cancelled":
      statusColor = [239, 68, 68]; // Red
      break;
    default:
      statusColor = [156, 163, 175]; // Gray
  }

  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(150, 60, 40, 8, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(
    appointment.status.toUpperCase(),
    170,
    65.5,
    { align: "center" }
  );

  // Patient Information Section
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 20, 80);

  autoTable(doc, {
    startY: 85,
    head: [["Field", "Details"]],
    body: [
      ["Name", appointment.patientName],
      ["Email", appointment.patientEmail],
      ["Phone", appointment.patientPhone],
    ],
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 120 },
    },
    margin: { left: 20, right: 20 },
  });

  // Appointment Details Section
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Appointment Details", 20, finalY + 15);

  autoTable(doc, {
    startY: finalY + 20,
    head: [["Field", "Details"]],
    body: [
      ["Doctor", `Dr. ${appointment.doctorName}`],
      ["Date", appointment.appointmentDate],
      ["Time", appointment.appointmentTime],
      ["Reason", appointment.reason],
      ...(appointment.note ? [["Additional Notes", appointment.note]] : []),
    ],
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    bodyStyles: {
      fontSize: 10,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 120 },
    },
    margin: { left: 20, right: 20 },
  });

  // Important Information Box
  const finalY2 = (doc as any).lastAutoTable.finalY || 180;
  doc.setFillColor(59, 130, 246);
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(20, finalY2 + 15, 170, 30, 3, 3, "FD");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("📋 Important Information", 25, finalY2 + 23);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const infoLines = [
    "• Please arrive 10 minutes before your appointment time",
    "• Bring your ID proof and previous medical records",
    "• Contact us if you need to reschedule or cancel",
  ];

  infoLines.forEach((line, index) => {
    doc.text(line, 25, finalY2 + 30 + index * 5);
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, pageHeight - 20, 210, 20, "F");

  doc.setTextColor(lightColor[0], lightColor[1], lightColor[2]);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "© 2025 MediCore Healthcare Management System",
    105,
    pageHeight - 12,
    { align: "center" }
  );
  doc.text("www.carepulse.com | support@carepulse.com", 105, pageHeight - 7, {
    align: "center",
  });

  // Generate filename
  const filename = `appointment_${appointment.appointmentId}_${new Date()
    .toISOString()
    .split("T")[0]}.pdf`;

  // Save PDF
  doc.save(filename);
};

export const generateAllAppointmentsPDF = (
  appointments: AppointmentData[],
  patientName: string
) => {
  const doc = new jsPDF();

  // Colors
  const primaryColor = [36, 174, 124]; // Green
  const darkColor = [13, 15, 16];

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("MediCore", 20, 18);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Appointment History Report", 20, 26);

  // Patient name and date
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Patient: ${patientName}`, 20, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `Report Generated: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    20,
    57
  );

  // Summary stats
  const scheduled = appointments.filter((a) => a.status === "scheduled").length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  doc.setFontSize(10);
  doc.text(`Total Appointments: ${appointments.length}`, 20, 67);
  doc.setTextColor(34, 197, 94);
  doc.text(`Scheduled: ${scheduled}`, 75, 67);
  doc.setTextColor(59, 130, 246);
  doc.text(`Pending: ${pending}`, 115, 67);
  doc.setTextColor(239, 68, 68);
  doc.text(`Cancelled: ${cancelled}`, 150, 67);

  // Appointments table
  const tableData = appointments.map((apt) => [
    apt.appointmentDate,
    `Dr. ${apt.doctorName}`,
    apt.reason,
    apt.status.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: 75,
    head: [["Date", "Doctor", "Reason", "Status"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 50 },
      2: { cellWidth: 60 },
      3: { cellWidth: 30, halign: "center" },
    },
    margin: { left: 20, right: 20 },
    didParseCell: function (data: any) {
      if (data.column.index === 3 && data.section === "body") {
        const status = data.cell.text[0].toLowerCase();
        if (status.includes("scheduled")) {
          data.cell.styles.textColor = [34, 197, 94];
          data.cell.styles.fontStyle = "bold";
        } else if (status.includes("pending")) {
          data.cell.styles.textColor = [59, 130, 246];
          data.cell.styles.fontStyle = "bold";
        } else if (status.includes("cancelled")) {
          data.cell.styles.textColor = [239, 68, 68];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, pageHeight - 15, 210, 15, "F");

  doc.setTextColor(238, 238, 238);
  doc.setFontSize(9);
  doc.text("© 2025 MediCore", 105, pageHeight - 7, { align: "center" });

  // Generate filename
  const filename = `appointment_history_${patientName
    .replace(/\s+/g, "_")
    .toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`;

  // Save PDF
  doc.save(filename);
};

