"use client";

import { useState } from "react";
import Link from "next/link";
import { SERVICES } from "@/data/services";

type Booking = {
  id: string;
  serviceId: string;
  scheduledAt: string;
  status?: string;
  user?: { name?: string; email?: string };
  payment?: { paid?: boolean; amountCents?: number };
};

function loadBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const records = JSON.parse(localStorage.getItem("local_bookings") || "[]") as Booking[];
    return records.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  } catch {
    return [];
  }
}

export default function MyBookings() {
  const [bookings, setBookings] = useState(loadBookings);

  const cancel = (id: string) => {
    if (!window.confirm("この予約を取り消しますか？")) return;
    const updated = bookings.map((booking) => booking.id === id ? { ...booking, status: "CANCELLED" } : booking);
    localStorage.setItem("local_bookings", JSON.stringify(updated));
    setBookings(updated);
  };

  const activeBookings = bookings.filter((booking) => booking.status !== "CANCELLED");

  if (activeBookings.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-stone-200">
        <p className="text-lg font-semibold">予約はまだありません</p>
        <p className="mt-2 text-sm text-stone-600">メニューから希望の施術と日時を選択できます。</p>
        <Link href="/services" className="mt-5 inline-block rounded-lg bg-stone-900 px-5 py-3 text-sm font-medium text-white">メニューを見る</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activeBookings.map((booking) => {
        const service = SERVICES.find((item) => item.id === booking.serviceId);
        return (
          <article key={booking.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-amber-800">PENDING RESERVATION</p>
              <h2 className="mt-2 text-xl font-semibold">{service?.name || "ご予約メニュー"}</h2>
              <p className="mt-2 text-stone-600">{new Date(booking.scheduledAt).toLocaleString("ja-JP", { dateStyle: "full", timeStyle: "short" })}</p>
              <p className="mt-1 text-sm text-stone-500">予約番号：{booking.id}</p>
              <p className="mt-3 text-sm font-medium text-stone-800">請求額：¥{Math.round((booking.payment?.amountCents ?? service?.priceCents ?? 0) / 100).toLocaleString()} <span className={booking.payment?.paid ? "ml-2 text-emerald-700" : "ml-2 text-amber-800"}>{booking.payment?.paid ? "お支払い済み" : "入金待ち"}</span></p>
            </div>
            <button type="button" onClick={() => cancel(booking.id)} className="mt-4 rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 transition hover:border-red-700 hover:text-red-700 sm:mt-0">予約を取り消す</button>
          </article>
        );
      })}
    </div>
  );
}
