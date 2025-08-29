"use client";
import { useState } from "react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const router=useRouter();
  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 p-6 bg-slate-900/40">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <form className="mt-6 space-y-3" onSubmit={async(e)=>{e.preventDefault();
          const r = await fetch("/api/register",{method:"POST", body: JSON.stringify({name,email,password})});
          if(r.ok) router.push("/sign-in");
        }}>
          <Input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Button className="w-full" type="submit">Create account</Button>
        </form>
      </div>
    </main>
  );
}
