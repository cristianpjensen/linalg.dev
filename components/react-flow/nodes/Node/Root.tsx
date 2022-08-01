import React from "react";

import NodeContext from "./context";

type IRootProps = {
	id: string;
	title: string;
	data: { [key: string]: any };
	selected: boolean;
	width: number;
	height: number;
	color: string;
	style?: React.CSSProperties;
	className?: string;
	children?: React.ReactNode;
};

const Root = ({
	id,
	title,
	data,
	selected,
	width,
	height,
	color,
	style,
	className,
	children,
}: IRootProps) => {
	const selectedStyling = selected
		? `shadow-b2 shadow-${color}-400 dark:shadow-${color}-400`
		: `shadow-b1 shadow-${color}-300 dark:shadow-${color}-700`;

	const colorStyling = `bg-${color}-200 dark:bg-${color}-800 text-${color}-900 dark:text-${color}-100`;

	return (
		<NodeContext.Provider value={{ id, title, data, color, selected }}>
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
