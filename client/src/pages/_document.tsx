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
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}