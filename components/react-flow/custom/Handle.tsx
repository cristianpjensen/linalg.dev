import { useCallback } from "react";
import {
	Handle as InternalHandle,
	HandleProps as InternalHandleProps,
	Connection,
} from "react-flow-renderer";

interface HandleProps<N extends object> extends InternalHandleProps {
	id: `${Extract<keyof N, string>}-${"number" | "vector" | "matrix"}`;
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
const Handle = <N extends object>(
	props: HandleProps<N> &
		Omit<React.HTMLAttributes<HTMLDivElement>, "id"> &
		React.RefAttributes<HTMLDivElement>
) => {
	// A connection is only valid if it is connected to a handle of the same type.
	// The type is determined by the second part of the id, which is always
	// present due to the type of the custom handle.
	const isValidConnection = useCallback(
		({ sourceHandle, targetHandle }: Connection) => {
			if (sourceHandle && targetHandle) {
				const sourceType = sourceHandle.split("-")[1];
				const targetType = targetHandle.split("-")[1];
				return sourceType === targetType;
			}

			return false;
		},
		[]
	);

	return <InternalHandle {...props} isValidConnection={isValidConnection} />;
};

export default Handle;
