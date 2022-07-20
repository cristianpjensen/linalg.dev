import { useContext } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";

import {
	InputPort as _InputPort,
	MatrixNode as _MatrixNode,
	Vector,
} from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";
import { TransformContext } from "../../App";
import MathInput from "../MathInput";

export const MatrixNode = observer(({ node }: Node.INodeProps<_MatrixNode>) => {
	const onRemove = () => {
		node.destroy();
	};

	const { m1, m2, m3 } = node.inputPorts;
	const transform = useContext(TransformContext);

	const onTransform = () => {
		transform(node.outputPorts.result.value);
	};

	return (
		<Node.Root node={node}>
			<Node.Handle
				title={node.type}
				className="bg-slate-700 dark:bg-slate-900 text-slate-200 dark:text-slate-100"
			>
				<Tooltip tip="Remove matrix">
					<button
						onClick={onRemove}
						className="flex items-center justify-center w-8 h-8 hover:bg-gray-300/20"
					>
						<CrossCircledIcon />
					</button>
				</Tooltip>
			</Node.Handle>

			<Node.Body className="flex flex-col justify-between bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
				<PortVectorInput port={m1} />
				<PortVectorInput port={m2} />
				<PortVectorInput port={m3} />

				<button
					onClick={onTransform}
					className="py-1 text-xs rounded dark:text-slate-100 text-slate-900 shadow-b1 dark:shadow-slate-600 shadow-slate-400 focus:shadow-b2 focus:shadow-slate-600 dark:focus:shadow-slate-400"
				>
					Transform
				</button>

				<Node.InputPorts node={node} />
				<Node.OutputPorts node={node} />
			</Node.Body>
		</Node.Root>
	);
});

interface IPortVectorInputProps {
	port: _InputPort<Vector>;
}

const PortVectorInput = observer(({ port }: IPortVectorInputProps) => {
	const onChangeX = (value: number) => {
		port.value = {
			...port.value,
			x: value,
		};
	};
	const onChangeY = (value: number) => {
		port.value = {
			...port.value,
			y: value,
		};
	};
	const onChangeZ = (value: number) => {
		port.value = {
			...port.value,
			z: value,
		};
	};

	return (
		<div className="flex h-full gap-2">
			<div className="flex-1 min-w-0">
				<MatrixInput
					port={port}
					value={Math.round(port.value.x * 100) / 100}
					onChange={onChangeX}
				/>
			</div>

			<div className="flex-1 min-w-0">
				<MatrixInput
					port={port}
					value={Math.round(port.value.y * 100) / 100}
					onChange={onChangeY}
				/>
			</div>

			<div className="flex-1 min-w-0">
				<MatrixInput
					port={port}
					value={Math.round(port.value.z * 100) / 100}
					onChange={onChangeZ}
				/>
			</div>
		</div>
	);
});

interface IMathInputProps {
	value: number;
	onChange: (value: number) => void;
	port: _InputPort<Vector>;
}

const MatrixInput = observer(({ port, value, onChange }: IMathInputProps) => {
	return (
		<MathInput
			value={value}
			onChange={onChange}
			className={
				"px-2 py-1 text-xl bg-transparent rounded opacity-100 shadow-slate-400 focus:shadow-slate-600 dark:focus:shadow-slate-400 dark:shadow-slate-600 text-slate-900 dark:text-slate-200 " +
				(port.isConnected ? "shadow-none" : "shadow-b1 focus:shadow-b2")
			}
			disabled={port.isConnected}
		/>
	);
});
