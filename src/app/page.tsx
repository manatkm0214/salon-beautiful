import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import ServiceCard from "@/components/ServiceCard";
import GuestAuth from "@/components/GuestAuth";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      <header className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/logo.svg" alt="logo" width={56} height={56} className="rounded-full" />
          <div>
            <h1 className="text-2xl font-bold">Lumière Atelier</h1>
            <div className="text-sm text-zinc-600">上質なヘアサロンの予約システム</div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-zinc-700">ホーム</Link>
          <Link href="/services" className="text-zinc-700">メニュー</Link>
          <div className="ml-4"><GuestAuth /></div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6">
        <section className="rounded-xl bg-white p-8 shadow-sm mb-8 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-3">美しく、あなたらしく。</h2>
            <p className="text-zinc-600 mb-6">Lumière Atelier は落ち着いた空間で丁寧なおもてなしを提供するヘアサロンです。オンラインで簡単にご予約ください。</p>
            <div className="flex gap-3">
              <Link className="rounded-md bg-foreground text-background px-5 py-3" href="/services">メニューを見る</Link>
              <a className="rounded-md border px-5 py-3" href="/book/">ご予約へ</a>
            </div>
          </div>
          <div className="w-full h-56 rounded-lg overflow-hidden">
          <Image src="/photos/hero-real.jpg" alt="salon" width={720} height={320} className="object-cover w-full h-full" />
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">人気メニュー</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} id={s.id} name={s.name} description={s.description} durationMin={s.durationMin} priceCents={s.priceCents} image={s.image} />
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-8 text-sm text-zinc-600">
        © {new Date().getFullYear()} Salon Sample — 〒000-0000 Sample City
      </footer>
    </div>
  );
}
