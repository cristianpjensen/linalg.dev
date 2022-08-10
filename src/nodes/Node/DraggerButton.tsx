import { Tooltip } from "../../utils";

type IDraggerButtonProps = {
	tooltip: string;
	onClick?: () => void;
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

export default DraggerButton;
