export const metadata = { title: "Forgot Password — heroBooks" };

export default function ForgotPasswordPage() {
  return (
    <section className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-2xl font-semibold">Forgot your password?</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Enter your email and we’ll send you a reset link.
      </p>
      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget as HTMLFormElement);
          const email = String(f.get("email") || "");
          const res = await fetch("/api/auth/password/reset/request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          if (res.ok) alert("If that email exists, we sent a reset link.");
          else alert("Please try again in a moment.");
        }}
      >
        <div className="grid gap-2">
          <label className="text-sm">Email</label>
          <input
            name="email"
            type="email"
            required
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium">
          Send reset link
        </button>
        <p className="text-xs text-muted-foreground">We’ll email a link that expires in 30 minutes.</p>
      </form>
    </section>
  );
}
