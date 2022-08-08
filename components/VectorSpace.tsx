import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import * as THREE from "three";
import { CubeIcon, ResetIcon, ShadowInnerIcon } from "@radix-ui/react-icons";
import { mergeRefs } from "react-merge-refs";
import { type Node } from "react-flow-renderer/nocss";
import { useWindowSize } from "@react-hook/window-size";

import { Group, Space, Vector } from "./three";
import { useEditorStore, useNodeStore } from "../stores";
import { Vector as _Vector, EigenvectorsData } from "./nodes/types";
import { Tooltip } from "./Tooltip";
import { VectorSpaceIcon } from "./icons";

type MinimalVectorData = {
	origin?: {
		value: {
			x: number;
			y: number;
			z: number;
		};
		isConnected: boolean;
	};
	hidden: boolean;
	representation: "global" | "sphere" | "vector";
	color: string;
	output: {
		result: {
			x: number;
			y: number;
			z: number;
		};
	};
};

export type VectorSpace = {
	/**
	 * Transform the entire space.
	 */
	transform: (matrix: THREE.Matrix3) => void;
};

export const VectorSpace = forwardRef<VectorSpace, {}>((props, ref) => {
	const matrix = useEditorStore((state) => state.matrix);
	const resetMatrix = useEditorStore((state) => state.resetMatrix);
	const showCube = useEditorStore((state) => state.showCube);
	const toggleShowCube = useEditorStore((state) => state.toggleShowCube);
	const showVectorsAsSpheres = useEditorStore(
		(state) => state.showVectorsAsSpheres
	);
	const toggleShowVectorsAsSpheres = useEditorStore(
		(state) => state.toggleShowVectorsAsSpheres
	);
	const showSpaceTransformations = useEditorStore(
		(state) => state.showSpaceTransformations
	);
	const toggleShowSpaceTransformations = useEditorStore(
		(state) => state.toggleShowSpaceTransformations
	);
	const vectorSpaceSize = useEditorStore((state) => state.vectorSpaceSize);
	const selectedVectorNode = useEditorStore(
		(state) => state.selectedVectorNode
	);
	const selectedVectorFrom = useEditorStore(
		(state) => state.selectedVectorFrom
	);

	const spaceRef = useRef<Space>(null);
	const groupRef = useRef<Group>(null);

	useImperativeHandle(ref, () => ({
		transform: (matrix) => {
			if (showSpaceTransformations) {
				spaceRef.current?.transform(matrix);
			}

			groupRef.current?.transform(matrix);
		},
	}));

	const reset = () => {
		spaceRef.current?.reset();
		resetMatrix();
	};

	useEffect(() => {
		if (selectedVectorNode && selectedVectorFrom === "editor") {
			const data = selectedVectorNode.data as MinimalVectorData;

			// Do not show the vector if it is hidden
			if (data.hidden) {
				return;
			}

			const { x, y, z } = data.output.result;
			const vector = new THREE.Vector3(x, y, z).applyMatrix3(matrix);

			if (data.origin) {
				const { x: ox, y: oy, z: oz } = data.origin.value;
				const origin = new THREE.Vector3(ox, oy, oz).applyMatrix3(
					matrix
				);
				vector.add(origin);
			}

			if (vector.x === 0 && vector.y === 0 && vector.z === 0) {
				return;
			}

			const norm = vector.length();
			vector.normalize();
			const multipliedVector = {
				x: vector.x * (norm + 2),
				y: vector.y * (norm + 2),
				z: vector.z * (norm + 2),
			};

			spaceRef.current?.moveCamera(
				multipliedVector.x,
				multipliedVector.y,
				multipliedVector.z
			);
		}
	}, [selectedVectorNode, selectedVectorFrom, matrix]);

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
				<ToggleButton
					tooltip="Show vectors as spheres"
					onClick={toggleShowVectorsAsSpheres}
					active={showVectorsAsSpheres}
				>
					<ShadowInnerIcon />
				</ToggleButton>

				<ToggleButton
					tooltip="Show a cube for better overview of transformations"
					onClick={toggleShowCube}
					active={showCube}
				>
					<CubeIcon />
				</ToggleButton>

				<ToggleButton
					tooltip="Also transform the grid"
					onClick={toggleShowSpaceTransformations}
					active={showSpaceTransformations}
				>
					<VectorSpaceIcon />
				</ToggleButton>

				<ToggleButton
					tooltip="Reset space transformations"
					onClick={reset}
				>
					<ResetIcon />
				</ToggleButton>
			</div>
		</div>
	);
});

VectorSpace.displayName = "Vector space";

type IToggleButtonProps = {
	tooltip: string;
	children?: React.ReactNode;
	active?: boolean;
	onClick?: () => void;
};

const ToggleButton = ({
	tooltip,
	children,
	active = true,
	onClick,
}: IToggleButtonProps) => {
	return (
		<Tooltip tip={tooltip} side="top" dark>
			<button
				onClick={onClick}
				className={
					"flex items-center justify-center w-8 h-8 rounded bg-zinc-900 text-zinc-100 shadow-b1 transition-all " +
					(active
						? "shadow-zinc-400 opacity-100"
						: "shadow-zinc-700 opacity-60")
				}
			>
				{children}
			</button>
		</Tooltip>
	);
};

ToggleButton.displayName = "Toggle button";

