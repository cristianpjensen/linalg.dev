import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import * as TWEEN from "@tweenjs/tween.js";
import { useUIStore } from "../stores";
import Toolbar from "../components/Toolbar";

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
  const darkMode = useUIStore((state) => state.darkMode)

  useEffect(() => {
    // Tween animation loop
    const animate = () => {
      TWEEN.update();
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    // Enable dark mode on start up
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    return () => {
      TWEEN.removeAll();
    };
  }, []);

  return (
    <div>
      <Head>
        <title>linalg.dev</title>
        <meta name="description" content="Linear algebra node environment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-row dark:text-white dark:bg-black">
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
