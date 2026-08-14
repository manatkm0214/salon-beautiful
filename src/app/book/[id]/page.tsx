"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SERVICES } from "@/data/services";
import GuestAuth from "@/components/GuestAuth";
import BookingCalendar from "@/components/BookingCalendar";

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const service = SERVICES.find((s) => s.id === params.id);
  const [guest] = useState(() => {
    if (typeof window === "undefined") return { name: "", email: "" };
    try {
      const stored = JSON.parse(localStorage.getItem("guestUser") || "{}");
      return {
        name: typeof stored.name === "string" ? stored.name : "",
        email: typeof stored.email === "string" ? stored.email : "",
      };
    } catch {
      return { name: "", email: "" };
    }
  });
  const [name, setName] = useState(guest.name);
  const [email, setEmail] = useState(guest.email);
  const [datetime, setDatetime] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!service) return <div className="p-8">サービスが見つかりません。</div>;

  const saveBookingForConfirmation = (id: string) => {
    const key = "local_bookings";
    const booking = {
      id,
      serviceId: service.id,
      scheduledAt: datetime,
      user: { email, name },
      note,
      payment: { method: "BANK_TRANSFER", paid: false, amountCents: service.priceCents },
      createdAt: new Date().toISOString(),
      status: "PENDING",
    };
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as { id: string }[];
    localStorage.setItem(key, JSON.stringify([...existing.filter((item) => item.id !== id), booking]));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email || !datetime) {
      setError("お名前、メールアドレス、日時を入力してください");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("メールアドレスの形式をご確認ください");
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
      if (!res.ok) {
        setError(data?.error || "予約に失敗しました");
        return;
      }
      saveBookingForConfirmation(data.booking.id);
      router.push(`/book/confirmed?bookingId=${data.booking.id}`);
    } catch (err: unknown) {
      // If the API is unavailable, fall back to saving the booking locally in localStorage
      console.warn('Booking API failed, falling back to localStorage', err);
      try {
        const localId = `local-${Date.now()}`;
        saveBookingForConfirmation(localId);

        // redirect to confirmation page with local booking id
        router.push(`/book/confirmed?bookingId=${localId}`);
        return;
      } catch (localErr) {
        setError('ローカル保存に失敗しました');
        console.error(localErr);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900">
      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-12">
        <div className="mb-7 flex items-center justify-between">
          <button type="button" onClick={() => history.back()} className="text-sm text-stone-600 hover:text-amber-800">← メニューに戻る</button>
          <GuestAuth />
        </div>
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-amber-800">ONLINE RESERVATION</p>
          <h2 className="text-3xl font-semibold tracking-tight">{service.name} のご予約</h2>
          <p className="mt-2 text-stone-600">日時を選択して、ご予約情報をご入力ください。</p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 sm:p-7">
            <h3 className="mb-4 text-lg font-semibold">1. ご希望日時</h3>
            <BookingCalendar value={datetime} onChange={setDatetime} />
            {datetime && <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-950">選択中：{new Date(datetime).toLocaleString("ja-JP", { dateStyle: "long", timeStyle: "short" })}</p>}

            <h3 className="mb-4 mt-8 text-lg font-semibold">2. お客様情報</h3>
            <label className="block mb-4">
            <div className="mb-1.5 text-sm font-medium">お名前 <span className="text-amber-800">必須</span></div>
            <input autoComplete="name" required className="w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100" value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="block mb-4">
            <div className="mb-1.5 text-sm font-medium">メールアドレス <span className="text-amber-800">必須</span></div>
            <input type="email" autoComplete="email" required className="w-full rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="block">
            <div className="mb-1.5 text-sm font-medium">備考 <span className="font-normal text-stone-500">（任意）</span></div>
            <textarea rows={3} placeholder="ご要望やご相談があればご記入ください" className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2.5 outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-100" value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          </section>

          <aside className="h-fit rounded-2xl bg-stone-900 p-5 text-stone-50 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <p className="text-xs font-semibold tracking-[0.16em] text-amber-300">RESERVATION SUMMARY</p>
            <h3 className="mt-4 text-xl font-semibold">{service.name}</h3>
            <div className="mt-5 space-y-3 border-y border-stone-700 py-5 text-sm text-stone-300">
              <div className="flex justify-between gap-3"><span>所要時間</span><span className="text-white">約 {service.durationMin} 分</span></div>
              <div className="flex justify-between gap-3"><span>料金</span><span className="text-white">¥{Math.round(service.priceCents / 100).toLocaleString()}</span></div>
              <div><span>ご予約日時</span><p className="mt-1 font-medium text-white">{datetime ? new Date(datetime).toLocaleString("ja-JP", { dateStyle: "medium", timeStyle: "short" }) : "日時を選択してください"}</p></div>
            </div>
            {error && <div role="alert" className="mt-4 rounded-lg bg-red-950/60 px-3 py-2 text-sm text-red-200">{error}</div>}
            <button type="submit" className="mt-5 w-full rounded-lg bg-amber-500 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50" disabled={loading}>
              {loading ? "予約を送信中…" : "この内容で予約する"}
            </button>
            <p className="mt-3 text-center text-xs leading-relaxed text-stone-400">送信後、銀行振込のご案内を表示します。入金確認後に予約確定となります。</p>
          </aside>
        </form>
      </main>
    </div>
  );
}
