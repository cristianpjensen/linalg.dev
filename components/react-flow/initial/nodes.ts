import { Node } from "react-flow-renderer";

export default [
	{
		id: "1",
		type: "constant",
		data: {
			value: 1,
			output: {
				result: 1,
			},
		},
		position: { x: 0, y: 25 },
	},
	{
		id: "2",
		type: "unaryOperator",
		data: {
			value: 16,
			operator: "sqrt",
			output: {
				result: 4,
			},
		},
		position: { x: 250, y: 25 },
	},
	{
		id: "3",
		type: "constant",
		data: {
			value: 123,
			output: {
				result: 123,
			},
		},
		position: { x: 250, y: 250 },
	},
	{
		id: "4",
		type: "binaryOperator",
		data: {
			left: 1,
			right: 2,
			operator: "add",
			output: {
				result: 3,
			},
		},
		position: { x: 0, y: 250 },
	},
] as Node[];
