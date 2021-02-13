// import { WebClient } from "@slack/web-api";
// import { createConnection, getConnection, getRepository } from "typeorm";
// import { Repository } from "typeorm";

// import { MentionEvent } from "../slack";
import assign from "./assign";
// import { Pokemon, Roll } from "../../src/entity";

// beforeEach(() => {
//   return createConnection({
//     type: "sqlite",
//     database: ":memory:",
//     dropSchema: true,
//     entities: [Pokemon, Roll],
//     synchronize: true,
//     logging: false,
//   });
// });

// afterEach(() => {
//   const conn = getConnection();
//   return conn.close();
// });

describe(assign.respond, () => {
  // const event: MentionEvent = {
  //   channel: "",
  //   text: "",
  //   user: "",
  //   team: "",
  //   enterprise_id: "",
  //   blocks: [],
  //   ts: "",
  // };

  // const client: WebClient = {} as WebClient;
  // const pokeRepo = getRepository(Pokemon);
  // const rollRepo = getRepository(Roll);

  // const p = {
  //   event,
  //   client,
  //   pokeRepo,
  //   rollRepo,
  // };

  test("does something", () => {
    expect(1).toBe(1);
  });
});
