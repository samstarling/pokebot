# pokebot

Pokébot is a Slackbot that, amongst other things, answers the question "Who's that Pokémon?". It uses Prisma as an ORM on top of Postgres, and the Slack client uses Redis to store authentication tokens.

You'll need the following environment variables set:

```
export REDIS_URL="..."
export DATABASE_URL="postgresql://user:@localhost/db_name"

export SLACK_TOKEN=""
export SLACK_SIGNING_SECRET=""
export SLACK_CLIENT_ID=""
export SLACK_CLIENT_SECRET=""
export SLACK_VERIFICATION_TOKEN=""
```

To import the Pokémon data, you'll need to run `yarn run import`.
