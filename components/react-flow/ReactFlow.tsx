import React from "react";
import ReactFlow, { Background, BackgroundVariant } from "react-flow-renderer";

import useStore from "./store";
import nodeTypes from "./nodes/nodeTypes";

const Flow = () => {
	const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
		useStore();

	console.log(nodes);

	return (
		<ReactFlow
			style={{
				position: "absolute",
			}}
			nodeTypes={nodeTypes}
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onConnect={onConnect}
			snapGrid={[16, 16]}
			fitView
			snapToGrid
		>
			<Background variant={BackgroundVariant.Lines} size={1} />
		</ReactFlow>
	);
};

export default Flow;
