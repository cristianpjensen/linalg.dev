import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import InfiniteGrid from "../components/InfiniteGrid";
import Pane from "../components/Pane";
import Toolbar from "../components/Toolbar";

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

      {/* TODO: Put in separate component, connect to global state, and since a lot uses the same code, reuse with components. */}
      <div>
        <Toolbar />
        <InfiniteGrid>
          <Pane />
        </InfiniteGrid>
      </div>
    </div>
  );
};

export default Home;
