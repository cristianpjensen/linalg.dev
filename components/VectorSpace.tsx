import { observer } from "mobx-react-lite";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react";
import * as THREE from "three";
import { ResetIcon } from "@radix-ui/react-icons";

import {
	Context as _NodeContext,
	NodeType,
	VectorNode as _VectorNode,
} from "../node-engine";
import { EditorContext } from "../editor-state";
import { Group, Space, Vector } from "./three";

interface IVectorSpaceProps {
	context: _NodeContext;
	editor: EditorContext;
}

export type VectorSpace = {
	/**
	 * Transform the entire space.
	 */
	transform: (matrix: THREE.Matrix3) => void;
};

export const VectorSpace = observer(
	forwardRef<VectorSpace, IVectorSpaceProps>((props, ref) => {
		const { context, editor } = props;

		const spaceRef = useRef<Space>(null);
		const groupRef = useRef<Group>(null);

		useImperativeHandle(ref, () => ({
			transform: (matrix: THREE.Matrix3) => {
				spaceRef.current?.transform(matrix);
				groupRef.current?.transform(matrix);
			},
		}));

		const reset = () => {
			spaceRef.current?.reset();
			editor.currentMatrix.identity();
			editor.currentMatrixReset = true;
		};

		return (
			<div className="border-l-4 border-zinc-600">
				<Space
					ref={spaceRef}
					width={window.innerWidth / editor.vectorSpaceSize}
				>
					<Vectors ref={groupRef} context={context} editor={editor} />
				</Space>
				<button
					onClick={reset}
					className="absolute flex items-center justify-center w-8 h-8 rounded bg-zinc-900 text-zinc-100 right-4 bottom-4 shadow-b1 shadow-zinc-400"
				>
					<ResetIcon />
				</button>
			</div>
		);
	})
);

export interface IVectorsProps {
	context: _NodeContext;
	editor: EditorContext;
}

const Vectors = observer(
	forwardRef<Group, IVectorsProps>((props, ref) => {
		const { context, editor } = props;

		const vectors = Array.from(context.nodes.values()).filter(
			(node) => node.type === NodeType.VECTOR
		);

		return (
			<Group ref={ref}>
				{vectors.map((node) => (
					<VectorWrapper
						key={node.id}
						node={node as _VectorNode}
						editor={editor}
					/>
				))}
			</Group>
		);
	})
);

export interface IVectorWrapperProps {
	node: _VectorNode;
	editor: EditorContext;
}

export const VectorWrapper = observer(
	forwardRef<Vector, IVectorWrapperProps>(({ node, editor }, ref) => {
		const { x, y, z } = node.outputPorts.result.value;
		const { x: ox, y: oy, z: oz } = node.inputPorts.origin.value;
		const innerRef = useRef<Vector>(null);

		// @ts-ignore
		useImperativeHandle(ref, () => innerRef.current);

		// Move vector when vector changes
		useEffect(() => {
			const { x, y, z } = node.outputPorts.result.value;
			const vector = new THREE.Vector3(x, y, z).applyMatrix3(
				editor.currentMatrix
			);
			innerRef.current?.move(vector);
		}, [
			node.outputPorts.result.value.x,
			node.outputPorts.result.value.y,
			node.outputPorts.result.value.z,
		]);

		// Move origin when origin port changes
		useEffect(() => {
			const { x, y, z } = node.inputPorts.origin.value;
			const originVector = new THREE.Vector3(x, y, z).applyMatrix3(
				editor.currentMatrix
			);
			innerRef.current?.moveOrigin(originVector);
		}, [
			node.inputPorts.origin.value.x,
			node.inputPorts.origin.value.y,
			node.inputPorts.origin.value.z,
		]);

		// If reseting, move the vector to its non-transformed position
		useEffect(() => {
			if (editor.currentMatrixReset) {
				const { x, y, z } = node.outputPorts.result.value;
				innerRef.current?.move(new THREE.Vector3(x, y, z));
			}
		}, [editor.currentMatrixReset]);

		// Memoize the vector component, so that it is only created once and not
		// re-rendered every time, which makes it not animate on move
		const vectorComponent = useMemo(() => {
			return (
				<Vector
					ref={innerRef}
					origin={new THREE.Vector3(ox, oy, oz)}
					vector={new THREE.Vector3(x, y, z)}
				/>
			);
		}, []);

		return vectorComponent;
	})
);
