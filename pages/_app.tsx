import type { AppProps } from "next/app";
import Head from "next/head";

import "katex/dist/katex.min.css";
import "../src/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
				/>
			</Head>
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
