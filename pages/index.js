import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pokébot</title>
      </Head>

      <main className={styles.main}>
        <a href="https://slack.com/oauth/v2/authorize?client_id=296777977314.1518195280034&scope=app_mentions:read,chat:write&user_scope=">
          <img
            alt="Add to Slack"
            height="40"
            width="139"
            src="https://platform.slack-edge.com/img/add_to_slack.png"
            srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
          />
        </a>
      </main>

      <footer className={styles.footer}>Hehe</footer>
    </div>
  );
}
