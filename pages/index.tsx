import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import InfiniteGrid from "../components/InfiniteGrid";
import VectorPane from "../components/VectorPane";
import Toolbar from "../components/Toolbar";
import { useStore } from "../stores";

const VectorSpace = dynamic(() => import("../components/VectorSpace"), {
  ssr: false,
});

const Home: NextPage = () => {
  const { vectors } = useStore((state) => ({ vectors: state.vectors }));

  return (
    <div>
      <Head>
        <title>linalg.dev</title>
        <meta name="description" content="Linear algebra node environment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Toolbar />
        <InfiniteGrid>
          {vectors.map(({ id, canvasX, canvasY }) => (
            <VectorPane key={id} id={id} x={canvasX} y={canvasY} />
          ))}
        </InfiniteGrid>
      </div>
    </div>
  );
};

export default Home;
