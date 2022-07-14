import { useState } from "react";

export interface INodeHandleProps {
	/**
	 * Buttons in the top right corner of the node.
	 */
	children?: React.ReactNode;

	/**
	 * Title to display in the top left corner of the node.
	 */
	title?: string;

	/**
	 * Used for back- and foreground colors of the handle.
	 */
	className?: string;
}

export const Handle = ({
	children: buttons,
	title,
	className,
}: INodeHandleProps) => {
	const [pointerDown, setPointerDown] = useState(false);

	const onPointerDown = () => setPointerDown(true);
	const onPointerUp = () => setPointerDown(false);

	return (
		<div
			className={`handle absolute w-full h-8 pl-2 flex flex-row flex-nowrap text-sm ${className}`}
			style={{ cursor: pointerDown ? "grabbing" : "grab" }}
			onPointerDown={onPointerDown}
			onPointerUp={onPointerUp}
		>
			<div className="flex items-center select-none grow justify-left">
				{title}
			</div>

			{buttons}
		</div>
	);
};
