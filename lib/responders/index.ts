import { WebClient } from "@slack/web-api";
import { MentionEvent } from "../slack";
import { PrismaClient } from "@prisma/client";

import { default as Assign } from "./assign";
import { default as AssignNew } from "./assignNew";
import { default as Help } from "./help";
import { default as Latest } from "./latest";
import { default as Stats } from "./stats";
import { default as Thanks } from "./thanks";
import { default as Battle } from "./battle";

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
  AssignNew,
  Battle,
  Help,
  Latest,
  Stats,
  Thanks,
];
