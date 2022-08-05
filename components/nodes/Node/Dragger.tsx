import { CrossCircledIcon } from "@radix-ui/react-icons";
import React, { useCallback, useContext, useState } from "react";
import { useNodeStore } from "../../../stores";
import { Tooltip } from "../../Tooltip";

import NodeContext from "./context";

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
			className={`dragger absolute top-0 left-0 flex flex-row rounded-t w-full h-6 pl-2 text-xs flex-nowrap ${colorStyling} ${className}`}
			style={{
				cursor: pointerDown ? "grabbing" : "grab",
				...style,
			}}
			onPointerDown={onPointerDown}
			onPointerUp={onPointerUp}
		>
			<div className="flex items-center select-none grow justify-left">
				{title}
			</div>

			{children}

			<DraggerButton tooltip="Remove node" onClick={onRemove}>
				<CrossCircledIcon />
			</DraggerButton>
		</div>
	);
};

type IDraggerButtonProps = {
	tooltip: string;
	onClick: () => void;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
};

export const DraggerButton = ({
	onClick,
	tooltip,
	children,
	className,
	style,
}: IDraggerButtonProps) => (
	<Tooltip tip={tooltip}>
		<button
			onClick={onClick}
			className={`flex items-center justify-center w-6 h-6 hover:bg-zinc-100/20 dark:hover:bg-zinc-500/20 ${className}`}
			style={style}
		>
			{children}
		</button>
	</Tooltip>
);

export default Dragger;
