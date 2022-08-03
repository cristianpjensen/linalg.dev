import React, { memo } from "react";
import { NodeProps } from "react-flow-renderer/nocss";

import type { TransformData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const TransformNode = memo(
	({ id, data, selected }: NodeProps<TransformData>) => {
		useOutput(id, data, (data) => {
			const m = data.matrix.value;
			const v = data.vector.value;

			return {
				result: {
					x: m[0] * v.x + m[1] * v.y + m[2] * v.z,
					y: m[3] * v.x + m[4] * v.y + m[5] * v.z,
					z: m[6] * v.x + m[7] * v.y + m[8] * v.z,
				},
			};
		});

		return (
			<Node.Root
				id={id}
				data={data}
				selected={selected}
				title="Transform"
				color="slate"
				width={8}
				height={5}
			>
				<Node.Dragger />

				<Node.Handle
					type="target"
					id="matrix"
					top="calc(33.33% + 8px)"
				/>
				<Node.Handle
					type="target"
					id="vector"
					top="calc(66.66% + 8px)"
				/>

				<Node.DisplayVector vector={data.vector.value} />

				<Node.Handle type="source" id="result" />
			</Node.Root>
		);
	}
);

export default TransformNode;
