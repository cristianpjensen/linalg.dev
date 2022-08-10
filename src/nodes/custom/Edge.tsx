import { getSmoothStepPath, EdgeProps } from "react-flow-renderer/nocss";

const Edge = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	markerEnd,
	selected,
}: EdgeProps) => {
	const edgePath = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<g className="cursor-pointer pointer-events-auto">
			<path
				id={id}
				style={style}
				className="peer stroke-transparent"
				d={edgePath}
				strokeWidth={16}
				fill="none"
			/>

			<path
				id={id}
				style={style}
				className={
					selected
						? "stroke-zinc-600 dark:stroke-zinc-400"
						: "stroke-zinc-300 dark:stroke-zinc-700"
				}
				d={edgePath}
				markerEnd={markerEnd}
				strokeWidth={2}
				fill="none"
			/>
		</g>
	);
};

export default Edge;
