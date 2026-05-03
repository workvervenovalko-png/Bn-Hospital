import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePrescriptionPDF = (data: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(36, 174, 124); // Brand Primary
  doc.text("BN HOSPITAL ENTERPRISE", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Quality Care, Personalized Excellence", 105, 27, { align: "center" });
  doc.line(20, 35, 190, 35);

  // Patient & Doctor Info
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT INFORMATION", 20, 45);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${data.patient.name}`, 20, 52);
  doc.text(`ID: ${data.patient.patientId}`, 20, 59);
  doc.text(`Age/Gender: ${data.patient.age} / ${data.patient.gender}`, 20, 66);

  doc.setFont("helvetica", "bold");
  doc.text("DOCTOR INFORMATION", 120, 45);
  doc.setFont("helvetica", "normal");
  doc.text(`Dr. ${data.doctor.user.name}`, 120, 52);
  doc.text(`${data.doctor.specialization}`, 120, 59);
  doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 120, 66);

  doc.line(20, 75, 190, 75);

  // Diagnosis
  doc.setFont("helvetica", "bold");
  doc.text("DIAGNOSIS:", 20, 85);
  doc.setFont("helvetica", "normal");
  doc.text(data.diagnosis, 20, 92, { maxWidth: 170 });

  // Medicines Table
  const tableData = data.medicines.map((m: any) => [m.name, m.dosage, m.duration]);
  autoTable(doc, {
    startY: 105,
    head: [["Medicine", "Dosage", "Duration"]],
    body: tableData,
    headStyles: { fillColor: [36, 174, 124] },
    margin: { left: 20, right: 20 }
  });

  // Lab Tests
  if (data.testsRecommended) {
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text("RECOMMENDED TESTS:", 20, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(data.testsRecommended, 20, finalY + 7);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("This is a computer-generated prescription. Valid without physical signature.", 105, pageHeight - 15, { align: "center" });

  doc.save(`Prescription_${data.patient.patientId}_${Date.now()}.pdf`);
};

export const generateInvoicePDF = (data: any) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(33, 115, 235); // Blue
  doc.text("TAX INVOICE", 105, 20, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("BN Hospital Enterprise - Financial Services", 105, 27, { align: "center" });
  doc.line(20, 35, 190, 35);

  // Billing Details
  doc.setTextColor(0);
  doc.setFontSize(10);
  doc.text(`Invoice ID: ${data.invoiceId}`, 20, 45);
  doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString()}`, 20, 50);
  doc.text(`Status: ${data.status}`, 20, 55);

  doc.setFont("helvetica", "bold");
  doc.text("BILL TO:", 140, 45);
  doc.setFont("helvetica", "normal");
  doc.text(data.patient.name, 140, 50);
  doc.text(data.patient.patientId, 140, 55);

  // Items Table
  const items = Object.entries(data.items).map(([key, val]) => [key.toUpperCase(), `Rs. ${val}`]);
  autoTable(doc, {
    startY: 65,
    head: [["Description", "Amount"]],
    body: items,
    foot: [["TOTAL AMOUNT", `Rs. ${data.amount}`]],
    headStyles: { fillColor: [33, 115, 235] },
    margin: { left: 20, right: 20 }
  });

  doc.save(`Invoice_${data.invoiceId}.pdf`);
};
