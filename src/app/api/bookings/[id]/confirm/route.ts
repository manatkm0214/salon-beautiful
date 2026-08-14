import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

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
