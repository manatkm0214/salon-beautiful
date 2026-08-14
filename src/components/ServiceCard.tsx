"use client";
import Link from "next/link";
import Image from "next/image";

type ServiceProps = {
  id: string;
  name: string;
  description?: string;
  durationMin: number;
  priceCents: number;
  image?: string;
};

export default function ServiceCard({ id, name, description, durationMin, priceCents, image }: ServiceProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow">
      {image && (
        <div className="w-full h-40 relative">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-sm text-zinc-600 mb-4">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-zinc-700">{durationMin}分</div>
          <div className="text-lg font-medium">¥{Math.round(priceCents / 100).toLocaleString()}</div>
        </div>
        <Link className="mt-4 inline-block w-full text-center rounded-md bg-foreground text-background py-2 px-4 hover:opacity-90" href={`/book/${id}`}>
          予約する
        </Link>
      </div>
    </div>
  );
}
