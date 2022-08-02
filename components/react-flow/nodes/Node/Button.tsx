import React, { useContext } from "react";

import NodeContext from "./context";

const Button = ({
	children,
	onClick,
	className,
	...props
}: React.HTMLAttributes<HTMLButtonElement> &
	React.RefAttributes<HTMLButtonElement>) => {
	const { color } = useContext(NodeContext);

	const colorStyling = `text-${color}-900 dark:text-${color}-200 shadow-${color}-500 dark:shadow-${color}-700 focus:shadow-${color}-700 dark:focus:shadow-${color}-500`;

	return (
		<button
			onClick={onClick}
			className={`py-1 text-sm rounded w-full h-8 shadow-b1 focus:shadow-b2 ${colorStyling} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
