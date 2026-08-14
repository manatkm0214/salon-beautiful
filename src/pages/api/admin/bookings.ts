import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const list = await prisma.booking.findMany({ include: { user: true, service: true, payment: true }, orderBy: { scheduledAt: 'asc' } });
    return res.status(200).json({ list });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
