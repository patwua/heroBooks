import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/topbar/ThemeToggle";
import NotificationsBell from "@/components/topbar/NotificationsBell";
import UserMenu from "@/components/topbar/UserMenu";
import React from "react";

export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Back">
            ←
          </Link>
          <Link href="/">
            <Image src="/logo.svg" alt="heroBooks" width={100} height={24} />
          </Link>
        </div>
        <input
          type="search"
          placeholder="Search KB"
          className="border rounded px-2 py-1 w-1/3"
        />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationsBell />
          <UserMenu />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 border-r overflow-y-auto p-4">Contents</aside>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
        <aside className="w-60 border-l overflow-y-auto p-4">Right rail</aside>
      </div>
    </div>
  );
}
