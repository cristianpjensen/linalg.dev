import { Node } from "react-flow-renderer";

export default [
	{
		id: "1",
		type: "constant",
		data: { value: 25 },
		position: { x: 0, y: 25 },
	},
	{
		id: "2",
		type: "unaryOperator",
		data: { value: 69, operator: "sqrt" },
		position: { x: 250, y: 25 },
	},
	{
		id: "3",
		type: "constant",
		data: { value: 123 },
		position: { x: 250, y: 250 },
	},
	{
		id: "4",
		type: "binaryOperator",
		data: { left: 1, right: 2, operator: "add" },
		position: { x: 0, y: 250 },
	},
] as Node[];
