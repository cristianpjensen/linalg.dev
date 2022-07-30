import { observer } from "mobx-react-lite";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";

import { Context as NodeContext, Matrix } from "../node-engine";
import { EditorContext } from "../editor-state";
import { VectorSpace } from "./VectorSpace";
import Editor from "./Editor";
import Toolbar from "./Toolbar";
import Flow from "./react-flow/ReactFlow";

export const TransformContext = React.createContext<(matrix: Matrix) => void>(
	() => {}
);

export interface IAppProps {
	nodeContext: NodeContext;
	editorContext: EditorContext;
}

const App = observer(({ nodeContext, editorContext }: IAppProps) => {
	const ref = useRef<VectorSpace>(null);

	useEffect(() => {
		const loadingElement = document.getElementById("loading-screen");
		if (loadingElement) {
			setTimeout(() => {
				loadingElement.classList.add("animate-fadeout");
				setTimeout(() => {
					loadingElement.remove();
				}, 800);
			}, 1000);
		}
	}, []);

	return (
		<>
			<Toolbar editorContext={editorContext} />
			<Flow />
		</>
	);

	const transform = (matrix: Matrix) => {
		const mat = new THREE.Matrix3().fromArray(matrix).transpose();
		ref.current?.transform(mat);
		editorContext.currentMatrix = editorContext.currentMatrix.multiply(mat);
		editorContext.currentMatrixReset = false;
	};

	return (
		<>
			<TransformContext.Provider value={transform}>
				<div
					className="h-full"
					style={{
						width: `${(
							(1 - 1 / editorContext.vectorSpaceSize) *
							100
						).toFixed(3)}%`,
					}}
				>
					<Toolbar editorContext={editorContext} />
					<Editor
						context={nodeContext}
						editorContext={editorContext}
					/>
				</div>
			</TransformContext.Provider>

			<VectorSpace
				ref={ref}
				context={nodeContext}
				editor={editorContext}
			/>
		</>
	);
});

export default App;
