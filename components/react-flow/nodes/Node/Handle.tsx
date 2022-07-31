import React, { useCallback } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
	Handle as InternalHandle,
	HandleProps as InternalHandleProps,
} from "react-flow-renderer/nocss";

import type { ValidInputOutput } from "../../types";
import { getHandleType } from "../../helpers";
import useStore from "../../store";
import NodeContext from "./context";

interface HandleProps<N extends { output: { [key: string]: ValidInputOutput } }>
	extends InternalHandleProps {
	id: Extract<keyof Omit<N, "output"> | keyof N["output"], string>;
	nodeId: string;
	value: ValidInputOutput;
	selected: boolean;
	isConnected?: boolean;
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
	const deleteEdge = useStore((state) => state.deleteEdge);
	const type = getHandleType(props.value);

	const onDelete = useCallback(() => {
		deleteEdge(props.nodeId, props.id);
	}, []);

	return (
		<>
			{props.isConnected && (
				<button
					style={{
						left: -12,
						marginTop: -12,
						top: "calc(50% + 12px)",
						...props.style,
					}}
					className="absolute z-50 flex items-center justify-center w-6 h-6 transition-opacity bg-red-400 border-2 border-red-500 rounded-full opacity-0 dark:bg-red-500 dark:border-red-600 hover:opacity-100 text-offwhite"
					onClick={onDelete}
				>
					<Cross2Icon className="-left-1 -top-1" />
				</button>
			)}

			<NodeContext.Consumer>
				{({ color }) => (
					<InternalHandle
						{...props}
						style={{
							// Default position for handle should be the middle of the node's body
							top: "calc(50% + 12px)",
							...props.style,
						}}
						className={`flex items-center justify-center w-6 h-6 text-[10px] border-2 rounded-full text-${color}-400 dark:text-${color}-500 bg-${color}-50 dark:bg-${color}-900 ${
							props.isConnectable === true ||
							props.isConnectable === undefined
								? "cursor-crosshair"
								: "opacity-40 cursor-default"
						} ${
							props.selected
								? `border-${color}-400 dark:border-${color}-400`
								: `border-${color}-300 dark:border-${color}-700`
						}`}
					>
						{type === "number"
							? "N"
							: type === "vector"
							? "V"
							: type === "matrix"
							? "M"
							: "?"}
					</InternalHandle>
				)}
			</NodeContext.Consumer>
		</>
	);
};

export default Handle;
