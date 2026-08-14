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
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-lg">
      {image && (
        <div className="relative h-48 w-full bg-stone-100">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="mt-2 min-h-10 text-sm leading-relaxed text-stone-600">{description}</p>
        <div className="mt-5 flex items-center justify-between border-t border-stone-100 pt-4">
          <div className="text-sm text-stone-500">約 {durationMin}分</div>
          <div className="text-lg font-semibold text-stone-900">¥{Math.round(priceCents / 100).toLocaleString()}</div>
        </div>
        <Link className="mt-5 inline-block w-full rounded-lg bg-stone-900 px-4 py-3 text-center font-medium text-white transition hover:bg-amber-800" href={`/book/${id}`}>
          予約する
        </Link>
      </div>
    </article>
  );
}
