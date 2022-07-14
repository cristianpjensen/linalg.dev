export interface INodeBodyProps {
	/**
	 * Node content.
	 */
	children?: React.ReactNode;

	/**
	 * Used for back- and foreground colors of the body of the node.
	 */
	className?: string;

	/**
	 * Node styling.
	 */
  style?: React.CSSProperties;
}

export const Body = ({ children, className, style }: INodeBodyProps) => {
	return (
		<div
			className={`w-full h-full ${className}`}
			style={style}
			children={children}
		/>
	);
};