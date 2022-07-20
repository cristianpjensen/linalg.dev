import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import * as TWEEN from "@tweenjs/tween.js";

import { Context as NodeContext } from "../src/node-engine";
import { editorContext } from "../src/editor-state";

const App = dynamic(() => import("../src/App"), {
	ssr: false,
});

export const nodeContext = NodeContext.load(
	typeof localStorage !== "undefined"
		? localStorage.getItem("node-context")
		: null
);
// export const nodeContext = new NodeContext({});

const Home: NextPage = () => {
	useEffect(() => {
		// Save the node context every 2 seconds
		setInterval(() => {
			localStorage.setItem("node-context", nodeContext.serialize());
		}, 2000);

		// Tween animation loop
		const animate = () => {
			TWEEN.update();
			requestAnimationFrame(animate);
		};

		requestAnimationFrame(animate);

		return () => {
			TWEEN.removeAll();
		};
	}, []);

	return (
		<div>
			<Head>
				<title>WIP: linalg.dev</title>
				<meta
					name="description"
					content="Linear algebra node environment."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex flex-row dark:text-white dark:bg-black">
				<App nodeContext={nodeContext} editorContext={editorContext} />
			</div>
		</div>
	);
};

export default Home;
