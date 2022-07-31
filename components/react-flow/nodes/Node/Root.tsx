import React from "react";

import NodeContext from "./context";

type IRootProps = {
	title: string;
	selected: boolean;
	width: number;
	height: number;
	color: string;
	style?: React.CSSProperties;
	className?: string;
	children?: React.ReactNode;
};

const Root = ({
	title,
	selected,
	width,
	height,
	color,
	style,
	className,
	children,
}: IRootProps) => {
	const selectedStyling = selected
		? `shadow-b2 shadow-zinc-400 dark:shadow-zinc-400`
		: `shadow-b1 shadow-zinc-200 dark:shadow-zinc-700`;

	const colorStyling = `bg-${color}-200 dark:bg-${color}-800 text-${color}-900 dark:text-${color}-100`;

	return (
		<NodeContext.Provider value={{ title, color }}>
			<div
				className={`nowheel rounded overflow-scroll p-4 pt-10 ${selectedStyling} ${colorStyling} ${className}`}
				style={{
					width,
					height,
					...style,
				}}
			>
				{children}
			</div>
		</NodeContext.Provider>
	);
};

export default Root;
