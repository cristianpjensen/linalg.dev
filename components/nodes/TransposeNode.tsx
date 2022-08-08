import React, { memo } from "react";
import { NodeProps } from "react-flow-renderer/nocss";

import type { TransposeData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";
import useTransform from "../hooks/useTransform";

const TransposeNode = memo(
	({ id, data, selected }: NodeProps<TransposeData>) => {
		const output = useOutput(id, data, (data) => {
			const m = data.matrix.value;
			return {
				result: [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]],
			};
		});

		const onTransform = useTransform(data.output.result);

		return (
			<Node.Root
				id={id}
				data={data}
				selected={selected}
				title="Transpose"
				color="slate"
				width={10}
				height={8}
			>
				<Node.Dragger />

				<Node.Handle type="target" id="matrix" />

				<Node.DisplayMatrix matrix={output.result} />
				<Node.Button onClick={onTransform}>Transform</Node.Button>

				<Node.Handle type="source" id="result" />
			</Node.Root>
		);
	}
);

TransposeNode.displayName = "Transpose node";

export default TransposeNode;
