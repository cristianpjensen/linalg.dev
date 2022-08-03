import { createContext } from "react";

export type NodeContext = {
	id: string;
	title: string;
	color: string;
	data: { [key: string]: any };
	selected: boolean;
};

const NodeContext = createContext<NodeContext>({
	id: "",
	title: "",
	color: "",
	data: {},
	selected: false,
});

export default NodeContext;
