import { useCallback } from "react";
import {
	Handle as InternalHandle,
	HandleProps as InternalHandleProps,
	Connection,
} from "react-flow-renderer";

interface HandleProps extends InternalHandleProps {
	id: `${string}-${"number" | "vector" | "matrix"}`;
}

const Handle = (
	props: HandleProps &
		Omit<React.HTMLAttributes<HTMLDivElement>, "id"> &
		React.RefAttributes<HTMLDivElement>
) => {
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
