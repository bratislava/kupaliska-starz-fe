import { Head, Html, Main, NextScript } from 'next/document'

const Document = () => {
  return (
    <Html lang="sk">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="manifest" crossOrigin="use-credentials" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#7ccef2" />
        <meta name="theme-color" content="#ffffff" />
        <script
          defer
          data-domain="kupaliska.bratislava.sk"
          src="https://plausible.io/js/script.hash.js"
        />
      </Head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
