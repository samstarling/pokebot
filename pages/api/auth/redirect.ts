import type { NextApiRequest, NextApiResponse } from "next";

import { installer } from "../../../lib/slack/installer";

export default function (req: NextApiRequest, res: NextApiResponse): void {
  installer.handleCallback(req, res);
}
