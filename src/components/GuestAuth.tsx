"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Guest = { id: string; name: string; email?: string };

export default function GuestAuth() {
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("guestUser");
      if (raw) setGuest(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  const loginGuest = () => {
    const id = `guest-${Date.now()}`;
    const g: Guest = { id, name: "ゲスト", email: "guest@example.com" };
    localStorage.setItem("guestUser", JSON.stringify(g));
    setGuest(g);
    // reload to ensure any client pages pick up guest state
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("guestUser");
    setGuest(null);
    window.location.reload();
  };

  if (guest) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-sm text-zinc-700">{guest.name}</div>
        <button onClick={logout} className="text-sm rounded-md border px-3 py-1">ログアウト</button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/api/auth/login" className="text-sm hidden sm:inline-block rounded-md border px-3 py-1">ログイン</Link>
      <button onClick={loginGuest} className="text-sm rounded-md bg-foreground text-background px-3 py-1">ゲストでログイン</button>
    </div>
  );
}
