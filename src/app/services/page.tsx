import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES } from "@/data/services";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">メニュー</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} id={s.id} name={s.name} description={s.description} durationMin={s.durationMin} priceCents={s.priceCents} />
          ))}
        </div>
      </main>
    </div>
  );
}
