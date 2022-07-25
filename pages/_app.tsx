import type { AppProps } from "next/app";
import Head from "next/head";
import Lottie from "react-lottie";

import "katex/dist/katex.min.css";
import "../styles/globals.css";
import * as vectorLoaderAnimation from "../animations/vector-loader.json";

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
	return (
		<div
			id="loading-screen"
			className="absolute z-50 flex items-center justify-center w-full h-full bg-offblack"
		>
			<div className="animate-fadein">
				<Lottie
					options={{
						loop: true,
						autoplay: true,
						animationData: vectorLoaderAnimation,
						rendererSettings: {
							preserveAspectRatio: "xMidYMid slice",
						},
					}}
					height={80}
					width={80}
					ariaLabel="Loading screen"
				/>
			</div>
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
		</>
	);
}

export default MyApp;
