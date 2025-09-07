export const metadata = { title: "Talk to us — heroBooks" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Talk to us</h1>
      <p className="mt-4 text-muted-foreground">Email: support@herobooks.app</p>
      <form className="mt-8 grid gap-4">
        <input className="w-full rounded-lg border p-3" placeholder="Your name" />
        <input className="w-full rounded-lg border p-3" placeholder="Email" />
        <textarea className="min-h-[120px] w-full rounded-lg border p-3" placeholder="Message" />
        <button className="w-fit rounded-lg bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700">Send</button>
      </form>
    </div>
  );
}
