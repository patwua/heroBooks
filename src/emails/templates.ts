import { fmtMoney, fmtDate } from "@/lib/format";

export function invoiceTemplate(invoice: {
  number: number;
  issueDate?: string | Date;
  total: number;
}) {
  return `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px">Invoice #${invoice.number}</mj-text>
            <mj-text>Date: ${fmtDate(invoice.issueDate || new Date())}</mj-text>
            <mj-text>Total: ${fmtMoney(invoice.total)}</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;
}

export function receiptTemplate(payment: {
  receiptNumber: number;
  date: string | Date;
  amount: number;
}) {
  return `
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            <mj-text font-size="20px">Receipt #${payment.receiptNumber}</mj-text>
            <mj-text>Date: ${fmtDate(payment.date)}</mj-text>
            <mj-text>Amount: ${fmtMoney(payment.amount)}</mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `;
}
