import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { ReactFlowProvider } from "reactflow";
import { useWindowHeight } from "@react-hook/window-size";

import { useEditorStore } from "../stores";
import { Matrix } from "./nodes/types";
import { useIsMobile } from "./hooks";
import VectorSpace from "./VectorSpace";
import Editor from "./Editor";
import Toolbar from "./Toolbar";

export type TransformContext = {
	transform: (matrix: Matrix) => void;
};

export const TransformContext = React.createContext<TransformContext>({
	transform: () => {},
});

THREE.DefaultLoadingManager.onLoad = () => {
	useEditorStore.getState().setIsLoaded(true);
};

const App = () => {
	const ref = useRef<VectorSpace>(null);
	const loaded = useEditorStore((state) => state.isLoaded);

	useEffect(() => {
		const loadingElement = document.getElementById("loading-screen");
		if (loadingElement && loaded) {
			setTimeout(() => {
				loadingElement.classList.add("animate-fadeout");
				setTimeout(() => {
					loadingElement.remove();
				}, 800);
			}, 500);
		}
	}, [loaded]);

	const transform = useEditorStore((state) => state.transform);

	const transformSpace = (matrix: Matrix) => {
		const mat = new THREE.Matrix3().fromArray(matrix).transpose();
		ref.current?.transform(mat);
		transform(mat);
	};

	const vectorSpaceSize = useEditorStore((state) => state.vectorSpaceSize);
	const isMobile = useIsMobile();
	const height = useWindowHeight();

	return (
		<TransformContext.Provider value={{ transform: transformSpace }}>
			<ReactFlowProvider>
				<Toolbar bottom={isMobile} minify={isMobile} />

				<div
					className={
						isMobile
							? "absolute flex flex-col-reverse bottom-12 top-0 w-full"
							: "absolute flex flex-row w-full top-12 bottom-0"
					}
					style={{ height: height - 48 }}
				>
					<Editor
						minimap={!isMobile}
						style={{
							flex: isMobile ? 1.5 : vectorSpaceSize - 1,
						}}
					/>

					<VectorSpace
						ref={ref}
						className={`bg-offblack border-zinc-600 ${
							isMobile ? "border-b-4" : "border-l-4"
						}`}
						style={{
							flex: 1,
						}}
						buttonsTopLeft={isMobile}
					/>
				</div>
			</ReactFlowProvider>
		</TransformContext.Provider>
	);
};

export default App;
