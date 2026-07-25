import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import getResults from "../../utils/cachedImages";
import type { ImageProps } from "../../utils/types";

const Home: NextPage = ({ currentPhoto }: { currentPhoto: ImageProps }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const index = Number(photoId);

  // Point crawlers at the optimizer rather than the blob directly. Pointing at
  // the blob makes every single unfurl pull the full-size original; this way
  // Blob is read once and every later unfurl is served from the image cache.
  // The width has to be one of the configured deviceSizes or the route 400s.
  const ogImage = `https://henziger.se/_next/image?url=${encodeURIComponent(
    currentPhoto.url,
  )}&w=1080&q=75`;

  return (
    <>
      <Head>
        <title>One of Eric&apos;s photos</title>
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async (context) => {
  const images = await getResults();
  const currentPhoto = images.find(
    (img) => img.id === Number(context.params.photoId),
  );

  return {
    props: { currentPhoto },
  };
};

export async function getStaticPaths() {
  const images = await getResults();
  return {
    paths: images.map((_, i) => ({ params: { photoId: i.toString() } })),
    fallback: false,
  };
}
