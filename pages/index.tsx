import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import InfiniteGrid from "../components/InfiniteGrid";
import Pane from "../components/Pane";
import { useStore } from "../stores";
import {
  ArrowTopRightIcon,
  CaretDownIcon,
  FontFamilyIcon,
  GitHubLogoIcon,
  HandIcon,
  InfoCircledIcon,
  LayersIcon,
  RulerSquareIcon,
  SunIcon,
} from "@radix-ui/react-icons";

const VectorSpace = dynamic(() => import("../components/VectorSpace"), {
  ssr: false,
});

const Home: NextPage = () => {
  const scale = useStore((state) => state.scale);

  return (
    <div>
      <Head>
        <title>linalg.dev</title>
        <meta name="description" content="Linear algebra node environment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <div className="w-screen h-12 absolute top-0 left-0 z-10 bg-slate-50 shadow-sm antialiased text-xs flex flex-row flex-nowrap opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex justify-center items-center w-12 cursor-pointer bg-slate-500 text-white">
            <HandIcon />
          </div>

          <div className="flex justify-center items-center px-4 cursor-pointer hover:bg-slate-200">
            <ArrowTopRightIcon className="mr-2" /> Vector
          </div>

          <div className="flex justify-center items-center px-4 cursor-pointer hover:bg-slate-200">
            <LayersIcon className="mr-2" /> Matrix
          </div>

          <div className="flex justify-center items-center px-4 cursor-pointer hover:bg-slate-200">
            <FontFamilyIcon className="mr-2" /> Math
            <CaretDownIcon className="ml-0.5 hover:translate-y-0.5 transition-transform" />
          </div>

          <div className="flex justify-center items-center px-4 cursor-pointer hover:bg-slate-200">
            <RulerSquareIcon className="mr-2" /> Linear algebra
            <CaretDownIcon className="ml-0.5 hover:translate-y-0.5 transition-transform" />
          </div>

          <div className="grow flex justify-center items-center text-sm">
            Linear algebra
          </div>

          <div className="flex justify-center items-center px-4 cursor-pointer hover:bg-slate-200">
            {Math.round(scale * 100)}%{" "}
            <CaretDownIcon className="ml-05 hover:translate-y-0.5 transition-transform" />
          </div>

          <div className="flex justify-center items-center w-12 cursor-pointer hover:bg-slate-200">
            <SunIcon />
          </div>

          <div className="flex justify-center items-center w-12 cursor-pointer hover:bg-slate-200">
            <InfoCircledIcon />
          </div>

          <div className="flex justify-center items-center w-12 cursor-pointer hover:bg-slate-200">
            <GitHubLogoIcon />
          </div>
        </div>
        <InfiniteGrid>
          <Pane />
        </InfiniteGrid>
      </div>
    </div>
  );
};

export default Home;
