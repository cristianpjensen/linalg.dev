import React, { memo, useCallback } from "react";
import { NodeProps } from "react-flow-renderer/nocss";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import type { VectorData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";
import { useNodeStore } from "../../stores";

const VectorNode = memo(({ id, data, selected }: NodeProps<VectorData>) => {
	useOutput(id, data, (data) => {
		return {
			result: {
				x: data.x.value,
				y: data.y.value,
				z: data.z.value,
			},
		};
	});

	const setNodeData = useNodeStore((state) => state.setNodeData);
	const onHide = useCallback(() => {
		setNodeData(id, { hidden: !data.hidden });
	}, [data.hidden]);

	return (
		<Node.Root
			id={id}
			data={data}
			selected={selected}
			title="Vector"
			color="slate"
			width={8}
			height={12}
		>
			<Node.Dragger>
				<Node.DraggerButton tooltip="Show/hide vector" onClick={onHide}>
					{data.hidden ? <EyeClosedIcon /> : <EyeOpenIcon />}
				</Node.DraggerButton>
			</Node.Dragger>

			<Node.Handle type="target" id="x" top={64} />
			<Node.Handle type="target" id="y" top={119} />
			<Node.Handle type="target" id="z" top={174} />
			<Node.Handle type="target" id="origin" top={235} />

			<div className="flex flex-col gap-2">
				<Node.NumberInput id="x" />
				<Node.NumberInput id="y" />
				<Node.NumberInput id="z" />

				<Node.DisplayVector vector={data.origin.value} />
			</div>

			<Node.Handle type="source" id="result" />
		</Node.Root>
	);
});

export default VectorNode;
