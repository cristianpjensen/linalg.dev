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
import { getHandleType } from "./helpers";

type NodeState = {
	nodes: Node[];
	edges: Edge[];
	onNodesChange: OnNodesChange;
	onEdgesChange: OnEdgesChange;
	onConnect: OnConnect;
	setNodeData: <T>(nodeId: string, data: T) => void;
	updateChildren: (nodeId: string, sourceHandle: string, value: any) => void;
	isConnected: (nodeId: string, targetHandle: string) => boolean;
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
		const { source, sourceHandle, target, targetHandle } = connection;
		const edges = get().edges;

		// Only allow one connection per source handle
		if (
			edges.some(
				(edge) =>
					edge.targetHandle === targetHandle && edge.target === target
			)
		) {
			return;
		}

		const sourceNode = get().nodes.find(
			(node) => source && node.id === source
		);
		const targetNode = get().nodes.find(
			(node) => target && node.id === target
		);

		if (sourceHandle && sourceNode && targetHandle && targetNode) {
			// Only connect, if the handles are both of the same type
			if (
				getHandleType(sourceNode.data.output[sourceHandle]) ===
				getHandleType(targetNode.data[targetHandle])
			) {
				set({
					edges: addEdge(connection, get().edges),
				});
			}
		}
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
				// Update the node itself aswell
				if (node.id === nodeId) {
					// Do not update the reference to the node, because it will
					// otherwise result in an infinite loop of useOutput
					// reacting to data changing and then changing the data in
					// here
					node.data.output[sourceHandle] = value;
					return node;
				}

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
	isConnected(nodeId, targetHandle) {
		return get().edges.some((edge) => {
			return edge.target === nodeId && edge.targetHandle === targetHandle;
		});
	},
}));

export default useStore;
