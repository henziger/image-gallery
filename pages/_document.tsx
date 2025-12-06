import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="Eric Henziger's image archive" />
          <meta property="og:site_name" content="henziger.se" />
          <meta property="og:title" content="Eric Henziger's image archive" />
          <meta
            property="og:description"
            content="Here's a link to one or more of Eric's favorite photos, check it out!"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Eric Henziger's image archive" />
          <meta
            name="twitter:description"
            content="Here's a link to one or more of Eric's favorite photos, check it out!"
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
