"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import OrgSwitcherClient from "./OrgSwitcherClient";

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="rounded-full focus:outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/default.png" alt="User" />
          <AvatarFallback>HB</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Choose org (inline switcher) */}
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Choose organization
        </div>
        <div className="px-2 pb-2">
          <OrgSwitcherClient
            onSwitched={() => {
              setOpen(false);
            }}
          />
        </div>
        {/* Divider */}
        <div className="h-px bg-muted mx-2 my-1" />
        {/* Logout */}
        <DropdownMenuItem
          onClick={async () => {
            await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});
            router.push("/sign-in");
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

