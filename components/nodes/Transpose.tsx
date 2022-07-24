import { useContext } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import TeX from "@matejmazur/react-katex";

import {
	InputPort as _InputPort,
	TransposeNode as _TransposeNode,
} from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";
import { TransformContext } from "../App";

export const TransposeNode = observer(
	({ node }: Node.INodeProps<_TransposeNode>) => {
		const onRemove = () => {
			node.destroy();
		};

		const m = node.outputPorts.result.value;
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
					<Tooltip tip="Remove eigenvalues node">
						<button
							onClick={onRemove}
							className="flex items-center justify-center w-8 h-8 hover:bg-gray-300/20"
						>
							<CrossCircledIcon />
						</button>
					</Tooltip>
				</Node.Handle>

				<Node.Body className="flex flex-col justify-between bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
					<TeX
						math={`\\begin{bmatrix}${m[0]} & ${m[1]} & ${m[2]}\\\\${m[3]} & ${m[4]} & ${m[5]}\\\\${m[6]} & ${m[7]} & ${m[8]}\\end{bmatrix}`}
						block
					/>

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
	}
);
