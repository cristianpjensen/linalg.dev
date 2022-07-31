import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer/nocss";
import TeX from "@matejmazur/react-katex";

import type { VectorData } from "../types";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";
import { displayRounded } from "../helpers";

const VectorHandle = Node.Handle<VectorData>;

const VectorNode = memo(({ id, data, selected }: NodeProps<VectorData>) => {
	const setNodeData = useStore((state) => state.setNodeData);

	useOutput<VectorData>(id, ["result"], data, (data) => {
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
			title="Vector"
			color="slate"
			selected={selected}
			width={192}
			height={288}
		>
			<VectorHandle
				type="target"
				id="x"
				nodeId={id}
				value={data.x.value}
				isConnected={data.x.isConnected}
				selected={selected}
				position={Position.Left}
				style={{
					top: 64,
				}}
			/>

			<VectorHandle
				type="target"
				id="y"
				nodeId={id}
				value={data.y.value}
				isConnected={data.y.isConnected}
				selected={selected}
				position={Position.Left}
				style={{
					top: 119,
				}}
			/>

			<VectorHandle
				type="target"
				id="z"
				nodeId={id}
				value={data.z.value}
				isConnected={data.z.isConnected}
				selected={selected}
				position={Position.Left}
				style={{
					top: 174,
				}}
			/>

			<VectorHandle
				type="target"
				id="origin"
				nodeId={id}
				value={data.origin.value}
				isConnected={data.origin.isConnected}
				selected={selected}
				position={Position.Left}
				style={{
					top: 235,
				}}
			/>

			<Node.Dragger />

			<div className="flex flex-col gap-2">
				<Node.NumberInput
					value={data.x.value}
					isConnected={data.x.isConnected}
					onChange={onChangeX}
				/>

				<Node.NumberInput
					value={data.y.value}
					isConnected={data.y.isConnected}
					onChange={onChangeY}
				/>

				<Node.NumberInput
					value={data.z.value}
					isConnected={data.z.isConnected}
					onChange={onChangeZ}
				/>

				<TeX
					math={`\\begin{bmatrix}
						  ${displayRounded(data.origin.value.x)}
						& ${displayRounded(data.origin.value.y)}
						& ${displayRounded(data.origin.value.z)}
						\\end{bmatrix}^\\top`}
					block
				/>
			</div>

			<VectorHandle
				type="source"
				id="result"
				nodeId={id}
				value={data.output.result}
				selected={selected}
				position={Position.Right}
			/>
		</Node.Root>
	);
});

export default VectorNode;
