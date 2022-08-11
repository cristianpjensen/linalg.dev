import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useWindowHeight } from "@react-hook/window-size";

const App = dynamic(() => import("../src/App"), {
	ssr: false,
});

const Home: NextPage = () => {
	const height = useWindowHeight();

	return (
		<div className="absolute top-0 left-0 w-full h-full" style={{ height }}>
			<Head>
				<title>Linear algebra node environment</title>
				<meta
					name="description"
					content="Linear algebra node environment."
				/>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="icon" type="image/png" href="/favicon.png" />
			</Head>

			<div className="flex text-offblack dark:text-offwhite bg-offwhite dark:bg-offblack">
				<App />
			</div>
		</div>
	);
};

export default Home;
