import Head from "next/head";

export default function Metatags({
  title = "The Next.js + Firebase demo",
  description = "A working demo of  Next.js + Firebase by Vivek Bhansali",
  image = "https://lh3.googleusercontent.com/a-/AOh14GiDUj3uBTTkqkMPRgjd3iBuW2RHbhEjijsUOquyuHs=s96-c",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@VivekBhansali2" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
