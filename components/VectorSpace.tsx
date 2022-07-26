import { observer } from "mobx-react-lite";
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react";
import * as THREE from "three";
import { CubeIcon, ResetIcon } from "@radix-ui/react-icons";
import {
	Selection,
	EffectComposer,
	Outline,
} from "@react-three/postprocessing";
import { mergeRefs } from "react-merge-refs";

import {
	Context as _NodeContext,
	VectorNode as _VectorNode,
	EigenvectorsNode as _EigenvectorsNode,
	TransformNode as _TransformNode,
	Vector as _Vector,
	NodeType,
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

		const showCube = () => {
			editor.showCube = !editor.showCube;
		};

		return (
			<div className="border-l-4 border-zinc-600">
				<Space
					ref={spaceRef}
					width={window.innerWidth / editor.vectorSpaceSize}
					showCube={editor.showCube}
				>
					<Vectors ref={groupRef} context={context} editor={editor} />
				</Space>

				<div className="absolute flex gap-4 right-4 bottom-4">
					<button
						onClick={showCube}
						className={
							"flex items-center justify-center w-8 h-8 rounded bg-zinc-900 text-zinc-100 shadow-b1 transition-all " +
							(editor.showCube
								? "shadow-zinc-400 opacity-100"
								: "shadow-zinc-700 opacity-60")
						}
					>
						<CubeIcon />
					</button>

					<button
						onClick={reset}
						className="flex items-center justify-center w-8 h-8 rounded bg-zinc-900 text-zinc-100 shadow-b1 shadow-zinc-400 focus:shadow-b2"
					>
						<ResetIcon />
					</button>
				</div>
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

		const eigenvectors = Array.from(context.nodes.values()).filter(
			(node) => node.type === NodeType.EIGENVECTORS
		);

		const transformVectors = Array.from(context.nodes.values()).filter(
			(node) => node.type === NodeType.TRANSFORM
		);

		return (
			<Selection>
				<EffectComposer autoClear={false}>
					<Outline
						edgeStrength={2}
						visibleEdgeColor={0x999999}
						blur
					/>
				</EffectComposer>

				<Group ref={ref}>
					{vectors.map((node) => (
						<VectorWrapper
							key={node.id}
							node={node as _VectorNode}
							editor={editor}
						/>
					))}

					{eigenvectors.map((node) => (
						<EigenvectorsWrapper
							key={node.id}
							node={node as _EigenvectorsNode}
							editor={editor}
						/>
					))}

					{transformVectors.map((node) => (
						<TransformvectorWrapper
							key={node.id}
							node={node as _TransformNode}
							editor={editor}
						/>
					))}
				</Group>
			</Selection>
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

				const { x: ox, y: oy, z: oz } = node.inputPorts.origin.value;
				innerRef.current?.moveOrigin(new THREE.Vector3(ox, oy, oz));
			}
		}, [editor.currentMatrixReset]);

		// Memoize the vector component, so that it is only created once and not
		// re-rendered every time, which makes it not animate on move
		const vectorComponent = useMemo(() => {
			const onClick = () => {
				editor.selectedNode = node;
			};

			return (
				<Vector
					ref={mergeRefs([innerRef, ref])}
					origin={new THREE.Vector3(ox, oy, oz)}
					vector={new THREE.Vector3(x, y, z)}
					outlined={editor.selectedNode === node}
					onClick={onClick}
				/>
			);
		}, [editor.selectedNode]);

		return vectorComponent;
	})
);

export interface ITransformvectorWrapperProps {
	node: _TransformNode;
	editor: EditorContext;
}

export const TransformvectorWrapper = observer(
	forwardRef<Vector, ITransformvectorWrapperProps>(
		({ node, editor }, ref) => {
			const { x, y, z } = node.outputPorts.result.value;

			const origin = {
				x: 0,
				y: 0,
				z: 0,
			};

			// Get origin from the input vector node
			if (
				node.inputPorts.vector.connections.length !== 0 &&
				node.inputPorts.vector.connections[0].fromPort.node.inputPorts
					.origin
			) {
				// Multiply the origin by the matrix
				const m = node.inputPorts.matrix.value;
				const o =
					node.inputPorts.vector.connections[0].fromPort.node
						.inputPorts.origin.value;

				origin.x = o.x;
				origin.y = o.y;
				origin.z = o.z;
			}

			const innerRef = useRef<Vector>(null);

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

			// Move origin when origin port of the connected node changes
			useEffect(() => {
				const { x, y, z } = origin;
				const originVector = new THREE.Vector3(x, y, z).applyMatrix3(
					editor.currentMatrix
				);

				const matrix = node.inputPorts.matrix.value;
				const mat = new THREE.Matrix3().fromArray(matrix).transpose();
				originVector.applyMatrix3(mat);

				innerRef.current?.moveOrigin(originVector);
			}, [origin.x, origin.y, origin.z]);

			// If reseting, move the vector to its non-transformed position
			useEffect(() => {
				if (editor.currentMatrixReset) {
					const { x, y, z } = node.outputPorts.result.value;
					innerRef.current?.move(new THREE.Vector3(x, y, z));

					const { x: ox, y: oy, z: oz } = origin;
					const matrix = node.inputPorts.matrix.value;
					const mat = new THREE.Matrix3()
						.fromArray(matrix)
						.transpose();
					const originVector = new THREE.Vector3(
						ox,
						oy,
						oz
					).applyMatrix3(mat);

					innerRef.current?.moveOrigin(originVector);
				}
			}, [editor.currentMatrixReset]);

			// Memoize the vector component, so that it is only created once and not
			// re-rendered every time, which makes it not animate on move
			const vectorComponent = useMemo(() => {
				const onClick = () => {
					editor.selectedNode = node;
				};

				const matrix = node.inputPorts.matrix.value;
				const mat = new THREE.Matrix3().fromArray(matrix).transpose();
				const originVector = new THREE.Vector3(
					origin.x,
					origin.y,
					origin.z
				).applyMatrix3(mat);

				return (
					<Vector
						ref={mergeRefs([innerRef, ref])}
						origin={originVector}
						vector={new THREE.Vector3(x, y, z)}
						outlined={editor.selectedNode === node}
						onClick={onClick}
						color="cornflowerblue"
					/>
				);
			}, [editor.selectedNode]);

			if (!node.inputPorts.vector.isConnected) {
				return null;
			}

			return vectorComponent;
		}
	)
);

