import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import * as TWEEN from "@tweenjs/tween.js";
import Toolbar from "../components/Toolbar";
import { useEffect } from "react";

const VectorSpace = dynamic(() => import("../components/VectorSpace"), {
  ssr: false,
});
const Grid = dynamic(() => import("../components/InfiniteGrid"), {
  ssr: false,
});
const Vectors = dynamic(() => import("../components/panes/Vector"), {
  ssr: false,
});

const Home: NextPage = () => {
  useEffect(() => {
    // Tween animation loop
    const animate = () => {
      TWEEN.update();
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div>
      <Head>
        <title>linalg.dev</title>
        <meta name="description" content="Linear algebra node environment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-row">
        {/* <div className="w-6/12 h-full"> */}
        <div className="w-full h-full">
          <Toolbar />
          <Grid>
            <Vectors />
          </Grid>
        </div>

        {/* <VectorSpace /> */}
      </div>
    </div>
  );
};

export default Home;
