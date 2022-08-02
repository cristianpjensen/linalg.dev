import React, { useRef, useEffect } from "react";
import * as THREE from "three";

import { VectorSpace } from "./VectorSpace";
import Editor from "./Editor";
import Toolbar from "./Toolbar";
import { useEditorStore } from "../stores";
import { Matrix } from "./nodes/types";

export type TransformContext = {
	transform: (matrix: Matrix) => void;
};

export const TransformContext = React.createContext<TransformContext>({
	transform: () => {},
});

const App = () => {
	const ref = useRef<VectorSpace>(null);

	useEffect(() => {
		const loadingElement = document.getElementById("loading-screen");
		if (loadingElement) {
			loadingElement.classList.add("animate-fadeout");
			setTimeout(() => {
				loadingElement.remove();
			}, 800);
		}
	}, []);

	const transform = useEditorStore((state) => state.transform);

	const transformSpace = (matrix: Matrix) => {
		const mat = new THREE.Matrix3().fromArray(matrix).transpose();
		ref.current?.transform(mat);
		transform(mat);
	};

	return (
		<>
			<TransformContext.Provider value={{ transform: transformSpace }}>
				<Toolbar />
				<Editor />
			</TransformContext.Provider>
			<VectorSpace ref={ref} />
		</>
	);
};

export default App;
