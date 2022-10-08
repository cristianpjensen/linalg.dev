import React, { memo } from "react";
import { NodeProps } from "reactflow";

import { VectorComponentsData } from "./types";
import { useOutput } from "./hooks";
import * as Node from "./Node";

const VectorComponentsNode = memo(
	({ id, data, selected }: NodeProps<VectorComponentsData>) => {
		useOutput(id, data, (data) => {
			return {
				...data.vector.value,
			};
		});

		return (
			<Node.Root
				id={id}
				data={data}
				selected={selected}
				title="Vector components"
				color="slate"
				width={10}
				height={5}
			>
				<Node.Dragger />

				<Node.Handle type="target" id="vector" top={64} />

				<Node.DisplayVector vector={data.output} />

				<Node.Handle type="source" id="x" top="calc(25% + 12px)" />
				<Node.Handle type="source" id="y" top="calc(50% + 12px)" />
				<Node.Handle type="source" id="z" top="calc(75% + 12px)" />
			</Node.Root>
		);
	}
);

VectorComponentsNode.displayName = "Vector components node";

export default VectorComponentsNode;
