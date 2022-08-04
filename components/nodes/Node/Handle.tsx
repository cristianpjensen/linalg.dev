import React, { useCallback, useContext } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
	Handle as InternalHandle,
	HandleProps as InternalHandleProps,
	Position,
} from "react-flow-renderer/nocss";

import { getHandleType } from "../../helpers";
import { Input, ValidInputOutput } from "../types";
import useStore from "../../../stores/nodes";
import NodeContext from "./context";
import { Tooltip } from "../../Tooltip";

interface HandleProps extends Omit<InternalHandleProps, "position"> {
	id: string;
	top?: number | string;
	position?: Position;
}

const Handle = ({
	id,
	type,
	// Default position for handle should be the middle of the node's body
	top = "calc(50% + 12px)",
	style,
	isConnectable,
	position,
	...props
}: HandleProps &
	Omit<React.HTMLAttributes<HTMLDivElement>, "id"> &
	React.RefAttributes<HTMLDivElement>) => {
	const { data, ...context } = useContext(NodeContext);

	if (data[id] === undefined && data.output[id] === undefined) {
		throw new Error(
			`${id} is not defined in the data of node (${Object.keys(data)
				.concat(Object.keys(data.output))
				.filter((key) => key !== "output")}). Is it spelled correctly?`
		);
	}

	let handle;
	if (type === "source") {
		handle = data.output[id] as ValidInputOutput;
	} else {
		handle = data[id] as Input<ValidInputOutput>;
	}

	const acceptedValue =
		typeof handle === "object" && "value" in handle
			? getHandleType(handle.value)
			: getHandleType(handle);

	const deleteEdge = useStore((state) => state.deleteEdge);
	const onDelete = useCallback(() => {
		deleteEdge(context.id, id);
	}, []);

	return (
		<>
			{typeof handle === "object" &&
				"isConnected" in handle &&
				handle.isConnected && (
					<button
						style={{
							left: -12,
							marginTop: -12,
							top,
							...style,
						}}
						className="absolute z-20 flex items-center justify-center w-6 h-6 transition-opacity bg-red-400 border-2 border-red-500 rounded-full opacity-0 dark:bg-red-500 dark:border-red-600 hover:opacity-100 text-offwhite"
						onClick={onDelete}
					>
						<Cross2Icon className="-left-1 -top-1" />
					</button>
				)}

			<InternalHandle
				id={id}
				style={{
					top,
					...style,
				}}
				className={`flex z-10 items-center justify-center w-6 h-6 text-[10px] border-2 rounded-full text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900 ${
					isConnectable === true || isConnectable === undefined
						? "cursor-crosshair"
						: "opacity-40 cursor-default"
				} ${
					context.selected
						? `border-zinc-400 dark:border-zinc-400`
						: `border-zinc-300 dark:border-zinc-700`
				}`}
				position={
					position
						? position
						: type === "source"
						? Position.Right
						: Position.Left
				}
				type={type}
				isConnectable={isConnectable}
				{...props}
			>
				{acceptedValue === "number"
					? "N"
					: acceptedValue === "vector"
					? "V"
					: acceptedValue === "matrix"
					? "M"
					: "?"}
			</InternalHandle>
		</>
	);
};

export default Handle;
