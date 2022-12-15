import { WebClient } from "@slack/web-api";
import { MentionEvent } from "../slack";

import { Repository } from "typeorm";
import { Pokemon, Roll } from "../database/entity";

import { default as Assign } from "./assign";
import { default as History } from "./history";
import { default as Help } from "./help";
import { default as Latest } from "./latest";
import { default as Stats } from "./stats";
import { default as Thanks } from "./thanks";
import { default as Battle } from "./battle";
import { default as Rowlet } from "./rowlet";
import { default as How } from "./how";
import { default as Fusion } from "./fusion";

export type RespondParams = {
  event: MentionEvent;
  client: WebClient;
  pokeRepo: Repository<Pokemon>;
  rollRepo: Repository<Roll>;
};

export type Responder = {
  id: string;
  triggerPhrase: string;
  respond: (p: RespondParams) => Promise<unknown>;
};

export const RESPONDERS: Responder[] = [
  Assign,
  History,
  Battle,
  Help,
  Latest,
  Stats,
  Thanks,
  Rowlet,
  How,
  Fusion,
];
