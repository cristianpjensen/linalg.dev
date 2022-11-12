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
	EdgeSelectionChange,
} from "reactflow";

import { getAllIndices, getHandleType } from "../src/nodes/helpers";
import { defaultEdges, defaultNodes } from "./defaultNodes";

type Environment = {
	title: string;
	nodes: Array<Node>;
	edges: Array<Edge>;
};

type NodeState = {
	envs: Array<Environment>;
	currentEnv: number;
	setCurrentEnv: (env: number) => void;
	addEnv: (
		title: string,
		env: { nodes: Array<Node>; edges: Array<Edge> } | null
	) => void;
	removeEnv: (env: number) => void;
	renameEnv: (env: number, title: string) => void;
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
			envs: [
				{
					title: "Your first environment",
					nodes: defaultNodes,
					edges: defaultEdges,
				},
			],
			currentEnv: 0,
			setCurrentEnv: (env) => set({ currentEnv: env }),
			addEnv: (title, env) => {
				set((state) => ({
					envs: [
						...state.envs,
						{
							title,
							nodes: env ? env.nodes : defaultNodes,
							edges: env ? env.edges : defaultEdges,
						},
					],
				}));
			},
			removeEnv: (env) => {
				if (get().currentEnv === env) {
					return;
				}

				set((state) => ({
					currentEnv:
						env < state.currentEnv
							? state.currentEnv - 1
							: state.currentEnv,
					envs: state.envs.filter((_, index) => index !== env),
				}));
			},
			renameEnv: (env, title) => {
				set((state) => {
					const newEnvs = [...state.envs];
					newEnvs[env].title = title;
					return { envs: newEnvs };
				});
			},
			onNodesChange: (changes) => {
				const { envs, currentEnv } = get();
				const edges = envs[currentEnv].edges;

				for (const change of changes) {
					// Disconnect all connected targets before removing the nodes,
					// otherwise they won't be able to reconnect
					if (change.type === "remove") {
						for (const edge of edges) {
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
						for (const edge of edges) {
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
						const edge = edges.find(
							(edge) => edge.id === selection.id
						);

						if (edge && selection.selected === false) {
							for (let i = 0; i < array.length; i++) {
								if (i === index) {
									continue;
								}

								const otherEdge = edges.find(
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
					envs[currentEnv].edges = applyEdgeChanges(
						deduplicatedEdgeSelections,
						envs[currentEnv].edges
					);

					set({ envs: envs.map((env) => ({ ...env })) });
				}, 10);

				envs[currentEnv].nodes = applyNodeChanges(
					changes,
					envs[currentEnv].nodes
				);

				set({ envs: envs.map((env) => ({ ...env })) });
			},
			onEdgesChange: (changes) => {
				const { envs, currentEnv } = get();
				const nodes = envs[currentEnv].nodes;
				const edges = envs[currentEnv].edges;

				changes.forEach((change) => {
					// If an edge gets removed, disconnect the target handle
					if (change.type === "remove") {
						const edge = edges.find(
							(edge) => edge.id === change.id
						);

						if (edge) {
							const target = edge.target;
							const targetHandle = edge.targetHandle;
							const node = nodes.find(
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

				envs[currentEnv].edges = applyEdgeChanges(
					changes,
					envs[currentEnv].edges
				);

				set({ envs: envs.map((env) => ({ ...env })) });
			},
			deleteEdge: (target, targetHandle) => {
				const { envs, currentEnv } = get();

				envs[currentEnv] = {
					...envs[currentEnv],
					edges: envs[currentEnv].edges.filter(
						(edge) => edge.id !== edge?.id
					),
				};

				set({ envs: envs.map((env) => ({ ...env })) });

				const node = envs[currentEnv].nodes.find(
					(node) => node.id === target
				);

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
				const { envs, currentEnv } = get();
				const nodes = envs[currentEnv].nodes;
				const edges = envs[currentEnv].edges;

				const { source, sourceHandle, target, targetHandle } =
					connection;

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

				const sourceNode = nodes.find(
					(node) => source && node.id === source
				);
				const targetNode = nodes.find(
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
						envs[currentEnv].edges = addEdge(connection, edges);
						set({ envs: envs.map((env) => ({ ...env })) });
					}

					get().updateChildren(
						source,
						sourceHandle,
						sourceNode.data.output[sourceHandle]
					);
				}
			},
			setNodeData: (nodeId, changes) => {
				const { envs, currentEnv } = get();

				envs[currentEnv].nodes = envs[currentEnv].nodes.map((node) => {
					if (node.id === nodeId) {
						return {
							...node,
							data: { ...node.data, ...changes },
						};
					} else {
						return node;
					}
				});

				set({ envs: envs.map((env) => ({ ...env })) });
			},
			updateChildren: (nodeId, sourceHandle, value) => {
				const { envs, currentEnv } = get();
				const edges = envs[currentEnv].edges;

				// Get all connected children
				const childrenEdges = edges.filter((edge) => {
					return (
						edge.source === nodeId &&
						edge.sourceHandle === sourceHandle
					);
				});

				// Update the value of all children
				envs[currentEnv].nodes = envs[currentEnv].nodes.map((node) => {
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
				});

				set({ envs: envs.map((env) => ({ ...env })) });
			},
		}),
		{
			name: "nodes",
			getStorage: () => localStorage,
		}
	)
);

export default useStore;