const Vectors = forwardRef<Group, {}>((props, ref) => {
	const nodes = useNodeStore((state) => state.nodes);
	const vectors = nodes.filter(
		(node) =>
			node.type === "vector" ||
			node.type === "vectorScaling" ||
			node.type === "transform"
	) as Node<MinimalVectorData>[];

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

Vectors.displayName = "Vectors";

type IVectorWrapperProps = {
	node: Node<MinimalVectorData>;
};

const VectorWrapper = forwardRef<Vector, IVectorWrapperProps>(
	({ node }, ref) => {
		const isMatrixReset = useEditorStore((state) => state.isMatrixReset);
		const setSelectedVectorNode = useEditorStore(
			(state) => state.setSelectedVectorNode
		);
		const showVectorsAsSpheres = useEditorStore(
			(state) => state.showVectorsAsSpheres
		);

		const { x, y, z } = node.data.output.result;
		const origin = node.data.origin ? node.data.origin.value : undefined;

		const innerRef = useRef<Vector>(null);

		const [vec] = useState(new THREE.Vector3(x, y, z));
		const [ori] = useState(
			origin
				? new THREE.Vector3(origin.x, origin.y, origin.z)
				: new THREE.Vector3()
		);

		const move = useCallback((origin: _Vector, vector: _Vector) => {
			if (
				vector.x === vec.x &&
				vector.y === vec.y &&
				vector.z === vec.z &&
				origin.x === ori.x &&
				origin.y === ori.y &&
				origin.z === ori.z
			) {
				return;
			}

			const { x, y, z } = vector;
			const { x: ox, y: oy, z: oz } = origin;
			vec.set(x, y, z);
			ori.set(ox, oy, oz);

			innerRef.current?.move(ori, vec);
		}, []);

		useEffect(() => {
			if (origin) {
				move(origin, node.data.output.result);
			} else {
				move({ x: 0, y: 0, z: 0 }, node.data.output.result);
			}
		}, [node.data.output.result, origin]);

		// If reseting, move the vector to its untransformed position
		useEffect(() => {
			if (isMatrixReset) {
				innerRef.current?.reset();
			}
		}, [isMatrixReset]);

		// Memoize the vector component, so that it is only created once and not
		// re-rendered every time, which makes it not animate on move
		const vectorComponent = useMemo(() => {
			const onClick = () => {
				setSelectedVectorNode(node, "space");
			};

			if (node.data.hidden) {
				return null;
			}

			return (
				<Vector
					ref={mergeRefs([innerRef, ref])}
					color={node.data.color ? node.data.color : "#E9E9E9"}
					origin={
						origin &&
						new THREE.Vector3(origin.x, origin.y, origin.z)
					}
					vector={new THREE.Vector3(x, y, z)}
					sphere={
						node.data.representation === "sphere"
							? true
							: node.data.representation === "vector"
							? false
							: showVectorsAsSpheres
					}
					onClick={onClick}
				/>
			);
		}, [
			showVectorsAsSpheres,
			node.data.hidden,
			node.data.representation,
			node.data.color,
		]);

		return vectorComponent;
	}
);

VectorWrapper.displayName = "Vector wrapper";

type IEigenvectorsWrapperProps = {
	node: Node<EigenvectorsData>;
};

const origin = new THREE.Vector3(0, 0, 0);
const EigenvectorsWrapper = forwardRef<Group, IEigenvectorsWrapperProps>(
	({ node }, ref) => {
		const isMatrixReset = useEditorStore((state) => state.isMatrixReset);

		const { x: x1, y: y1, z: z1 } = node.data.output.eigenvector1;
		const { x: x2, y: y2, z: z2 } = node.data.output.eigenvector2;
		const { x: x3, y: y3, z: z3 } = node.data.output.eigenvector3;
		const innerRef1 = useRef<Vector>(null);
		const innerRef2 = useRef<Vector>(null);
		const innerRef3 = useRef<Vector>(null);

		const [vec1] = useState(new THREE.Vector3(x1, y1, z1));
		const [vec2] = useState(new THREE.Vector3(x2, y2, z2));
		const [vec3] = useState(new THREE.Vector3(x3, y3, z3));

		const moveVectors = useCallback(
			(vector1: _Vector, vector2: _Vector, vector3: _Vector) => {
				const { x: x1, y: y1, z: z1 } = vector1;
				const { x: x2, y: y2, z: z2 } = vector2;
				const { x: x3, y: y3, z: z3 } = vector3;

				if (vec1.x !== x1 || vec1.y !== y1 || vec1.z === z1) {
					innerRef1.current?.move(origin, vec1);
				}

				if (vec2.x !== x2 || vec2.y !== y2 || vec2.z === z2) {
					innerRef2.current?.move(origin, vec2);
				}

				if (vec3.x !== x3 || vec3.y !== y3 || vec3.z === z3) {
					innerRef3.current?.move(origin, vec3);
				}
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
				innerRef1.current?.reset();
				innerRef2.current?.reset();
				innerRef3.current?.reset();
			}
		}, [isMatrixReset]);

		const vectorComponent = useMemo(() => {
			if (node.data.hidden) {
				return null;
			}

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
		}, [node.data.hidden]);

		return vectorComponent;
	}
);

EigenvectorsWrapper.displayName = "Vector wrapper";
