import { Decimal } from "@prisma/client/runtime/library";

export const VAT_CODES = [
  { name: "VAT Standard 14%", rate: 0.14 },
  { name: "Zero-rated 0%", rate: 0 },
  { name: "Exempt", rate: 0 },
];

export const SEED_CUSTOMERS = [
  { name: "ACME Trading", email: "acme@example.com" },
  { name: "Georgetown Retailers", email: "shop@gt-retail.gy" },
  { name: "New Amsterdam Hardware", email: "nah@example.gy" },
];

export const SEED_VENDORS = [
  { name: "MMG Services", email: "vendors@mmg.gy" },
  { name: "GPL", email: "billing@gpl.gy" },
  { name: "Digicel Guyana", email: "ap@digicel.gy" },
];

export const SEED_ITEMS = [
  { name: "Standard VAT Widget", price: new Decimal(15000), tax: "VAT Standard 14%" },
  { name: "Zero-rated Export Service", price: new Decimal(30000), tax: "Zero-rated 0%" },
  { name: "Exempt Health Service", price: new Decimal(10000), tax: "Exempt" },
  { name: "Standard VAT Gadget", price: new Decimal(8500), tax: "VAT Standard 14%" },
  { name: "Standard VAT Subscription (Monthly)", price: new Decimal(5000), tax: "VAT Standard 14%" },
];

export const COA = {
  assets: [
    { code: "1000", name: "Cash at Bank" },
    { code: "1100", name: "Accounts Receivable" },
    { code: "1200", name: "Inventory" },
  ],
  liabilities: [
    { code: "2000", name: "Accounts Payable" },
    { code: "2100", name: "VAT Payable (Output-Input)" },
    { code: "2200", name: "PAYE Payable" },
    { code: "2300", name: "NIS Payable" },
  ],
  equity: [{ code: "3000", name: "Owner’s Equity" }],
  income: [
    { code: "4000", name: "Sales (Standard-rated)" },
    { code: "4010", name: "Sales (Zero-rated)" },
    { code: "4020", name: "Sales (Exempt)" },
  ],
  cogs: [{ code: "5000", name: "Cost of Goods Sold" }],
  expense: [
    { code: "6000", name: "Bank Charges" },
    { code: "6100", name: "Rent" },
    { code: "6200", name: "Utilities" },
  ],
};

export const SEED_DOCS = {
  invoices: [
    {
      number: 1001,
      customer: "ACME Trading",
      issueDate: "2025-08-01",
      dueDate: "2025-08-15",
      status: "sent",
      lines: [
        { item: "Standard VAT Widget", qty: 2 },
        { item: "Zero-rated Export Service", qty: 1 },
      ],
      partialPayment: new Decimal(15000),
    },
    {
      number: 1002,
      customer: "Georgetown Retailers",
      issueDate: "2025-08-05",
      dueDate: "2025-08-20",
      status: "draft",
      lines: [{ item: "Standard VAT Gadget", qty: 5 }],
    },
  ],
  estimates: [
    {
      number: "EST-2001",
      customer: "New Amsterdam Hardware",
      issueDate: "2025-08-10",
      expiryDate: "2025-09-10",
      status: "sent",
      lines: [{ item: "Standard VAT Subscription (Monthly)", qty: 12 }],
    },
  ],
  payments: [
    {
      ref: "PMT-9001",
      invoiceNumber: 1001,
      date: "2025-08-08",
      amount: new Decimal(15000),
      method: "Bank Transfer",
      receiptNumber: 5001,
    },
  ],
  bank: [
    { ref: "BT-7001", date: "2025-08-02", description: "Opening Balance", amount: new Decimal(500000) },
    { ref: "BT-7002", date: "2025-08-09", description: "Customer Payment - INV-1001", amount: new Decimal(15000) },
    { ref: "BT-7003", date: "2025-08-12", description: "Rent", amount: new Decimal(-80000) },
    { ref: "BT-7004", date: "2025-08-14", description: "Utilities", amount: new Decimal(-15000) },
    { ref: "BT-7005", date: "2025-08-17", description: "Bank Fee", amount: new Decimal(-500) },
  ],
};

export const PAYE_2025 = {
  effectiveFrom: "2025-01-01",
  bracketsMonthly: [
    { order: 1, upTo: "130000.00", rate: "0.0000" },
    { order: 2, upTo: "260000.00", rate: "0.2500" },
    { order: 3, upTo: null,        rate: "0.3500" },
  ],
};

export const NIS_2025 = {
  effectiveFrom: "2025-01-01",
  employeeRate: "0.0560",
  employerRate: "0.0840",
  ceilingAmount: "280000.00",
  ceilingPeriod: "monthly",
};

