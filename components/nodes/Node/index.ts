export * from "./Handle";
export * from "./Root";
export * from "./Body";
export * from "./Ports";
export * from "./PortNumberInput";
export * from "./PortSelectInput";
export * from "./Switch";

export interface INodeProps<T> {
	/**
	 * Internal representation of the node. The entire node datastructure has to
	 * be passed, according to the MobX documentation.
	 */
	node: T;
}
