import React, { memo } from "react";
import { NodeProps } from "react-flow-renderer/nocss";

import type { MatrixData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const MatrixNode = memo(({ id, data, selected }: NodeProps<MatrixData>) => {
	useOutput(id, data, (data) => {
		const m1 = data.m1.value;
		const m2 = data.m2.value;
		const m3 = data.m3.value;

		return {
			result: [m1.x, m1.y, m1.z, m2.x, m2.y, m2.z, m3.x, m3.y, m3.z],
		};
	});

	return (
		<Node.Root
			id={id}
			data={data}
			selected={selected}
			title="Matrix"
			color="slate"
			width={264}
			height={264}
		>
			<Node.Dragger />

			<Node.Handle type="target" id="m1" top={64} />
			<Node.Handle type="target" id="m2" top={119} />
			<Node.Handle type="target" id="m3" top={174} />

			<div className="grid grid-flow-row grid-cols-3 gap-2">
				<Node.VectorInput id="m1" />
				<Node.VectorInput id="m2" />
				<Node.VectorInput id="m3" />
			</div>

			<Node.Button className="mt-3">Transform</Node.Button>

			<Node.Handle type="source" id="result" />
		</Node.Root>
	);
});

export default MatrixNode;