import { observer } from "mobx-react-lite";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react";
import { Space, Vector } from "react-three-linalg";
import * as THREE from "three";

import {
	Context as _NodeContext,
	NodeType,
	VectorNode as _VectorNode,
} from "../node-engine";
import { EditorContext } from "../editor-state";
import { Group } from "./three";

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

		const vectors = Array.from(context.nodes.values()).filter(
			(node) => node.type === NodeType.VECTOR
		);

		const spaceRef = useRef<Space>(null);
		const groupRef = useRef<Group>(null);

		useImperativeHandle(ref, () => ({
			transform: (matrix: THREE.Matrix3) => {
				spaceRef.current?.transform(matrix);
				groupRef.current?.transform(matrix);
			},
		}));

		return (
			<div className="border-l-4 border-zinc-600">
				<Space
					ref={spaceRef}
					width={window.innerWidth / editor.vectorSpaceSize}
				>
					<Group ref={groupRef}>
						{vectors.map((node) => (
							<VectorWrapper
								key={node.id}
								node={node as _VectorNode}
							/>
						))}
					</Group>
				</Space>
			</div>
		);
	})
);

export interface IVectorWrapperProps {
	node: _VectorNode;
}

export const VectorWrapper = observer(
	forwardRef<Vector, IVectorWrapperProps>(({ node }, ref) => {
		const { x, y, z } = node.outputPorts.result.value;
		const { x: ox, y: oy, z: oz } = node.inputPorts.origin.value;
		const innerRef = useRef<Vector>(null);

		// @ts-ignore
		useImperativeHandle(ref, () => innerRef.current);

		useEffect(() => {
			const { x, y, z } = node.outputPorts.result.value;
			const vector = new THREE.Vector3(x, y, z);
			innerRef.current?.move(vector);
		}, [
			node.outputPorts.result.value.x,
			node.outputPorts.result.value.y,
			node.outputPorts.result.value.z,
		]);

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
