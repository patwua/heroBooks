import PDFDocument from "pdfkit";
import { fmtMoney, fmtDate } from "@/lib/format";

interface InvoiceLike {
  number: number;
  issueDate?: string | Date;
  customer?: { name: string; email?: string };
  items: Array<{ description: string; quantity: number; unitPrice: number; lineTotal: number }>;
}

export async function invoicePdf(invoice: InvoiceLike, logo?: Buffer) {
  const doc = new PDFDocument({ margin: 50 });
  const buffers: Buffer[] = [];
  doc.on("data", (d) => buffers.push(d));

  return new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    if (logo) {
      doc.image(logo, 50, 45, { width: 100 });
    }
    doc.fontSize(20).text(`Invoice #${invoice.number}`, 50, 45, { align: "right" });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${fmtDate(invoice.issueDate || new Date())}`, { align: "right" });

    doc.moveDown();
    if (invoice.customer) {
      doc.text(`Bill To: ${invoice.customer.name}`);
      if (invoice.customer.email) doc.text(invoice.customer.email);
    }

    doc.moveDown();
    doc.text("Items", { underline: true });

    let subtotal = 0;
    let vatTotal = 0;

    invoice.items.forEach((item) => {
      const line = item.quantity * item.unitPrice;
      subtotal += line;
      vatTotal += item.lineTotal - line;
      doc.text(
        `${item.description} - ${item.quantity} x ${fmtMoney(item.unitPrice)} = ${fmtMoney(item.lineTotal)}`
      );
    });

    doc.moveDown();
    doc.text(`Subtotal: ${fmtMoney(subtotal)}`);
    doc.text(`VAT: ${fmtMoney(vatTotal)}`);
    doc.text(`Total: ${fmtMoney(subtotal + vatTotal)}`);

    doc.moveDown();
    doc.text("Thank you for your business!", { align: "center" });

    doc.end();
  });
}
