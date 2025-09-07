export type ContactFieldset = { name: string; label: string; type: "text" | "textarea"; required?: boolean };
export interface ContactSubject {
  hero: { title: string; subtitle: string };
  guidance: string[];
  success: { detail: string };
  meta: { privacyShort: string };
  fieldsets: ContactFieldset[];
}

export const contactCopy = {
  shared: {
    labels: { subject: "Subject", name: "Your name", email: "Email" },
    actions: { send: "Send", sending: "Sending…" },
    toasts: { success: "Thank you — submitted.", error: "Something went wrong." },
    tips: { privacyLink: "Privacy Policy" },
  },
  sales: {
    hero: { title: "Talk to Sales", subtitle: "Licensing, pricing, demos." },
    guidance: ["Tell us about your business and your timeline."],
    success: { detail: "Thanks — we’ll reach out shortly." },
    meta: { privacyShort: "We only use your info to respond to this inquiry." },
    fieldsets: [
      { name: "company", label: "Company", type: "text" },
      { name: "message", label: "What do you need?", type: "textarea", required: true },
    ],
  },
  support: {
    hero: { title: "Get Support", subtitle: "We’re here to help." },
    guidance: ["Include steps to reproduce if it’s a bug."],
    success: { detail: "Support request received." },
    meta: { privacyShort: "We only use your info to reply." },
    fieldsets: [
      { name: "subjectLine", label: "Subject", type: "text", required: true },
      { name: "message", label: "Describe the issue", type: "textarea", required: true },
    ],
  },
  partnerships: {
    hero: { title: "Partnerships", subtitle: "Banks, POS, and integrators." },
    guidance: [],
    success: { detail: "Thanks — we’ll follow up soon." },
    meta: { privacyShort: "We only use your info for partnership discussions." },
    fieldsets: [
      { name: "org", label: "Organization", type: "text" },
      { name: "message", label: "How can we partner?", type: "textarea", required: true },
    ],
  },
  press: {
    hero: { title: "Press & Speaking", subtitle: "Media inquiries." },
    guidance: [],
    success: { detail: "Thanks — our team will respond." },
    meta: { privacyShort: "We only use your info to respond to press inquiries." },
    fieldsets: [
      { name: "outlet", label: "Outlet", type: "text" },
      { name: "message", label: "How can we help?", type: "textarea", required: true },
    ],
  },
  careers: {
    hero: { title: "Careers", subtitle: "Join the team." },
    guidance: [],
    success: { detail: "Thanks — we’ll be in touch." },
    meta: { privacyShort: "We use your info only for recruiting." },
    fieldsets: [
      { name: "role", label: "Role of interest", type: "text" },
      { name: "message", label: "Tell us about yourself", type: "textarea", required: true },
    ],
  },
  billing: {
    hero: { title: "Billing", subtitle: "Invoices and payments." },
    guidance: [],
    success: { detail: "Thanks — we’ll reply shortly." },
    meta: { privacyShort: "We only use your info to reply." },
    fieldsets: [
      { name: "accountId", label: "Account ID (if any)", type: "text" },
      { name: "message", label: "What do you need?", type: "textarea", required: true },
    ],
  },
  general: {
    hero: { title: "Contact heroBooks", subtitle: "We read every message." },
    guidance: [],
    success: { detail: "Thanks — message received." },
    meta: { privacyShort: "We only use your info to reply." },
    fieldsets: [
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
  },
} as const;

export type ContactCopy = typeof contactCopy;
export default contactCopy;

