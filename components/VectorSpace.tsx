import {
	forwardRef,
	useCallback,
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
import { type Node } from "react-flow-renderer/nocss";

import { Group, Space, Vector } from "./three";
import { useEditorStore, useNodeStore } from "../stores";
import { VectorData, Vector as _Vector } from "./nodes/types";

export type VectorSpace = {
	/**
	 * Transform the entire space.
	 */
	transform: (matrix: THREE.Matrix3) => void;
};

export const VectorSpace = forwardRef<VectorSpace, {}>((props, ref) => {
	const showCube = useEditorStore((state) => state.showCube);
	const vectorSpaceSize = useEditorStore((state) => state.vectorSpaceSize);
	const resetMatrix = useEditorStore((state) => state.resetMatrix);
	const toggleShowCube = useEditorStore((state) => state.toggleShowCube);

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
		resetMatrix();
	};

	return (
		<div className="absolute right-0 z-30 border-l-4 border-zinc-600">
			<Space
				ref={spaceRef}
				width={window.innerWidth / vectorSpaceSize}
				showCube={showCube}
			>
				<Vectors ref={groupRef} />
			</Space>

			<div className="absolute flex gap-4 right-4 bottom-4">
				<button
					onClick={toggleShowCube}
					className={
						"flex items-center justify-center w-8 h-8 rounded bg-zinc-900 text-zinc-100 shadow-b1 transition-all " +
						(showCube
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
});

const Vectors = forwardRef<Group, {}>((props, ref) => {
	const nodes = useNodeStore((state) => state.nodes);
	const vectors = nodes.filter(
		(node) => node.type === "vector"
	) as Node<VectorData>[];

	return (
		<Selection>
			<EffectComposer autoClear={false}>
				<Outline edgeStrength={2} visibleEdgeColor={0x999999} blur />
			</EffectComposer>

			<Group ref={ref}>
				{vectors.map((node) => (
					<VectorWrapper key={node.id} node={node} />
				))}
			</Group>
		</Selection>
	);
});

type IVectorWrapperProps = {
	node: Node<VectorData>;
};

export const VectorWrapper = forwardRef<Vector, IVectorWrapperProps>(
	({ node }, ref) => {
		const matrix = useEditorStore((state) => state.matrix);
		const isMatrixReset = useEditorStore((state) => state.isMatrixReset);

		const { x, y, z } = node.data.output.result;
		const { x: ox, y: oy, z: oz } = node.data.origin.value;
		const innerRef = useRef<Vector>(null);

		const moveVector = useCallback((vector: _Vector) => {
			const { x, y, z } = vector;
			const vec = new THREE.Vector3(x, y, z).applyMatrix3(matrix);
			innerRef.current?.move(vec);
		}, []);

		const moveOrigin = useCallback((origin: _Vector) => {
			const { x, y, z } = origin;
			const ori = new THREE.Vector3(x, y, z).applyMatrix3(matrix);
			innerRef.current?.moveOrigin(ori);
		}, []);

		// Move vector when it changes in the editor
		useEffect(() => {
			moveVector(node.data.output.result);
		}, [node.data.output.result]);

		// Move origin when it changes in the editor
		useEffect(() => {
			moveOrigin(node.data.origin.value);
		}, [node.data.origin.value]);

		// If reseting, move the vector to its non-transformed position
		useEffect(() => {
			if (isMatrixReset) {
				moveVector(node.data.output.result);
				moveOrigin(node.data.origin.value);
			}
		}, [isMatrixReset]);

		// Memoize the vector component, so that it is only created once and not
		// re-rendered every time, which makes it not animate on move
		const vectorComponent = useMemo(() => {
			const onClick = () => {
				// TODO: Select the vector.
			};

			return (
				<Vector
					ref={mergeRefs([innerRef, ref])}
					origin={new THREE.Vector3(ox, oy, oz)}
					vector={new THREE.Vector3(x, y, z)}
					outlined={node.selected}
					onClick={onClick}
				/>
			);
		}, [node.selected]);

		return vectorComponent;
	}
);
