import { WebClient } from "@slack/web-api";
import { MentionEvent } from "../slack";
import { PrismaClient } from "@prisma/client";

import { default as Assign } from "./assign";
import { default as Help } from "./help";
import { default as Latest } from "./latest";
import { default as Reroll } from "./reroll";
import { default as Stats } from "./stats";
import { default as Thanks } from "./thanks";

export type Responder = {
  id: string;
  triggerPhrase: string;
  respond: (
    event: MentionEvent,
    client: WebClient,
    prisma: PrismaClient
  ) => void;
};

export const RESPONDERS: Responder[] = [
  Assign,
  Help,
  Latest,
  Reroll,
  Stats,
  Thanks,
];
