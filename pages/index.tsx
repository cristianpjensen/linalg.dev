import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

import InfiniteGrid from "../components/InfiniteGrid";
import Pane from "../components/Pane";
const VectorSpace = dynamic(() => import("../components/VectorSpace"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>linalg.dev</title>
        <meta name="description" content="Linear algebra node environment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <InfiniteGrid>
        <Pane />
      </InfiniteGrid>
    </div>
  );
};

export default Home;
