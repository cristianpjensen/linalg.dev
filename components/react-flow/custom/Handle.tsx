import { useCallback } from "react";
import {
	Handle as InternalHandle,
	HandleProps as InternalHandleProps,
	Connection,
} from "react-flow-renderer";

import useStore from "../store";
import { ValidInputOutput } from "../types";

interface HandleProps<N extends { output: { [key: string]: ValidInputOutput } }>
	extends InternalHandleProps {
	id: Extract<keyof Omit<N, "output"> | keyof N["output"], string>;
}

/**
 * **Never use this component directly.** Instead, first make a custom handle
 * component for the node and pass the data type as a generic. Then use that
 * function instead. This makes sure that the ID of the handle is layed out as
 * `property-type`. This is important, because it gives an error if the
 * connections will not work, because the first part is used for passing data
 * between nodes and the second part is for making sure the data is as expected.
 *
 * @example
 * ```tsx
 * const CustomHandle = Handle<CustomHandleData>;
 * const CustomNode = (props: NodeProps<CustomHandleData>) => (
 * 	<>
 * 		<CustomHandle type="target" id="property2-number" />
 * 		...
 * 		<CustomHandle type="source" id="property1-number" />
 * 	</>
 * )
 * ```
 */
const Handle = <N extends { output: { [key: string]: ValidInputOutput } }>(
	props: HandleProps<N> &
		Omit<React.HTMLAttributes<HTMLDivElement>, "id"> &
		React.RefAttributes<HTMLDivElement>
) => {
	return (
		<InternalHandle
			{...props}
			style={{
				backgroundColor: props.type === "target" ? "green" : "red",
				width: 16,
				height: 16,
				left: props.type === "target" ? -8 : "unset",
				right: props.type === "source" ? -8 : "unset",
				...props.style,
			}}
		/>
	);
};

export default Handle;
