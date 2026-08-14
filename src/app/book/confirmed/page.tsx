"use client";
import { useState } from "react";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import InvoiceCard from "@/components/InvoiceCard";

type LocalBooking = {
  id: string;
  serviceId: string;
  scheduledAt: string;
  createdAt?: string;
  user?: { name?: string; email?: string };
  payment?: { amountCents?: number; paid?: boolean };
};

export default function ConfirmedPage() {
  const [confirmation] = useState(() => {
    if (typeof window === "undefined") return { bookingId: null as string | null, booking: null as LocalBooking | null };
    const bookingId = new URLSearchParams(window.location.search).get("bookingId");
    if (!bookingId) return { bookingId, booking: null };
    try {
      const existing = JSON.parse(localStorage.getItem("local_bookings") || "[]") as LocalBooking[];
      return { bookingId, booking: existing.find((booking) => booking.id === bookingId) || null };
    } catch {
      return { bookingId, booking: null };
    }
  });
  const bookingId = confirmation.bookingId;
  const localBooking = confirmation.booking;

  const service = localBooking ? SERVICES.find((s) => s.id === localBooking.serviceId) : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">ご予約が完了しました</h2>
          <p className="text-zinc-600 mb-4">以下の情報で予約を受け付けました。銀行振込にてお支払いください。入金確認後、予約を確定します。</p>

          <div className="border rounded p-4 mb-4">
            <div className="text-sm text-zinc-700 mb-2">予約ID</div>
            <div className="font-mono bg-zinc-100 p-2 rounded">{bookingId ?? "（URLパラメータがありません）"}</div>
          </div>

          {localBooking && (
            <div className="border rounded p-4 mb-4">
              <div className="text-sm text-zinc-700 mb-2">予約内容</div>
              <div className="mb-1">サービス: {service?.name || localBooking.serviceId}</div>
              <div className="mb-1">日時: {new Date(localBooking.scheduledAt).toLocaleString()}</div>
              <div className="mb-1">お支払い: ¥{Math.round((localBooking.payment?.amountCents || 0) / 100).toLocaleString()}</div>
            </div>
          )}
          {localBooking && <div className="mb-4"><InvoiceCard booking={localBooking} /></div>}

          <div className="flex gap-3">
            <Link href="/" className="rounded-md border px-5 py-2">ホームへ戻る</Link>
            <Link href="/bookings" className="rounded-md bg-stone-900 px-5 py-2 text-white">予約を確認する</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
