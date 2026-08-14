import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/data/services";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900">
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-amber-800">SERVICE MENU</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">メニューを選んで予約する</h1>
        <p className="mt-3 max-w-xl leading-relaxed text-stone-600">施術内容と所要時間をご確認のうえ、ご希望のメニューをお選びください。</p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} id={s.id} name={s.name} description={s.description} durationMin={s.durationMin} priceCents={s.priceCents} image={s.image} />
          ))}
        </div>
      </main>
    </div>
  );
}
