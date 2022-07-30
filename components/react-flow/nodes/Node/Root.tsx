type IRootProps = {
	selected: boolean;
	className?: string;
	children?: React.ReactNode;
};

const Root = ({ selected, className, children }: IRootProps) => {
	return (
		<div
			className={`rounded overflow-scroll p-4 pt-10 ${
				selected
					? "shadow-b2 shadow-zinc-400 dark:shadow-zinc-400"
					: "shadow-b1 shadow-zinc-200 dark:shadow-zinc-700"
			} ${className}`}
		>
			{children}
		</div>
	);
};

export default Root;
