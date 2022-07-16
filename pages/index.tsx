import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import * as TWEEN from "@tweenjs/tween.js";

import { Context as NodeContext } from "../node-engine";
import { editorContext } from "../editor-state";

const VectorSpace = dynamic(() => import("../components/VectorSpace"), {
	ssr: false,
});
const Editor = dynamic(() => import("../components/Editor"), {
	ssr: false,
});
const Toolbar = dynamic(() => import("../components/Toolbar"), {
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
				<title>linalg.dev</title>
				<meta
					name="description"
					content="Linear algebra node environment."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="flex flex-row dark:text-white dark:bg-black">
				<div className="w-8/12 h-full border-r-4 border-zinc-600">
					<Toolbar editorContext={editorContext} />
					<Editor
						context={nodeContext}
						editorContext={editorContext}
					/>
				</div>

				<VectorSpace context={nodeContext} />
			</div>
		</div>
	);
};

export default Home;
