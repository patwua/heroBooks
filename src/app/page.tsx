import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Welcome to heroBooks</h1>
      <p className="text-lg text-gray-600">Simple accounting for growing businesses.</p>
      <div className="flex gap-4">
        <Link href="/sign-up" className="rounded bg-blue-600 px-4 py-2 text-white">Get Started</Link>
        <Link href="/sign-in" className="rounded border px-4 py-2">Sign In</Link>
      </div>
    </section>
  );
}
