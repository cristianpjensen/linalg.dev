import React, { memo } from "react";
import { NodeProps } from "react-flow-renderer/nocss";

import type { ConstantData } from "./types";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";

const ConstantNode = memo(({ id, data, selected }: NodeProps<ConstantData>) => {
	useOutput(id, data, (data) => {
		return {
			result: data.value.value,
		};
	});

	return (
		<Node.Root
			id={id}
			data={data}
			selected={selected}
			title="Constant"
			color="green-ext"
			width={144}
			height={120}
		>
			<Node.Dragger />

			<Node.Handle type="target" id="value" top={64} />
			<Node.NumberInput id="value" />

			<Node.Handle type="source" id="result" top={64} />
		</Node.Root>
	);
});

export default ConstantNode;