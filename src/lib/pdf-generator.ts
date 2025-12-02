import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

interface BookingData {
    booking_number: string;
    customer_name: string;
    destination_title: string;
    start_date: string;
    participants: number;
    total_price: number;
    status: string;
}

export const generateBookingPDF = async (booking: BookingData) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(63, 81, 181); // Primary Color (Indigo)
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("E-TICKET", 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Adventure Curug Mara", 105, 32, { align: "center" });

    // Booking Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Details", 14, 55);

    // Table
    autoTable(doc, {
        startY: 60,
        head: [["Item", "Details"]],
        body: [
            ["Booking Number", booking.booking_number || "PENDING"],
            ["Customer Name", booking.customer_name],
            ["Package", booking.destination_title],
            ["Date", booking.start_date],
            ["Participants", `${booking.participants} Pax`],
            ["Status", booking.status.toUpperCase()],
            ["Total Price", new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(booking.total_price)],
        ],
        theme: "grid",
        headStyles: { fillColor: [63, 81, 181] },
        styles: { fontSize: 12, cellPadding: 3 },
    });

    // Footer / QR Code
    const finalY = (doc as any).lastAutoTable.finalY || 150;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Please show this ticket upon arrival.", 105, finalY + 20, { align: "center" });
    doc.text("Scan QR Code at the entrance.", 105, finalY + 25, { align: "center" });

    // Generate QR Code
    try {
        const qrData = JSON.stringify({
            id: booking.booking_number,
            name: booking.customer_name,
            package: booking.destination_title,
            date: booking.start_date
        });

        const qrCodeUrl = await QRCode.toDataURL(qrData);

        // Add QR Code to PDF
        doc.addImage(qrCodeUrl, "PNG", 85, finalY + 35, 40, 40);
    } catch (err) {
        console.error("Error generating QR code:", err);
        // Fallback text if QR fails
        doc.text("QR Code Error", 105, finalY + 55, { align: "center" });
    }

    // Save
    doc.save(`Ticket-${booking.booking_number || "Booking"}.pdf`);
};
