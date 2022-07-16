import { useEffect, useRef } from "react";
import { Space, Vector } from "react-three-linalg";
import * as THREE from "three";

import {
	Context as _NodeContext,
	NodeType,
	VectorNode as _VectorNode,
} from "../node-engine";

interface IVectorSpaceProps {
	context: _NodeContext;
}

export default function VectorSpace({ context }: IVectorSpaceProps) {
	const vectors = Array.from(context.nodes.values()).filter(
		(node) => node.type === NodeType.VECTOR
	);

	return (
		<div style={{ width: window.innerWidth / 2, backgroundColor: "black" }}>
			<Space width={window.innerWidth / 2}>
				{vectors.map((node) => (
					<VectorWrapper key={node.id} node={node as _VectorNode} />
				))}
			</Space>
		</div>
	);
}

interface VectorWrapperProps {
	node: _VectorNode;
}

function VectorWrapper({ node }: VectorWrapperProps) {
	const ref = useRef<Vector>(null);
	const { x, y, z } = node.outputPorts.result.value;

	useEffect(() => {
		const { x, y, z } = node.outputPorts.result.value;
		const vector = new THREE.Vector3(x, y, z);
		ref.current?.move(vector);
	}, [node]);

	return <Vector ref={ref} vector={new THREE.Vector3(x, y, z)} />;
}
