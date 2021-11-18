import Document, { Html, Head, Main, NextScript } from 'next/document'


export default class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8" />

                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                    <script
                        type="text/javascript"
                        src="https://app.intotheblock.com/widget.js"
                    ></script>
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}
