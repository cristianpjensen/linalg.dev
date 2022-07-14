import { useEffect, useRef } from "react";
import { Space, Vector } from "react-three-linalg";
import {
	selector,
	selectorFamily,
	useRecoilBridgeAcrossReactRoots_UNSTABLE,
	useRecoilValue,
} from "recoil";
import * as THREE from "three";
import { ids, vectors } from "../stores/atoms";

const vectorIds = selector({
	key: "vector-ids",
	get: ({ get }) =>
		get(ids)
			.filter((id) => id.type === "vector")
			.map((id) => id.id),
});

const linkedVectors = selectorFamily<
	{ x: number; y: number; z: number },
	number
>({
	key: "linked-vectors",
	get:
		(id) =>
		({ get }) => {
			const node = get(vectors(id));
			return node.vector;
		},
});

export default function VectorSpace() {
	const ids = useRecoilValue(vectorIds);

  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

	return (
		<div style={{ width: window.innerWidth / 2, backgroundColor: "black" }}>
			<Space width={window.innerWidth / 2}>
				<RecoilBridge>
					{ids.map((id) => (
						<VectorWrapper key={id} id={id} />
					))}
				</RecoilBridge>
			</Space>
		</div>
	);
}

interface VectorWrapperProps {
	id: number;
}

function VectorWrapper({ id }: VectorWrapperProps) {
	const ref = useRef<Vector>(null);
	const { x, y, z } = useRecoilValue(linkedVectors(id));

	useEffect(() => {
		const vector = new THREE.Vector3(x, y, z);
		ref.current?.move(vector);
	}, [x, y, z]);

	return <Vector ref={ref} vector={new THREE.Vector3(x, y, z)} />;
}
