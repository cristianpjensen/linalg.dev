import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import * as TWEEN from "@tweenjs/tween.js";

import { Context as NodeContext } from "../node-engine";

const VectorSpace = dynamic(() => import("../components/VectorSpace"), {
	ssr: false,
});
const Editor = dynamic(() => import("../components/Editor"), {
	ssr: false,
});
const Toolbar = dynamic(() => import("../components/Toolbar"), {
	ssr: false,
});

const nodeContext = NodeContext.load(
	typeof localStorage !== "undefined"
		? localStorage.getItem("node-context")
		: null
);
// const nodeContext = new NodeContext({});

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
				<title>linalg.dev</title>
				<meta
					name="description"
					content="Linear algebra node environment."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex flex-row dark:text-white dark:bg-black">
				{/* <div className="w-6/12 h-full"> */}
				<div className="w-full h-full">
					<Toolbar />
					<Editor context={nodeContext} />
				</div>

				{/* <VectorSpace /> */}
			</div>
		</div>
	);
};

export default Home;
