import Head from "next/head";
import React from "react";
import { installer } from "../lib/slack/installer";
import styles from "../styles/Home.module.css";

export default function Home({
  installUrl,
}: {
  installUrl: string;
}): React.ReactElement {
  return (
    <div className={styles.container}>
      <Head>
        <title>Pokébot</title>
      </Head>

      <main className={styles.main}>
        <a href={installUrl}>
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

export async function getServerSideProps() {
<<<<<<< HEAD:pages/index.tsx
  const installUrl = await installer.generateInstallUrl({
    scopes: ["users:read", "chat:write", "app_mentions:read"],
  });
=======
  const installUrl = await fetch('/api/auth/install-url');
>>>>>>> c347e59 (Fix local dev, and add fusion names):pages/index.js
  return {
    props: {
      installUrl,
    },
  };
}
