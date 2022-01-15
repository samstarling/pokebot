import type { NextApiRequest, NextApiResponse } from 'next';

import { installer } from '../../../lib/slack/installer';

export default async function (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const url = await installer.generateInstallUrl({
    scopes: ['users:read', 'chat:write', 'app_mentions:read'],
  });
  res.send(url);
}
