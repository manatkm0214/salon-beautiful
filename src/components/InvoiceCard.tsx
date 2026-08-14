"use client";

import { SERVICES } from "@/data/services";

type InvoiceBooking = {
  id: string;
  serviceId: string;
  scheduledAt: string;
  createdAt?: string;
  user?: { name?: string; email?: string };
  payment?: { paid?: boolean; amountCents?: number };
};

export default function InvoiceCard({ booking }: { booking: InvoiceBooking }) {
  const service = SERVICES.find((item) => item.id === booking.serviceId);
  const amountCents = booking.payment?.amountCents ?? service?.priceCents ?? 0;
  const issueDate = new Date(booking.createdAt || booking.scheduledAt).toLocaleDateString("ja-JP");

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
        <div><p className="text-xs font-semibold tracking-[0.16em] text-amber-800">INVOICE</p><h3 className="mt-1 text-xl font-semibold">ご請求内容</h3></div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.payment?.paid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>{booking.payment?.paid ? "お支払い済み" : "入金待ち"}</span>
      </div>
      <div className="space-y-2 py-4 text-sm text-stone-600">
        <div className="flex justify-between gap-4"><span>請求日</span><span className="text-stone-900">{issueDate}</span></div>
        <div className="flex justify-between gap-4"><span>請求番号</span><span className="font-mono text-stone-900">{booking.id}</span></div>
        <div className="flex justify-between gap-4"><span>ご請求先</span><span className="text-stone-900">{booking.user?.name || "ご予約者様"}</span></div>
      </div>
      <div className="border-y border-stone-200 py-4">
        <div className="flex justify-between gap-4"><div><p className="font-medium text-stone-900">{service?.name || "施術料金"}</p><p className="mt-1 text-xs text-stone-500">{new Date(booking.scheduledAt).toLocaleString("ja-JP", { dateStyle: "medium", timeStyle: "short" })}</p></div><p className="font-semibold text-stone-900">¥{Math.round(amountCents / 100).toLocaleString()}</p></div>
      </div>
      <div className="flex items-end justify-between pt-4"><span className="font-medium">ご請求金額（税込）</span><span className="text-2xl font-semibold">¥{Math.round(amountCents / 100).toLocaleString()}</span></div>
      {!booking.payment?.paid && <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-stone-700"><p className="font-semibold text-stone-900">お振込先</p><p className="mt-1">{process.env.NEXT_PUBLIC_BANK_NAME || "Sample Bank"}　{process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "000-0000-000"}</p><p>{process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "Salon Sample"}</p><p className="mt-2 text-xs text-stone-500">振込人名には請求番号を付記してください。入金確認後、予約確定のご案内をお送りします。</p></div>}
      <button type="button" onClick={() => window.print()} className="mt-5 w-full rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-amber-800 hover:text-amber-800">請求書を印刷・PDF保存</button>
    </section>
  );
}
