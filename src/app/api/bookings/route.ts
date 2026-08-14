import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userEmail, userName, serviceId, scheduledAt, note, amountCents } = body;

    if (!serviceId || !scheduledAt || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // upsert user
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      create: { email: userEmail, name: userName || null },
      update: { name: userName || undefined },
    });

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        serviceId,
        scheduledAt: new Date(scheduledAt),
        note: note || null,
        status: "PENDING",
        payment: {
          create: {
            method: "BANK_TRANSFER",
            paid: false,
            amountCents: amountCents ?? 0,
          },
        },
      },
      include: { payment: true, user: true },
    });

    // return bank transfer instructions in response so frontend can show them
    const bankInfo = {
      accountName: process.env.BANK_ACCOUNT_NAME || "Salon Sample",
      accountNumber: process.env.BANK_ACCOUNT_NUMBER || "000-0000-000",
      bankName: process.env.BANK_NAME || "Sample Bank",
      note: `予約ID: ${booking.id}`,
    };

    // send confirmation email (best-effort)
    try {
      const emailHtml = `
        <p>ご予約ありがとうございます。以下の内容で予約を受け付けました。</p>
        <ul>
          <li>予約ID: ${booking.id}</li>
          <li>サービス: ${booking.serviceId}</li>
          <li>日時: ${booking.scheduledAt.toISOString()}</li>
        </ul>
        <p>振込先:</p>
        <ul>
          <li>銀行名: ${bankInfo.bankName}</li>
          <li>口座名義: ${bankInfo.accountName}</li>
          <li>口座番号: ${bankInfo.accountNumber}</li>
          <li>振込人名に予約IDを入れてください: ${booking.id}</li>
        </ul>
      `;

      // dynamic import to avoid requiring nodemailer in environments without SMTP
      const { sendBookingEmail } = await import('@/lib/mailer');
      if (booking.user?.email) {
        await sendBookingEmail(booking.user.email, 'ご予約確認', emailHtml);
      }
    } catch (emailErr) {
      console.error('Email send failed', emailErr);
    }

    return NextResponse.json({ booking, bankInfo }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  // simple list endpoint, later protect with auth
  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  const where: any = {};
  if (status) where.status = status;

  const list = await prisma.booking.findMany({
    where,
    include: { user: true, service: true, payment: true },
    orderBy: { scheduledAt: "asc" },
  });

  return NextResponse.json({ list });
}
