import { Node, Edge } from "reactflow";

export const defaultNodes: Node[] = [
	{
		width: 192,
		height: 288,
		type: "vector",
		id: "1665250027064-17",
		position: {
			x: 324,
			y: 804,
		},
		dragHandle: ".dragger",
		data: {
			x: {
				value: 1,
				isConnected: false,
			},
			y: {
				value: 1,
				isConnected: false,
			},
			z: {
				value: 1,
				isConnected: false,
			},
			origin: {
				value: {
					x: 0,
					y: 0,
					z: 0,
				},
				isConnected: false,
			},
			hidden: false,
			representation: "global",
			color: "#1BD9D3",
			output: {
				result: {
					x: 1,
					y: 1,
					z: 1,
				},
			},
		},
		selected: false,
		positionAbsolute: {
			x: 324,
			y: 804,
		},
		dragging: false,
	},
	{
		width: 192,
		height: 288,
		type: "vector",
		id: "1665250026472-7",
		position: {
			x: 324,
			y: 468,
		},
		dragHandle: ".dragger",
		data: {
			x: {
				value: -3,
				isConnected: false,
			},
			y: {
				value: 2,
				isConnected: false,
			},
			z: {
				value: -4,
				isConnected: false,
			},
			origin: {
				value: {
					x: 0,
					y: 0,
					z: 0,
				},
				isConnected: false,
			},
			hidden: false,
			representation: "global",
			color: "#6971D2",
			output: {
				result: {
					x: -3,
					y: 2,
					z: -4,
				},
			},
		},
		selected: false,
		positionAbsolute: {
			x: 324,
			y: 468,
		},
		dragging: false,
	},
	{
		width: 240,
		height: 264,
		type: "plane",
		id: "1665250023359-60",
		position: {
			x: 660,
			y: 492,
		},
		dragHandle: ".dragger",
		data: {
			point: {
				isConnected: true,
				value: {
					x: 1,
					y: 2,
					z: 3,
				},
			},
			direction1: {
				isConnected: true,
				value: {
					x: -3,
					y: 2,
					z: -4,
				},
			},
			direction2: {
				isConnected: true,
				value: {
					x: 1,
					y: 1,
					z: 1,
				},
			},
			hidden: false,
			color: "#CC6C6C",
		},
		selected: false,
		positionAbsolute: {
			x: 660,
			y: 492,
		},
		dragging: false,
	},
	{
		width: 264,
		height: 264,
		type: "matrix",
		id: "1665250019820-49",
		position: {
			x: 900,
			y: 852,
		},
		dragHandle: ".dragger",
		data: {
			m1: {
				value: {
					x: 1,
					y: 0,
					z: 1.41,
				},
				isConnected: false,
			},
			m2: {
				value: {
					x: -2,
					y: 1.772453850905516,
					z: 0,
				},
				isConnected: false,
			},
			m3: {
				value: {
					x: 0,
					y: 2,
					z: 1,
				},
				isConnected: false,
			},
			output: {
				result: [1, 0, 1.41, -2, 1.772453850905516, 0, 0, 2, 1],
			},
		},
		selected: false,
		positionAbsolute: {
			x: 900,
			y: 852,
		},
		dragging: false,
	},
	{
		width: 192,
		height: 288,
		type: "vector",
		id: "1665250013973-50",
		position: {
			x: 324,
			y: 132,
		},
		dragHandle: ".dragger",
		data: {
			x: {
				value: 1,
				isConnected: false,
			},
			y: {
				value: 2,
				isConnected: false,
			},
			z: {
				value: 3,
				isConnected: false,
			},
			origin: {
				value: {
					x: 0,
					y: 0,
					z: 0,
				},
				isConnected: false,
			},
			hidden: false,
			representation: "global",
			color: "#1FE627",
			output: {
				result: {
					x: 1,
					y: 2,
					z: 3,
				},
			},
		},
		selected: false,
		positionAbsolute: {
			x: 324,
			y: 132,
		},
		dragging: false,
	},
];

export const defaultEdges: Edge[] = [
	{
		source: "1659659150256-24",
		sourceHandle: "result",
		target: "1659659163344-78",
		targetHandle: "m1",
		id: "reactflow__edge-1659659150256-24result-1659659163344-78m1",
	},
	{
		source: "1659659150256-24",
		sourceHandle: "result",
		target: "1659659694574-88",
		targetHandle: "m1",
		id: "reactflow__edge-1659659150256-24result-1659659694574-88m1",
	},
	{
		source: "1659697075354-41",
		sourceHandle: "result",
		target: "1659697132992-85",
		targetHandle: "matrix",
		id: "reactflow__edge-1659697075354-41result-1659697132992-85matrix",
	},
	{
		source: "1665250013973-50",
		sourceHandle: "result",
		target: "1665250023359-60",
		targetHandle: "point",
		id: "reactflow__edge-1665250013973-50result-1665250023359-60point",
		selected: false,
	},
	{
		source: "1665250026472-7",
		sourceHandle: "result",
		target: "1665250023359-60",
		targetHandle: "direction1",
		id: "reactflow__edge-1665250026472-7result-1665250023359-60direction1",
		selected: false,
	},
	{
		source: "1665250027064-17",
		sourceHandle: "result",
		target: "1665250023359-60",
		targetHandle: "direction2",
		id: "reactflow__edge-1665250027064-17result-1665250023359-60direction2",
		selected: false,
	},
];
