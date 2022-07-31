import React, { memo, useCallback } from "react";
import { NodeProps, Position } from "react-flow-renderer/nocss";
import TeX from "@matejmazur/react-katex";

import type { VectorData } from "../types";
import Handle from "../custom/Handle";
import useStore from "../store";
import useOutput from "../hooks/useOutput";
import * as Node from "./Node";
import { displayRounded } from "../helpers";

const VectorHandle = Handle<VectorData>;

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
		// Since we are able to change the value, the handle is not connected
		setNodeData(id, { x: { value, isConnected: false } });
	}, []);

	const onChangeY = useCallback((value: number) => {
		// Since we are able to change the value, the handle is not connected
		setNodeData(id, { y: { value, isConnected: false } });
	}, []);

	const onChangeZ = useCallback((value: number) => {
		// Since we are able to change the value, the handle is not connected
		setNodeData(id, { z: { value, isConnected: false } });
	}, []);

	return (
		<>
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

			<Node.Root
				selected={selected}
				className="w-[192px] h-[288px] bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
			>
				<Node.Dragger
					title="Vector"
					className="bg-slate-700 dark:bg-slate-900 text-slate-200 dark:text-slate-100"
				/>

				<div className="flex flex-col gap-2">
					<Node.NumberInput
						value={data.x.value}
						onChange={onChangeX}
						isConnected={data.x.isConnected}
						className="shadow-slate-500 dark:shadow-slate-700 focus:shadow-slate-700 dark:focus:shadow-slate-500 text-slate-900 dark:text-slate-200"
					/>

					<Node.NumberInput
						value={data.y.value}
						onChange={onChangeY}
						isConnected={data.y.isConnected}
						className="shadow-slate-500 dark:shadow-slate-700 focus:shadow-slate-700 dark:focus:shadow-slate-500 text-slate-900 dark:text-slate-200"
					/>

					<Node.NumberInput
						value={data.z.value}
						onChange={onChangeZ}
						isConnected={data.z.isConnected}
						className="shadow-slate-500 dark:shadow-slate-700 focus:shadow-slate-700 dark:focus:shadow-slate-500 text-slate-900 dark:text-slate-200"
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
			</Node.Root>

			<VectorHandle
				type="source"
				id="result"
				nodeId={id}
				value={data.output.result}
				selected={selected}
				position={Position.Right}
			/>
		</>
	);
});

export default VectorNode;
