type Block =
  | {
      type: "rich_text_section";
    }
  | {
      type: "user";
      user_id: string;
    };

export type MentionEvent = {
  channel: string;
  text: string;
  user: string;
  team: string;
  enterprise_id: string;
  blocks: Block[];
};
