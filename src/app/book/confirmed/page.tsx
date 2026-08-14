"use client";
import { useEffect, useState } from "react";
import { SERVICES } from "@/data/services";

export default function ConfirmedPage() {
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [localBooking, setLocalBooking] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("bookingId");
    setBookingId(id);

    if (id && id.startsWith("local-")) {
      try {
        const key = 'local_bookings';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const found = existing.find((b: any) => b.id === id) || null;
        setLocalBooking(found);
      } catch (err) {
        console.error('Failed to read local booking', err);
      }
    }
  }, []);

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
              <div className="text-sm text-zinc-700 mb-2">予約内容（ローカル保存）</div>
              <div className="mb-1">サービス: {service?.name || localBooking.serviceId}</div>
              <div className="mb-1">日時: {new Date(localBooking.scheduledAt).toLocaleString()}</div>
              <div className="mb-1">お支払い: ¥{Math.round((localBooking.payment?.amountCents || 0) / 100).toLocaleString()}</div>
            </div>
          )}

          <div className="border rounded p-4 mb-4">
            <div className="text-sm text-zinc-700 mb-2">振込先</div>
            <div className="mb-1">銀行名: {process.env.NEXT_PUBLIC_BANK_NAME || "Sample Bank"}</div>
            <div className="mb-1">口座名義: {process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "Salon Sample"}</div>
            <div className="mb-1">口座番号: {process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "000-0000-000"}</div>
            <div className="text-sm text-zinc-500 mt-2">振込の際、振込人名に予約IDを入れてください。</div>
          </div>

          <div className="flex gap-3">
            <a href="/" className="rounded-md border px-5 py-2">ホームへ戻る</a>
          </div>
        </div>
      </main>
    </div>
  );
}
