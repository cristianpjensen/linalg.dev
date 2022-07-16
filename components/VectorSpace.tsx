import { observer } from "mobx-react-lite";
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

const VectorSpace = observer(({ context }: IVectorSpaceProps) => {
	const vectors = Array.from(context.nodes.values()).filter(
		(node) => node.type === NodeType.VECTOR
	);

	return (
		<Space width={window.innerWidth / 3}>
			{vectors.map((node) => (
				<VectorWrapper key={node.id} node={node as _VectorNode} />
			))}
		</Space>
	);
});

export default VectorSpace;

interface VectorWrapperProps {
	node: _VectorNode;
}

const VectorWrapper = observer(({ node }: VectorWrapperProps) => {
	const { x, y, z } = node.outputPorts.result.value;
	const origin = node.inputPorts.origin.value;

	const ref = useRef<Vector>(null);

	useEffect(() => {
		const { x, y, z } = node.outputPorts.result.value;
		const vector = new THREE.Vector3(x, y, z);
		ref.current?.move(vector);
	});

	return (
		<Vector
			ref={ref}
			origin={new THREE.Vector3(origin.x, origin.y, origin.z)}
			vector={new THREE.Vector3(x, y, z)}
		/>
	);
});
