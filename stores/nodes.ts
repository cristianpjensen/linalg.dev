import create from "zustand";
import { persist } from "zustand/middleware";
import {
	Edge,
	Node,
	addEdge,
	OnNodesChange,
	OnEdgesChange,
	OnConnect,
	applyNodeChanges,
	applyEdgeChanges,
} from "react-flow-renderer/nocss";

import { getAllIndices, getHandleType } from "../src/nodes/helpers";

type NodeState = {
	nodes: Node[];
	edges: Edge[];
	onNodesChange: OnNodesChange;
	onEdgesChange: OnEdgesChange;
	deleteEdge: (target: string, targetHandle: string) => void;
	onConnect: OnConnect;
	setNodeData: <T extends object>(
		nodeId: string,
		changes: Partial<T>
	) => void;
	updateChildren: (nodeId: string, sourceHandle: string, value: any) => void;
};

const useStore = create(
	persist<NodeState>(
		(set, get) => ({
			nodes: [],
			edges: [],
			onNodesChange: (changes) => {
				set({
					nodes: applyNodeChanges(changes, get().nodes),
				});
			},
			onEdgesChange: (changes) => {
				changes.forEach((change) => {
					// If an edge gets removed, disconnect the target handle
					if (change.type === "remove") {
						const edge = get().edges.find(
							(edge) => edge.id === change.id
						);

						if (edge) {
							const target = edge.target;
							const targetHandle = edge.targetHandle;
							const node = get().nodes.find(
								(node) => node.id === target
							);

							if (node && targetHandle) {
								const value = node.data[targetHandle].value;

								// Disconnect target handle
								get().setNodeData(target, {
									[targetHandle]: {
										isConnected: false,
										value,
									},
								});
							}
						}
					}
				});

				set({
					edges: applyEdgeChanges(changes, get().edges),
				});
			},
			deleteEdge: (target, targetHandle) => {
				set({
					edges: get().edges.filter(
						(edge) =>
							edge.target !== target ||
							edge.targetHandle !== targetHandle
					),
				});

				const node = get().nodes.find((node) => node.id === target);

				if (node) {
					// Reset origin on disconnect
					if (targetHandle === "origin") {
						get().setNodeData(target, {
							origin: {
								isConnected: false,
								value: {
									x: 0,
									y: 0,
									z: 0,
								},
							},
						});
					} else {
						const value = node.data[targetHandle].value;

						get().setNodeData(target, {
							[targetHandle]: {
								isConnected: false,
								value,
							},
						});
					}
				}
			},
			onConnect: (connection) => {
				const { source, sourceHandle, target, targetHandle } =
					connection;
				const edges = get().edges;

				// Do not allow a node to connect with itself
				if (source === target) {
					return;
				}

				// Only allow one connection per source handle
				if (
					edges.some(
						(edge) =>
							edge.targetHandle === targetHandle &&
							edge.target === target
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

				if (
					source &&
					sourceHandle &&
					sourceNode &&
					targetHandle &&
					targetNode
				) {
					// Only connect, if the handles are both of the same type
					if (
						getHandleType(sourceNode.data.output[sourceHandle]) ===
						getHandleType(targetNode.data[targetHandle].value)
					) {
						set({
							edges: addEdge(connection, get().edges),
						});
					}

					get().updateChildren(
						source,
						sourceHandle,
						sourceNode.data.output[sourceHandle]
					);
				}
			},
			setNodeData: (nodeId, changes) => {
				set({
					nodes: get().nodes.map((node) => {
						if (node.id === nodeId) {
							return {
								...node,
								data: { ...node.data, ...changes },
							};
						} else {
							return node;
						}
					}),
				});
			},
			updateChildren: (nodeId, sourceHandle, value) => {
				// Get all connected children
				const childrenEdges = get().edges.filter((edge) => {
					return (
						edge.source === nodeId &&
						edge.sourceHandle === sourceHandle
					);
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

						const edgeIndices = getAllIndices(
							childrenEdges,
							(edge) => edge.target === node.id
						);

						const newData = { ...node.data };

						edgeIndices.forEach((index) => {
							const edge = childrenEdges[index];

							if (edge.targetHandle) {
								newData[edge.targetHandle] = {
									isConnected: true,
									value,
								};
							}
						});

						// Only update the reference to the node if the data was changed
						// in some way
						if (edgeIndices.length > 0) {
							return { ...node, data: newData };
						}

						return node;
					}),
				});
			},
		}),
		{
			name: "nodes",
			getStorage: () => localStorage,
		}
	)
);

export default useStore;
