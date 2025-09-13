"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { pb } from "@/lib/pb";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null);
    try { await pb.collection("users").authWithPassword(email, password); r.push("/dashboard"); }
    catch { setErr("Login fehlgeschlagen"); }
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 p-6 rounded-2xl border">
        <h1 className="text-2xl font-semibold">Anmelden</h1>
        <input className="w-full border p-2 rounded" type="email" placeholder="E-Mail"
               value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Passwort"
               value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button className="w-full border p-2 rounded hover:bg-black hover:text-white">Login</button>
      </form>
    </main>
  );
}

