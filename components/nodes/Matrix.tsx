import { useContext } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import { MathInput } from "react-three-linalg";
import TeX from "@matejmazur/react-katex";

import {
	InputPort as _InputPort,
	MatrixNode as _MatrixNode,
	Vector,
} from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";
import { TransformContext } from "../App";

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
					className="h-6 text-sm rounded dark:text-slate-100 text-slate-800 shadow-b1 dark:shadow-zinc-700 shadow-zinc-300 focus:shadow-b2 focus:shadow-zinc-400 dark:focus:shadow-zinc-400"
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
    }
	};
	const onChangeY = (value: number) => {
		port.value = {
      ...port.value,
      y: value,
    }
	};
	const onChangeZ = (value: number) => {
		port.value = {
      ...port.value,
      z: value,
    }
	};

	return (
		<div className="flex gap-2 overflow-hidden" style={{ height: 50 }}>
			<div className="flex-1">
				<div
					className={`transition-opacity duration-200 ease-out z-20 ${
						port.isConnected
							? "opacity-0 invisible"
							: "opacity-100 visible"
					}`}
				>
					<MathInput
						value={Math.round(port.value.x * 100) / 100}
						onChange={onChangeX}
						style={{
							backgroundColor: "transparent",
							color: "none",
						}}
					/>
				</div>

				<TeX
					className={`flex justify-left text-xl -mt-[2.5625rem] ml-[0.625rem] transition-opacity duration-200 z-10 ease-in ${
						port.isConnected
							? "opacity-100 visible"
							: "opacity-0 invisible"
					}`}
					math={`${Math.round(port.value.x * 100) / 100}`}
				/>
			</div>

			<div className="flex-1">
				<div
					className={`transition-opacity duration-200 ease-out z-20 ${
						port.isConnected
							? "opacity-0 invisible"
							: "opacity-100 visible"
					}`}
				>
					<MathInput
						value={Math.round(port.value.y * 100) / 100}
						onChange={onChangeY}
						style={{
							backgroundColor: "transparent",
							color: "none",
						}}
					/>
				</div>

				<TeX
					className={`flex justify-left text-xl -mt-[2.5625rem] ml-[0.625rem] transition-opacity duration-200 z-10 ease-in ${
						port.isConnected
							? "opacity-100 visible"
							: "opacity-0 invisible"
					}`}
					math={`${Math.round(port.value.y * 100) / 100}`}
				/>
			</div>

			<div className="flex-1">
				<div
					className={`transition-opacity duration-200 ease-out z-20 ${
						port.isConnected
							? "opacity-0 invisible"
							: "opacity-100 visible"
					}`}
				>
					<MathInput
						value={Math.round(port.value.z * 100) / 100}
						onChange={onChangeZ}
						style={{
							backgroundColor: "transparent",
							color: "none",
						}}
					/>
				</div>

				<TeX
					className={`flex justify-left text-xl -mt-[2.5625rem] ml-[0.625rem] transition-opacity duration-200 z-10 ease-in ${
						port.isConnected
							? "opacity-100 visible"
							: "opacity-0 invisible"
					}`}
					math={`${Math.round(port.value.z * 100) / 100}`}
				/>
			</div>
		</div>
	);
});
