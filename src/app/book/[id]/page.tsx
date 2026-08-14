"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/data/services";

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const service = SERVICES.find((s) => s.id === params.id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [datetime, setDatetime] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!service) return <div className="p-8">サービスが見つかりません。</div>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !datetime) {
      setError("メールアドレスと日時は必須です");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          userName: name,
          serviceId: service.id,
          scheduledAt: datetime,
          note,
          amountCents: service.priceCents,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "予約に失敗しました");
      // redirect to confirmation page with booking id
      router.push(`/book/confirmed?bookingId=${data.booking.id}`);
    } catch (err: any) {
      setError(err.message || "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-2">{service.name} のご予約</h2>
        <p className="text-zinc-600 mb-6">所要時間: {service.durationMin}分　料金: ¥{Math.round(service.priceCents / 100).toLocaleString()}</p>

        <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          <label className="block mb-3">
            <div className="text-sm mb-1">お名前（任意）</div>
            <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="block mb-3">
            <div className="text-sm mb-1">メールアドレス</div>
            <input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="block mb-3">
            <div className="text-sm mb-1">希望日時</div>
            <input type="datetime-local" className="w-full border rounded px-3 py-2" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
          </label>

          <label className="block mb-3">
            <div className="text-sm mb-1">備考</div>
            <textarea className="w-full border rounded px-3 py-2" value={note} onChange={(e) => setNote(e.target.value)} />
          </label>

          {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

          <div className="flex gap-3">
            <button type="submit" className="rounded-md bg-foreground text-background px-5 py-2" disabled={loading}>
              {loading ? "送信中…" : "予約する"}
            </button>
            <button type="button" className="rounded-md border px-5 py-2" onClick={() => history.back()}>
              戻る
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
