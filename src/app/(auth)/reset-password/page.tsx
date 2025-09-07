export const metadata = { title: "Reset Password — heroBooks" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const token =
    (Array.isArray(params?.token) ? params.token[0] : params?.token) ?? "";

  return (
    <section className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-2xl font-semibold">Set a new password</h1>
      <form
        className="mt-6 space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget as HTMLFormElement);
          const password = String(f.get("password") || "");
          const confirm = String(f.get("confirm") || "");
          if (password.length < 8)
            return alert("Password must be at least 8 characters.");
          if (password !== confirm)
            return alert("Passwords do not match.");

          const res = await fetch("/api/auth/password/reset/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
          });
          if (res.ok) window.location.href = "/sign-in?reset=1";
          else {
            const j = await res.json().catch(() => ({}));
            alert(j?.error ?? "Reset failed. Try requesting a new link.");
          }
        }}
      >
        <input type="hidden" name="token" value={token} />
        <div className="grid gap-2">
          <label className="text-sm">New password</label>
          <input
            name="password"
            type="password"
            required
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-2">
          <label className="text-sm">Confirm password</label>
          <input
            name="confirm"
            type="password"
            required
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <button className="w-full rounded-md bg-primary text-primary-foreground py-2 text-sm font-medium">
          Update password
        </button>
      </form>
    </section>
  );
}
