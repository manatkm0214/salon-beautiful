import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ error: 'bookingId required' });

    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CONFIRMED',
          payment: { update: { paid: true } },
        },
        include: { payment: true, user: true },
      });
      return res.status(200).json({ booking });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Could not confirm' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
