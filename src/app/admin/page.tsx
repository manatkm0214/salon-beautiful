"use client";
import { useEffect, useState } from 'react';

type Booking = any;

export default function AdminPage() {
  const [list, setList] = useState<Booking[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/bookings')
      .then((r) => r.json())
      .then((data) => setList(data.list))
      .catch((e) => setError(e.message || 'エラー'))
      .finally(() => setLoading(false));
  }, []);

  const confirmBooking = async (id: string) => {
    try {
      const res = await fetch('/api/admin/confirm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bookingId: id }) });
      if (!res.ok) throw new Error('確認失敗');
      const data = await res.json();
      setList((prev) => prev?.map((b) => (b.id === id ? data.booking : b)) || null);
    } catch (err: any) {
      alert(err.message || 'エラー');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">管理パネル</h2>
        <p className="mb-4">管理者アカウントでログインすると予約を確認できます。</p>

        {loading && <div>読み込み中…</div>}
        {error && <div className="text-red-600">{error}</div>}

        <div className="space-y-4">
          {list?.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded shadow-sm flex justify-between items-center">
              <div>
                <div className="text-sm text-zinc-700">{new Date(b.scheduledAt).toLocaleString()}</div>
                <div className="font-medium">{b.service?.name} — {b.user?.email}</div>
                <div className="text-sm text-zinc-500">ステータス: {b.status}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm">¥{Math.round((b.payment?.amountCents || 0) / 100).toLocaleString()}</div>
                {b.status !== 'CONFIRMED' ? (
                  <button className="rounded-md bg-foreground text-background px-3 py-1" onClick={() => confirmBooking(b.id)}>入金確認</button>
                ) : (
                  <div className="text-sm text-zinc-600">確認済</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
