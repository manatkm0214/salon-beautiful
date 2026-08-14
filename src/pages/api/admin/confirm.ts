import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

const required = [
  'AUTH0_ISSUER_BASE_URL',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_SECRET',
];
const hasAuth0 = required.every((k) => Boolean(process.env[k]));

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!hasAuth0) {
    return res.status(501).json({ error: 'Auth not configured on this deployment' });
  }

  // Lazy require via eval to avoid static bundler resolution when the package is not installed
  const requireFn = eval('require');
  let getSession;
  try {
    getSession = requireFn('@auth0/nextjs-auth0').getSession;
  } catch (e) {
    return res.status(501).json({ error: 'Auth not configured on this deployment' });
  }

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
