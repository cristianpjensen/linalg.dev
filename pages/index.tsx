import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import Toolbar from "../components/Toolbar";
import { useStore } from "../stores";

const VectorSpace = dynamic(() => import("../components/VectorSpace"), {
  ssr: false,
});
const Grid = dynamic(() => import("../components/InfiniteGrid"), {
  ssr: false,
});
const VectorPane = dynamic(() => import("../components/VectorPane"), {
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

      <div className="flex flex-row"> 
        <div className="w-6/12 h-full">
          <Toolbar />
          <Grid>
            {vectors.map(({ id, title }) => (
              <VectorPane key={id} title={title} id={id} />
            ))}
          </Grid>
        </div>

        <VectorSpace />
      </div>
    </div>
  );
};

export default Home;
