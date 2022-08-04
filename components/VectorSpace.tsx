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
import { mergeRefs } from "react-merge-refs";
import { type Node } from "react-flow-renderer/nocss";
import { useWindowSize } from "@react-hook/window-size";

import { Group, Space, Vector } from "./three";
import { useEditorStore, useNodeStore } from "../stores";
import { VectorData, Vector as _Vector, EigenvectorsData } from "./nodes/types";

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
	const selectedVectorNode = useEditorStore(
		(state) => state.selectedVectorNode
	);
	const selectedVectorFrom = useEditorStore(
		(state) => state.selectedVectorFrom
	);

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

	useEffect(() => {
		if (selectedVectorNode && selectedVectorFrom === "editor") {
			const { x, y, z } = selectedVectorNode.data as VectorData;
			const vector = { x: x.value, y: y.value, z: z.value };

			if (vector.x === 0 && vector.y === 0 && vector.z === 0) {
				return;
			}

			const norm = Math.sqrt(
				vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
			);
			const multipliedVector = {
				x: (vector.x / norm) * (norm + 2),
				y: (vector.y / norm) * (norm + 2),
				z: (vector.z / norm) * (norm + 2),
			};

			spaceRef.current?.moveCamera(
				multipliedVector.x,
				multipliedVector.y,
				multipliedVector.z
			);
		}
	}, [selectedVectorNode, selectedVectorFrom]);

	const [width, height] = useWindowSize();

	return (
		<div className="absolute right-0 z-30 border-l-4 border-zinc-600">
			<Space
				ref={spaceRef}
				width={width / vectorSpaceSize}
				height={height}
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

	const eigenvectors = nodes.filter(
		(node) => node.type === "eigenvectors"
	) as Node<EigenvectorsData>[];

	return (
		<Group ref={ref}>
			{vectors.map((node) => (
				<VectorWrapper key={node.id} node={node} />
			))}

			{eigenvectors.map((node) => (
				<EigenvectorsWrapper key={node.id} node={node} />
			))}
		</Group>
	);
});

type IVectorWrapperProps = {
	node: Node<VectorData>;
};

const VectorWrapper = forwardRef<Vector, IVectorWrapperProps>(
	({ node }, ref) => {
		const matrix = useEditorStore((state) => state.matrix);
		const isMatrixReset = useEditorStore((state) => state.isMatrixReset);
		const setSelectedVectorNode = useEditorStore(
			(state) => state.setSelectedVectorNode
		);

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

		// If reseting, move the vector to its untransformed position
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
				setSelectedVectorNode(node, "space");
			};

			return (
				<Vector
					ref={mergeRefs([innerRef, ref])}
					origin={new THREE.Vector3(ox, oy, oz)}
					vector={new THREE.Vector3(x, y, z)}
					onClick={onClick}
				/>
			);
		}, []);

		return vectorComponent;
	}
);

type IEigenvectorsWrapperProps = {
	node: Node<EigenvectorsData>;
};

const EigenvectorsWrapper = forwardRef<Group, IEigenvectorsWrapperProps>(
	({ node }, ref) => {
		const matrix = useEditorStore((state) => state.matrix);
		const isMatrixReset = useEditorStore((state) => state.isMatrixReset);

		const { x: x1, y: y1, z: z1 } = node.data.output.eigenvector1;
		const { x: x2, y: y2, z: z2 } = node.data.output.eigenvector2;
		const { x: x3, y: y3, z: z3 } = node.data.output.eigenvector3;
		const innerRef1 = useRef<Vector>(null);
		const innerRef2 = useRef<Vector>(null);
		const innerRef3 = useRef<Vector>(null);

		const moveVectors = useCallback(
			(vector1: _Vector, vector2: _Vector, vector3: _Vector) => {
				const { x: x1, y: y1, z: z1 } = vector1;
				const { x: x2, y: y2, z: z2 } = vector2;
				const { x: x3, y: y3, z: z3 } = vector3;

				const vec1 = new THREE.Vector3(x1, y1, z1).applyMatrix3(matrix);
				const vec2 = new THREE.Vector3(x2, y2, z2).applyMatrix3(matrix);
				const vec3 = new THREE.Vector3(x3, y3, z3).applyMatrix3(matrix);

				innerRef1.current?.move(vec1);
				innerRef2.current?.move(vec2);
				innerRef3.current?.move(vec3);
			},
			[]
		);

		useImperativeHandle(ref, () => ({
			move: () => {},
			moveOrigin: () => {},
			transform: (matrix: THREE.Matrix3) => {
				innerRef1.current?.transform(matrix);
				innerRef2.current?.transform(matrix);
				innerRef3.current?.transform(matrix);
			},
		}));

		useEffect(() => {
			moveVectors(
				node.data.output.eigenvector1,
				node.data.output.eigenvector2,
				node.data.output.eigenvector3
			);
		}, [
			node.data.output.eigenvector1,
			node.data.output.eigenvector2,
			node.data.output.eigenvector3,
		]);

		// If reseting, move the vectors to their untransformed position
		useEffect(() => {
			if (isMatrixReset) {
				moveVectors(
					node.data.output.eigenvector1,
					node.data.output.eigenvector2,
					node.data.output.eigenvector3
				);
			}
		}, [isMatrixReset]);

		const vectorComponent = useMemo(() => {
			return (
				<>
					<Vector
						ref={innerRef1}
						vector={new THREE.Vector3(x1, y1, z1)}
						color="#e16bf2"
					/>
					<Vector
						ref={innerRef2}
						vector={new THREE.Vector3(x2, y2, z2)}
						color="#e16bf2"
					/>
					<Vector
						ref={innerRef3}
						vector={new THREE.Vector3(x3, y3, z3)}
						color="#e16bf2"
					/>
				</>
			);
		}, []);

		return vectorComponent;
	}
);
