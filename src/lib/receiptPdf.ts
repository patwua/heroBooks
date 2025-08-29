import PDFDocument from "pdfkit";
import { fmtMoney, fmtDate } from "@/lib/format";

interface PaymentLike {
  receiptNumber: number;
  date: Date | string;
  invoice?: { number: number };
  amount: number;
  method: string;
}

export async function receiptPdf(payment: PaymentLike, logo?: Buffer) {
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Buffer[] = [];
  doc.on("data", (d) => buffers.push(d));

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    if (logo) {
      doc.image(logo, 50, 45, { width: 100 });
    }
    doc.fontSize(20).text(`Receipt #${payment.receiptNumber}`, 50, 45, { align: "right" });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${fmtDate(payment.date)}`, { align: "right" });
    doc.moveDown();

    if (payment.invoice) {
      doc.text(`Invoice #${payment.invoice.number}`);
    }
    doc.text(`Amount: ${fmtMoney(payment.amount)}`);
    doc.text(`Method: ${payment.method}`);

    doc.moveDown();
    doc.text("Thank you for your payment!", { align: "center" });

    doc.end();
  });
}
