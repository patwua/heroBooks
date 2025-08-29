"use client";
import { signOut } from "next-auth/react";

export function Topbar() {
  return (
    <header className="flex justify-end border-b p-4">
      <button onClick={() => signOut()}>Sign out</button>
    </header>
  );
}
