import React, { useCallback, useState } from "react";

import NodeContext from "./context";

type IDraggerProps = {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
};

const Dragger = ({ children, className, style }: IDraggerProps) => {
	const [pointerDown, setPointerDown] = useState(false);

	const onPointerDown = useCallback(() => setPointerDown(true), []);
	const onPointerUp = useCallback(() => setPointerDown(false), []);

	return (
		<NodeContext.Consumer>
			{({ title, color }) => {
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
					</div>
				);
			}}
		</NodeContext.Consumer>
	);
};

export default Dragger;
