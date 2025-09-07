import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
