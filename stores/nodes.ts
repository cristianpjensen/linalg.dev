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
	EdgeChange,
	EdgeSelectionChange,
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
				for (const change of changes) {
					// Disconnect all connected targets before removing the nodes,
					// otherwise they won't be able to reconnect
					if (change.type === "remove") {
						for (const edge of get().edges) {
							if (
								edge.source === change.id &&
								edge.targetHandle
							) {
								get().deleteEdge(
									edge.target,
									edge.targetHandle
								);
							}
						}
					}
				}

				// Select all edges connected to the selected nodes
				const edgeSelections: EdgeSelectionChange[] = [];
				for (const change of changes) {
					if (change.type === "select") {
						for (const edge of get().edges) {
							if (
								edge.source === change.id ||
								edge.target === change.id
							) {
								edgeSelections.push({
									id: edge.id,
									type: "select",
									selected: change.selected,
								});
							}
						}
					}
				}

				// Remove all duplicates
				const deduplicatedEdgeSelections = edgeSelections.filter(
					(selection, index, array) => {
						const edge = get().edges.find(
							(edge) => edge.id === selection.id
						);

						if (edge && selection.selected === false) {
							for (let i = 0; i < array.length; i++) {
								if (i === index) {
									continue;
								}

								const otherEdge = get().edges.find(
									(edge) => edge.id === array[i].id
								);

								if (otherEdge && otherEdge.id === edge.id) {
									return false;
								}
							}
						}

						return true;
					}
				);

				// Wait for the onEdgesChange to be called to deselect current
				// edges. Afterward the correct edges will get selected.
				setTimeout(() => {
					set({
						edges: applyEdgeChanges(
							deduplicatedEdgeSelections,
							get().edges
						),
					});
				}, 10);

				set({
					nodes: applyNodeChanges(changes, get().nodes),
				});
			},
			onEdgesChange: (changes) => {
				console.log(changes);

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
					if (node.type === "vector" && targetHandle === "origin") {
						// Reset origin on disconnect
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
					} else if (
						node.type === "plane" &&
						targetHandle === "point"
					) {
						// Reset point of plane on disconnect
						get().setNodeData(target, {
							point: {
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
