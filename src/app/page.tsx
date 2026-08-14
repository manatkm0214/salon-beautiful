import Image from "next/image";
import Link from "next/link";
import { SERVICES } from "@/data/services";
import ServiceCard from "@/components/ServiceCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      <header className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="logo" width={48} height={48} className="rounded-full" />
          <div>
            <h1 className="text-2xl font-bold">Salon Sample</h1>
            <div className="text-sm text-zinc-600">上質なサービスでおもてなし</div>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/">ホーム</Link>
          <Link href="/services">メニュー</Link>
          <a href="/api/auth/login" className="ml-4 hidden sm:inline-block rounded-md border px-3 py-1">ログイン</a>
          <a href="/api/auth/logout" className="ml-2 hidden sm:inline-block rounded-md border px-3 py-1">ログアウト</a>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        <section className="rounded-xl bg-white p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-semibold mb-2">ご予約はこちらから</h2>
              <p className="text-zinc-600">簡単なステップでオンライン予約。銀行振込での事前支払いが選べます。</p>
              <div className="mt-6 flex gap-3">
                <Link className="rounded-md bg-foreground text-background px-5 py-3" href="/services">メニューを見る</Link>
              </div>
            </div>
            <div className="w-48 h-48 bg-zinc-100 rounded-lg flex items-center justify-center">
              <Image src="/hero-salon.jpg" alt="salon" width={160} height={160} className="object-cover rounded-md" />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">人気メニュー</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map((s) => (
              <ServiceCard key={s.id} id={s.id} name={s.name} description={s.description} durationMin={s.durationMin} priceCents={s.priceCents} />
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