export interface IEigenvectorsWrapperProps {
	node: _EigenvectorsNode;
	editor: EditorContext;
}

export const EigenvectorsWrapper = observer(
	forwardRef<Vector, IEigenvectorsWrapperProps>(({ node, editor }, ref) => {
		const { x: x1, y: y1, z: z1 } = node.outputPorts.v1.value;
		const { x: x2, y: y2, z: z2 } = node.outputPorts.v2.value;
		const { x: x3, y: y3, z: z3 } = node.outputPorts.v3.value;
		const ref1 = useRef<Vector>(null);
		const ref2 = useRef<Vector>(null);
		const ref3 = useRef<Vector>(null);

		useImperativeHandle(ref, () => ({
			move: () => {},
			moveOrigin: () => {},
			transform: (matrix: THREE.Matrix3) => {
				ref1.current?.transform(matrix);
				ref2.current?.transform(matrix);
				ref3.current?.transform(matrix);
			},
		}));

		// Move vectors when they change
		useEffect(() => {
			const { x: x1, y: y1, z: z1 } = node.outputPorts.v1.value;
			const { x: x2, y: y2, z: z2 } = node.outputPorts.v2.value;
			const { x: x3, y: y3, z: z3 } = node.outputPorts.v3.value;

			const vector1 = new THREE.Vector3(x1, y1, z1).applyMatrix3(
				editor.currentMatrix
			);
			const vector2 = new THREE.Vector3(x2, y2, z2).applyMatrix3(
				editor.currentMatrix
			);
			const vector3 = new THREE.Vector3(x3, y3, z3).applyMatrix3(
				editor.currentMatrix
			);

			ref1.current?.move(vector1);
			ref2.current?.move(vector2);
			ref3.current?.move(vector3);
		}, [
			node.outputPorts.v1.value.x,
			node.outputPorts.v1.value.y,
			node.outputPorts.v1.value.z,
			node.outputPorts.v2.value.x,
			node.outputPorts.v2.value.y,
			node.outputPorts.v2.value.z,
			node.outputPorts.v3.value.x,
			node.outputPorts.v3.value.y,
			node.outputPorts.v3.value.z,
		]);

		// If reseting, move the vectors to their non-transformed positions
		useEffect(() => {
			if (editor.currentMatrixReset) {
				const { x: x1, y: y1, z: z1 } = node.outputPorts.v1.value;
				const { x: x2, y: y2, z: z2 } = node.outputPorts.v2.value;
				const { x: x3, y: y3, z: z3 } = node.outputPorts.v3.value;

				ref1.current?.move(new THREE.Vector3(x1, y1, z1));
				ref2.current?.move(new THREE.Vector3(x2, y2, z2));
				ref3.current?.move(new THREE.Vector3(x3, y3, z3));
			}
		}, [editor.currentMatrixReset]);

		// Memoize the vector components, so that it is only created once and not
		// re-rendered every time, which makes it not animate on move
		const vectorComponent = useMemo(() => {
			const onClick = () => {
				editor.selectedNode = node;
			};

			return (
				<>
					<Vector
						ref={ref1}
						vector={new THREE.Vector3(x1, y1, z1)}
						outlined={editor.selectedNode === node}
						onClick={onClick}
						color="#e16bf2"
					/>
					<Vector
						ref={ref2}
						vector={new THREE.Vector3(x2, y2, z2)}
						outlined={editor.selectedNode === node}
						onClick={onClick}
						color="#e16bf2"
					/>
					<Vector
						ref={ref3}
						vector={new THREE.Vector3(x3, y3, z3)}
						outlined={editor.selectedNode === node}
						onClick={onClick}
						color="#e16bf2"
					/>
				</>
			);
		}, [editor.selectedNode]);

		if (!node.inputPorts.matrix.isConnected) {
			return null;
		}

		return vectorComponent;
	})
);
