import React, { memo } from "react";
import { NodeProps } from "react-flow-renderer/nocss";

import type { NormData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const NormNode = memo(({ id, data, selected }: NodeProps<NormData>) => {
	useOutput(id, data, (data) => {
		const v = data.vector.value;
		return {
			result: Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z),
		};
	});

	return (
		<Node.Root
			id={id}
			data={data}
			selected={selected}
			title="Norm"
			color="slate"
			width={8}
			height={5}
		>
			<Node.Dragger />

			<Node.Handle type="target" id="vector" />

			<Node.DisplayVector vector={data.vector.value} />

			<Node.Handle type="source" id="result" />
		</Node.Root>
	);
});

export default NormNode;
