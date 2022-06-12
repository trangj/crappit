import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={{
            __html: '!function(){var e=window.localStorage.getItem("theme"),t=window.document.documentElement;e?t.classList.add(e):(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")&&t.classList.add(e)}();',
          }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" href="/img/logo.png" />
          <link href="/img/logo512.png" />
          <meta name="theme-color" content="#ffffff" />
          <meta property="og:site_name" content="crappit" />
          <meta property="twitter:site" content="@crappit" />
          <meta property="twitter:card" content="summary" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
