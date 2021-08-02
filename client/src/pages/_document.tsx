import NextDocument, { Html, Head, Main, NextScript } from "next/document";
export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <script dangerouslySetInnerHTML={{
                        __html:
                            `!function(){var e=window.localStorage.getItem("theme"),t=window.document.documentElement;e?t.classList.add(e):(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")&&t.classList.add(e)}();`
                    }} />
                    <script src="https://kit.fontawesome.com/dfd1b78df3.js" crossOrigin="anonymous"></script>
                    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                    <link rel="apple-touch-icon" href="/img/logo.png" />
                    <link rel="apple-touch-startup-image" href="/img/logo512.png" />
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