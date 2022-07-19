import { observer } from "mobx-react-lite";
import React, { useRef } from "react";
import * as THREE from "three";

import { Context as NodeContext, Matrix } from "../node-engine";
import { EditorContext } from "../editor-state";
import { VectorSpace } from "./VectorSpace";
import Editor from "./Editor";
import Toolbar from "./Toolbar";

export const TransformContext = React.createContext<(matrix: Matrix) => void>(
	() => {}
);

export interface IAppProps {
	nodeContext: NodeContext;
	editorContext: EditorContext;
}

const App = observer(({ nodeContext, editorContext }: IAppProps) => {
	const ref = useRef<VectorSpace>(null);

	const transform = (m: Matrix) => {
		const mat = new THREE.Matrix3().set(
			m[0],
			m[1],
			m[2],
			m[3],
			m[4],
			m[5],
			m[6],
			m[7],
			m[8]
		);
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
