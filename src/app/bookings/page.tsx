import Link from "next/link";
import MyBookings from "@/components/MyBookings";

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900">
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
        <Link href="/" className="text-sm text-stone-600 hover:text-amber-800">← ホームへ戻る</Link>
        <p className="mt-8 text-xs font-semibold tracking-[0.18em] text-amber-800">MY RESERVATIONS</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">予約の確認・変更</h1>
        <p className="mt-3 mb-8 leading-relaxed text-stone-600">この端末で作成したご予約を確認、取り消しできます。</p>
        <MyBookings />
      </main>
    </div>
  );
}
