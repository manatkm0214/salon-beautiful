import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, context: { params: any }) {
  try {
    // In Next 16 the params may be a Promise; await if needed
    const p = await context.params;
    const id = p?.id || context.params?.id;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // mark payment as paid and booking confirmed
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status: "CONFIRMED",
        payment: {
          update: {
            paid: true,
          },
        },
      },
      include: { payment: true, user: true },
    });

    return NextResponse.json({ booking });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not confirm booking" }, { status: 500 });
  }
}
