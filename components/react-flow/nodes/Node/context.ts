import { createContext } from "react";

export type NodeContext = {
	title: string;
	color: string;
};

const NodeContext = createContext<NodeContext>({
	title: "",
	color: "",
});

export default NodeContext;
