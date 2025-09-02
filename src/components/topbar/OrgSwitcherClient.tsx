"use client";

import { useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

type Option = { id: string; name: string; logoUrl: string | null };
export default function OrgSwitcherClient({ orgs }: { orgs: Option[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={pending}>
          {pending ? "Switching..." : "Organization"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {orgs.map((o) => (
          <DropdownMenuItem
            key={o.id}
            onClick={() =>
              start(async () => {
                await fetch("/api/org/switch", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orgId: o.id }),
                });
                router.refresh();
              })
            }
            className="flex items-center gap-2"
          >
            {o.logoUrl ? (
              <Image src={o.logoUrl} alt={o.name} width={18} height={18} className="rounded" />
            ) : (
              <div className="h-4 w-4 rounded bg-muted" />
            )}
            <span>{o.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
