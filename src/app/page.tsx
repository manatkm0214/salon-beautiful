import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import ServiceCard from "@/components/ServiceCard";
import GuestAuth from "@/components/GuestAuth";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6 sm:py-7">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="logo" width={56} height={56} className="rounded-full" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Lumière Atelier</h1>
            <div className="text-xs text-stone-500 sm:text-sm">HAIR SALON</div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="hidden text-sm text-stone-600 sm:block">ホーム</Link>
          <Link href="/services" className="text-sm text-stone-600">メニュー</Link>
          <Link href="/bookings" className="hidden text-sm text-stone-600 sm:block">予約確認</Link>
          <div className="hidden sm:block"><GuestAuth /></div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 sm:px-6">
        <section className="mb-14 grid overflow-hidden rounded-3xl bg-stone-900 md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 text-stone-50 sm:p-12">
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-amber-300">YOUR TIME, BEAUTIFULLY</p>
            <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">私らしさが、<br />もっと輝く。</h2>
            <p className="mt-5 max-w-md leading-relaxed text-stone-300">丁寧なカウンセリングから仕上げまで。あなたの毎日に馴染む、心地よいヘアスタイルをご提案します。</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-lg bg-amber-500 px-5 py-3 font-semibold text-stone-950 transition hover:bg-amber-400" href="/services">予約する</Link>
              <Link className="rounded-lg border border-stone-600 px-5 py-3 text-stone-100 transition hover:bg-stone-800" href="/services">メニューを見る</Link>
            </div>
          </div>
          <div className="relative min-h-72 md:min-h-full">
            <Image src="/photos/hero-photo.svg" alt="Lumière Atelier のサロン空間" fill priority className="object-cover" />
          </div>
        </section>

        <section className="pb-12">
          <div className="mb-6 flex items-end justify-between">
            <div><p className="text-xs font-semibold tracking-[0.18em] text-amber-800">POPULAR SERVICES</p><h3 className="mt-2 text-2xl font-semibold">人気メニュー</h3></div>
            <Link href="/services" className="text-sm font-medium text-amber-800 hover:underline">すべて見る</Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} id={s.id} name={s.name} description={s.description} durationMin={s.durationMin} priceCents={s.priceCents} image={s.image} />
            ))}
          </div>
        </section>

        <section className="mb-12 grid gap-5 rounded-3xl bg-amber-50 p-7 sm:grid-cols-3 sm:p-9">
          <div><p className="text-xs font-semibold tracking-[0.16em] text-amber-800">OPENING HOURS</p><p className="mt-3 font-semibold">10:00 — 19:00</p><p className="mt-1 text-sm text-stone-600">最終受付 17:00 ／ 月曜定休</p></div>
          <div><p className="text-xs font-semibold tracking-[0.16em] text-amber-800">ACCESS</p><p className="mt-3 font-semibold">Sample City, 1-2-3</p><p className="mt-1 text-sm text-stone-600">Sample Station 徒歩5分</p></div>
          <div><p className="text-xs font-semibold tracking-[0.16em] text-amber-800">RESERVATION</p><p className="mt-3 font-semibold">オンラインで24時間受付</p><Link href="/services" className="mt-1 inline-block text-sm text-amber-800 hover:underline">日時を選択する →</Link></div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-5 py-8 text-sm text-stone-500 sm:px-6">
        © {new Date().getFullYear()} Lumière Atelier — 〒000-0000 Sample City
      </footer>
    </div>
  );
}
