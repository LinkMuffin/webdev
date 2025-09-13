"use client";
import { useEffect, useState } from "react";

export default function PBTest() {
  const [msg, setMsg] = useState("checking…");

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_PB_URL + "/api/health")
      .then(r => r.json())
      .then(j => setMsg("OK: " + JSON.stringify(j)))
      .catch(e => setMsg("ERROR: " + String(e)));
  }, []);

  return (
    <main style={{padding:20}}>
      <h1>PB Health</h1>
      <p>{msg}</p>
    </main>
  );
}

