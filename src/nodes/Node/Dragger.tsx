import { CrossCircledIcon } from "@radix-ui/react-icons";
import React, { useCallback, useContext, useState } from "react";

import { useNodeStore } from "../../../stores";
import NodeContext from "./context";
import DraggerButton from "./DraggerButton";

type IDraggerProps = {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
};

const Dragger = ({ children, className, style }: IDraggerProps) => {
	const { title, color, id } = useContext(NodeContext);
	const onNodesChange = useNodeStore((state) => state.onNodesChange);

	const [pointerDown, setPointerDown] = useState(false);
	const onPointerDown = useCallback(() => setPointerDown(true), []);
	const onPointerUp = useCallback(() => setPointerDown(false), []);

	const onRemove = useCallback(() => {
		onNodesChange([{ type: "remove", id }]);
	}, []);

	const colorStyling = `bg-${color}-700 dark:bg-${color}-900 text-${color}-200 dark:text-${color}-100`;

	return (
		<div
			className={`absolute top-0 left-0 flex flex-row rounded-t w-full h-6 text-xs flex-nowrap ${colorStyling} ${className}`}
			style={{
				...style,
				cursor: pointerDown ? "grabbing" : "grab",
			}}
		>
			<div
				onPointerDown={onPointerDown}
				onPointerUp={onPointerUp}
				className="inline-flex items-center pl-2 select-none dragger grow justify-left"
			>
				{title}
			</div>

			<div className="flex cursor-pointer">
				{children}

				<DraggerButton tooltip="Remove node" onClick={onRemove}>
					<CrossCircledIcon />
				</DraggerButton>
			</div>
		</div>
	);
};

export default Dragger;
