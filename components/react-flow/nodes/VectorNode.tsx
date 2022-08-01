import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";
import TeX from "@matejmazur/react-katex";

import type { VectorData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";
import { displayRounded } from "../helpers";

const VectorNode = memo(({ id, data, selected }: NodeProps<VectorData>) => {
	const setNodeData = useStore((state) => state.setNodeData);

	useOutput(id, ["result"], data, (data) => {
		return {
			result: {
				x: data.x.value,
				y: data.y.value,
				z: data.z.value,
			},
		};
	});

	const onChangeX = useCallback((value: number) => {
		setNodeData(id, { x: { value, isConnected: false } });
	}, []);

	const onChangeY = useCallback((value: number) => {
		setNodeData(id, { y: { value, isConnected: false } });
	}, []);

	const onChangeZ = useCallback((value: number) => {
		setNodeData(id, { z: { value, isConnected: false } });
	}, []);

	return (
		<Node.Root
			id={id}
			data={data}
			selected={selected}
			title="Vector"
			color="slate"
			width={192}
			height={288}
		>
			<Node.Dragger />

			<Node.Handle type="target" id="x" top={64} />
			<Node.Handle type="target" id="y" top={119} />
			<Node.Handle type="target" id="z" top={174} />
			<Node.Handle type="target" id="origin" top={235} />

			<div className="flex flex-col gap-2">
				<Node.NumberInput id="x" onChange={onChangeX} />
				<Node.NumberInput id="y" onChange={onChangeY} />
				<Node.NumberInput id="z" onChange={onChangeZ} />

				<TeX
					math={`\\begin{bmatrix}
						  ${displayRounded(data.origin.value.x)}
						& ${displayRounded(data.origin.value.y)}
						& ${displayRounded(data.origin.value.z)}
						\\end{bmatrix}^\\top`}
					block
				/>
			</div>

			<Node.Handle type="source" id="result" />
		</Node.Root>
	);
});

export default VectorNode;
