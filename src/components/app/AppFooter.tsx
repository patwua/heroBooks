import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t p-4 text-xs text-muted-foreground">
      <div className="container mx-auto flex flex-wrap gap-4">
        <Link
          href="/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Privacy
        </Link>
        <Link
          href="/legal/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Terms
        </Link>
        <Link
          href="/help"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Help
        </Link>
      </div>
    </footer>
  );
}
