"use client";
import { useState } from "react";
import SectionCard from "@/components/UX/SectionCard";
import Page from "@/components/UX/Page";
import Toast from "@/components/Toast";
import contactCopy from "@/lib/copy/contact-herobooks";

type ToastState = { type: "success" | "error"; message: string } | null;
interface Fields { name: string; email: string; [key: string]: string | undefined }

export default function ContactClient({ initialSubject }: { initialSubject: string }) {
  const initialFields: Fields = { name: "", email: "" };
  const [subject, setSubject] = useState<string>(initialSubject);
  const [fields, setFields] = useState<Fields>(initialFields);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>(null);

  const { shared } = contactCopy as any;
  const current = (contactCopy as any)[subject] || (contactCopy as any).general;

  function updateField(name: string, value: string | undefined) {
    setFields((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = { subject, ...fields };
      const r = await fetch("/api/inbox/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await r.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      setToast({ type: "success", message: current.success.detail || shared.toasts.success });
      setFields(initialFields);
    } catch (err: any) {
      setToast({ type: "error", message: err?.message || shared.toasts.error });
    } finally {
      setSubmitting(false);
    }
  }

  const SUBJECTS = [
    { value: "sales", label: "Talk to Sales" },
    { value: "support", label: "Get Support" },
    { value: "partnerships", label: "Partnerships" },
    { value: "press", label: "Press & Speaking" },
    { value: "careers", label: "Careers" },
    { value: "billing", label: "Billing" },
    { value: "general", label: "General" },
  ];

  return (
    <div>
      <Page title={current.hero.title} subtitle={current.hero.subtitle}>
        <SectionCard id="contact-form">
          {current.guidance.length > 0 && (
            <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-slate-700">{current.guidance.map((g: string, i: number) => (<li key={i}>{g}</li>))}</ul>
          )}
          <form onSubmit={onSubmit} className="grid gap-3">
            <label htmlFor="subject" className="block">
              <span className="text-sm font-medium">{shared.labels.subject}</span>
              <select
                id="subject"
                name="subject"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {SUBJECTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="name" className="block">
              <span className="text-sm font-medium">{shared.labels.name}</span>
              <input
                id="name"
                name="name"
                required
                value={fields.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            <label htmlFor="email" className="block">
              <span className="text-sm font-medium">{shared.labels.email}</span>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={fields.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
            {current.fieldsets.map((f: any) => (
              <label key={f.name} htmlFor={f.name} className="block">
                <span className="text-sm font-medium">{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea
                    id={f.name}
                    name={f.name}
                    rows={4}
                    required={f.required}
                    value={fields[f.name] || ""}
                    onChange={(e) => updateField(f.name, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                ) : (
                  <input
                    id={f.name}
                    name={f.name}
                    type="text"
                    required={f.required}
                    value={fields[f.name] || ""}
                    onChange={(e) => updateField(f.name, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                )}
              </label>
            ))}
            <button type="submit" disabled={submitting} className="mt-2 rounded-xl bg-black px-4 py-2 font-semibold text-white disabled:opacity-60">{submitting ? shared.actions.sending : shared.actions.send}</button>
          </form>
          <p className="mt-2 text-xs text-slate-500">{current.meta.privacyShort} <a href="/legal" className="underline">{shared.tips.privacyLink}</a></p>
        </SectionCard>
      </Page>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </div>
  );
}

