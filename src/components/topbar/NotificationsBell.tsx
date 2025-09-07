"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationsBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full p-2 hover:bg-muted focus:outline-none"
        aria-label="Notifications (billing & system)"
      >
        <Bell className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 text-sm">
        <div className="px-2 py-1 text-muted-foreground">
          No billing or system notices.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
