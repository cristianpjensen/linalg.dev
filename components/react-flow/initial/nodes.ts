import type { Node } from "react-flow-renderer/nocss";

export default [
	{
		id: "1",
		type: "constant",
		dragHandle: ".dragger",
		data: {
			value: {
				value: 1,
				isConnected: false,
			},
			output: {
				result: 1,
			},
		},
		position: { x: 12, y: 12 },
	},
	{
		id: "2",
		type: "unaryOperation",
		dragHandle: ".dragger",
		data: {
			value: {
				value: 16,
				isConnected: false,
			},
			operator: "square root",
			output: {
				result: 4,
			},
		},
		position: { x: 228, y: 12 },
	},
	{
		id: "3",
		type: "constant",
		dragHandle: ".dragger",
		data: {
			value: {
				value: 123,
				isConnected: false,
			},
			output: {
				result: 123,
			},
		},
		position: { x: 228, y: 228 },
	},
	{
		id: "4",
		type: "binaryOperation",
		dragHandle: ".dragger",
		data: {
			left: {
				value: 1,
				isConnected: false,
			},
			right: {
				value: 1,
				isConnected: false,
			},
			operator: "add",
			output: {
				result: 3,
			},
		},
		position: { x: 12, y: 228 },
	},
	{
		id: "5",
		type: "vector",
		dragHandle: ".dragger",
		data: {
			x: {
				value: 0,
				isConnected: false,
			},
			y: {
				value: 0,
				isConnected: false,
			},
			z: {
				value: 0,
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
			output: {
				result: {
					x: 0,
					y: 0,
					z: 0,
				},
			},
		},
		position: { x: 12, y: 468 },
	},
	{
		id: "6",
		type: "vector",
		dragHandle: ".dragger",
		data: {
			x: {
				value: 0,
				isConnected: false,
			},
			y: {
				value: 0,
				isConnected: false,
			},
			z: {
				value: 0,
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
			output: {
				result: {
					x: 0,
					y: 0,
					z: 0,
				},
			},
		},
		position: { x: 228, y: 468 },
	},
] as Node[];
