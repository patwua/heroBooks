import Link from "next/link";

export default function HomePage() {
  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold">Welcome to heroBooks</h1>
      <p className="mt-2">Simple accounting for growing businesses.</p>
      <div className="mt-4 space-x-2">
        <Link href="/sign-up" className="rounded bg-blue-600 px-4 py-2 text-white">
          Get Started
        </Link>
        <Link href="/pricing" className="rounded border px-4 py-2">
          View Pricing
        </Link>
      </div>
    </section>
  );
}
