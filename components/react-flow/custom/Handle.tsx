import { useCallback } from "react";
import {
	Handle as InternalHandle,
	HandleProps as InternalHandleProps,
	Connection,
} from "react-flow-renderer";

import useStore from "../store";
import { ValidInputOutput, ValidInputOutputString } from "../types";

interface HandleProps<N extends { output: { [key: string]: ValidInputOutput } }>
	extends InternalHandleProps {
	id: `${Extract<
		keyof Omit<N, "output"> | keyof N["output"],
		string
	>}-${ValidInputOutputString}`;
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
	const edges = useStore((state) => state.edges);

	// A connection is only valid if it is connected to a handle of the same type.
	// The type is determined by the second part of the id, which is always
	// present due to the type of the custom handle.
	const isValidConnection = useCallback(
		({ target, sourceHandle, targetHandle }: Connection) => {
			if (sourceHandle && target && targetHandle) {
				// Only one connection to the target is allowed.
				if (
					edges.some(
						(edge) =>
							edge.targetHandle === targetHandle &&
							edge.target === target
					)
				) {
					return false;
				}

				const sourceType = sourceHandle.split("-")[1];
				const targetType = targetHandle.split("-")[1];
				return sourceType === targetType;
			}

			return false;
		},
		[edges]
	);

	const handleType = props.id.split("-")[1];

	return (
		<InternalHandle {...props} isValidConnection={isValidConnection}>
			{handleType === "number"
				? "N"
				: handleType === "vector"
				? "V"
				: handleType === "matrix" && "M"}
		</InternalHandle>
	);
};

export default Handle;
