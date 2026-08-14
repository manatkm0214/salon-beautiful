"use client";
import Link from "next/link";

type ServiceProps = {
  id: string;
  name: string;
  description?: string;
  durationMin: number;
  priceCents: number;
};

export default function ServiceCard({ id, name, description, durationMin, priceCents }: ServiceProps) {
  return (
    <div className="border rounded-xl p-6 shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-sm text-zinc-600 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-700">{durationMin}分</div>
        <div className="text-lg font-medium">¥{Math.round(priceCents / 100).toLocaleString()}</div>
      </div>
      <Link className="mt-4 inline-block w-full text-center rounded-md bg-foreground text-background py-2 px-4 hover:opacity-90" href={`/book/${id}`}>
        予約する
      </Link>
    </div>
  );
}
