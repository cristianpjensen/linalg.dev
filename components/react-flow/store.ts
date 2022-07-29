import create from "zustand";
import {
	Edge,
	Node,
	addEdge,
	OnNodesChange,
	OnEdgesChange,
	OnConnect,
	applyNodeChanges,
	applyEdgeChanges,
} from "react-flow-renderer";

import initialNodes from "./initial/nodes";
import initialEdges from "./initial/edges";

type NodeState = {
	nodes: Node[];
	edges: Edge[];
	onNodesChange: OnNodesChange;
	onEdgesChange: OnEdgesChange;
	onConnect: OnConnect;
	setNodeData: <T>(nodeId: string, data: T) => void;
	updateChildren: (nodeId: string, sourceHandle: string, value: any) => void;
};

const useStore = create<NodeState>((set, get) => ({
	nodes: initialNodes,
	edges: initialEdges,
	onNodesChange: (changes) => {
		set({
			nodes: applyNodeChanges(changes, get().nodes),
		});
	},
	onEdgesChange: (changes) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		});
	},
	onConnect: (connection) => {
		set({
			edges: addEdge(connection, get().edges),
		});
	},
	setNodeData: (nodeId, data) => {
		set({
			nodes: get().nodes.map((node) =>
				node.id === nodeId
					? { ...node, data: { ...node.data, ...data } }
					: node
			),
		});
	},
	updateChildren: (nodeId, sourceHandle, value) => {
		// Get all connected children
		const childrenEdges = get().edges.filter((edge) => {
			return edge.source === nodeId && edge.sourceHandle === sourceHandle;
		});

		// Update the value of all children
		set({
			nodes: get().nodes.map((node) => {
				const edgeIndex = childrenEdges.findIndex(
					(edge) => edge.target === node.id
				);
				if (edgeIndex !== -1) {
					const edge = childrenEdges[edgeIndex];

					if (edge.targetHandle) {
						const dataProperty = edge.targetHandle.split("-")[0];

						return {
							...node,
							data: {
								...node.data,
								[dataProperty]: value,
							},
						};
					}
				}

				return node;
			}),
		});
	},
}));

export default useStore;
