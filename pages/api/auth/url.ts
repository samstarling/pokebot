import type { NextApiRequest, NextApiResponse } from "next";

import { installer } from "../../../util/installer";

export default function (req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    url: installer.generateInstallUrl({
      scopes: ["app_mentions:read", "chat:write"],
    }),
  });
}
