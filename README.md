# pokebot

Pokébot is a Slackbot that, amongst other things, answers the question "Who's that Pokémon?". It uses Prisma as an ORM on top of Postgres, and the Slack client uses Redis to store authentication tokens.

You'll need the following environment variables set:

```
export REDIS_URL="..."
export DATABASE_URL="postgresql://user:@localhost/db_name"

export SLACK_SIGNING_SECRET=""
export SLACK_CLIENT_ID=""
export SLACK_CLIENT_SECRET=""
```

## Local dev setup
* Install & run redis. (`brew install redis && redis-server` should do it)
* Create a postgres database called `pokebot`. 
* yarn install

## Create a development Slack app
* Run `yarn dev` to get the dev server running
* `npx ngrok http 3000` to get a local tunnel to give to Slack
* Create a [Slack app](https://api.slack.com/apps) with Event Subscriptions enabled and the following Oauth scopes:

Bot scopes: `users:read`, `chat:write`, `app_mentions:read`
User scopes: `users:read`

Point the Events Subscription request URL at https://<your ngrok server>/api/event.

* Use the Add To Slack button on the index page to install the app to your test workspace.

## Data import
* run `yarn run import` to import the Pokémon data.
* NB. to create tables as well as importing data, run `CREATE_TABLES=true yarn run import`.
