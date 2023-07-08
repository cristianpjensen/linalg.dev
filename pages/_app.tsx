import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import "katex/dist/katex.min.css";
import { Analytics } from "@vercel/analytics/react";

import "../styles/globals.css";

/**
 * Remove this component from the DOM when the app has loaded. This can be done
 * by adding this to the highest component in the hierarchy:
 * ```
 * useEffect(() => {
 *   const loadingElement = document.getElementById("loading-screen");
 *   if (loadingElement) {
 *     loadingElement.classList.add("animate-fadeout")
 *     setTimeout(() => {
 *       loadingElement.remove();
 *     }, 800)
 *   }
 * }, [])
 * ```
 */
const LoadingScreen = () => {
	const [showNodesWarning, setShowNodesWarning] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShowNodesWarning(true);
		}, 5000);
	}, []);

	return (
		<div
			id="loading-screen"
			className="absolute z-[900] flex flex-col items-center justify-center w-full h-full gap-2 bg-offblack"
		>
			<div className="animate-fadein lds-ellipsis child:bg-zinc-100">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			{showNodesWarning && (
				<div className="absolute mt-32 text-sm animate-fadein-slow text-offwhite">
					More nodes lengthen the loading time.
				</div>
			)}
		</div>
	);
};

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
			</Head>

			<LoadingScreen />
			<Component {...pageProps} />
			<Analytics />
		</>
	);
}

export default MyApp;
