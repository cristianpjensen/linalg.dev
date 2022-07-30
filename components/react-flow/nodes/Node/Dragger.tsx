import { useCallback, useState } from "react";

type IDraggerProps = {
	title: string;
	className?: string;
	children?: React.ReactNode;
};

const Dragger = ({ title, className, children }: IDraggerProps) => {
	const [pointerDown, setPointerDown] = useState(false);

	const onPointerDown = useCallback(() => setPointerDown(true), []);
	const onPointerUp = useCallback(() => setPointerDown(false), []);

	return (
		<div
			className={`dragger absolute top-0 left-0 flex flex-row rounded-t w-full h-6 pl-2 text-xs flex-nowrap ${className}`}
			style={{
				cursor: pointerDown ? "grabbing" : "grab",
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
};

export default Dragger;
