import React, { memo } from "react";
import { NodeProps } from "react-flow-renderer/nocss";
import TeX from "@matejmazur/react-katex";

import type { MatrixMultiplicationData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";
import useTransform from "../hooks/useTransform";

const MatrixMultiplicationNode = memo(
	({ id, data, selected }: NodeProps<MatrixMultiplicationData>) => {
		const output = useOutput(id, data, (data) => {
			const m1 = data.left.value;
			const m2 = data.right.value;

			return {
				result: [
					m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6],
					m1[0] * m2[1] + m1[1] * m2[4] + m1[2] * m2[7],
					m1[0] * m2[2] + m1[1] * m2[5] + m1[2] * m2[8],
					m1[3] * m2[0] + m1[4] * m2[3] + m1[5] * m2[6],
					m1[3] * m2[1] + m1[4] * m2[4] + m1[5] * m2[7],
					m1[3] * m2[2] + m1[4] * m2[5] + m1[5] * m2[8],
					m1[6] * m2[0] + m1[7] * m2[3] + m1[8] * m2[6],
					m1[6] * m2[1] + m1[7] * m2[4] + m1[8] * m2[7],
					m1[6] * m2[2] + m1[7] * m2[5] + m1[8] * m2[8],
				],
			};
		});

		const onTransform = useTransform(data.output.result);

		return (
			<Node.Root
				id={id}
				data={data}
				selected={selected}
				title="Matrix multiplication"
				color="slate"
				width={8}
				height={8}
			>
				<Node.Dragger />

				<Node.Handle type="target" id="left" top="calc(33.33% + 8px)" />
				<Node.Handle
					type="target"
					id="right"
					top="calc(66.66% + 8px)"
				/>

				<Node.DisplayMatrix matrix={output.result} />
				<Node.Button onClick={onTransform}>Transform</Node.Button>

				<Node.Handle type="source" id="result" />
			</Node.Root>
		);
	}
);

export default MatrixMultiplicationNode;
