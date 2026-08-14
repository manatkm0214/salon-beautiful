// If Auth0 environment variables are not provided, export a noop handler
// so that the app can be deployed without Auth0 configured (localStorage fallback is used for bookings).

import type { NextApiRequest, NextApiResponse } from 'next';

const required = [
  'AUTH0_ISSUER_BASE_URL',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_SECRET',
];

const hasAuth0 = required.every((k) => Boolean(process.env[k]));

let handler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>;

if (hasAuth0) {
  // Lazy require via eval to avoid bundler resolution when the package is not installed
  const requireFn = eval('require');
  try {
    const { handleAuth } = requireFn('@auth0/nextjs-auth0');
    handler = handleAuth();
  } catch (e) {
    handler = (_req: NextApiRequest, res: NextApiResponse) => {
      res.status(501).json({ error: 'Auth not configured on this deployment' });
    };
  }
} else {
  handler = (_req: NextApiRequest, res: NextApiResponse) => {
    res.status(501).json({ error: 'Auth not configured on this deployment' });
  };
}

export default handler;
