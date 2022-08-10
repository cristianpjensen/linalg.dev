import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const App = dynamic(() => import("../src/App"), {
	ssr: false,
});

const Home: NextPage = () => {
	return (
		<div>
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
