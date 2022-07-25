import { useContext } from "react";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import TeX from "@matejmazur/react-katex";

import { MatrixMultiplicationNode as _MatrixMultiplicationNode } from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";
import { TransformContext } from "../App";

export const MatrixMultiplicationNode = observer(
	({ node }: Node.INodeProps<_MatrixMultiplicationNode>) => {
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
					<Tooltip tip="Remove matrix multiplication node">
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
						math={`\\begin{bmatrix}${
							Math.round(m[0] * 100) / 100
						} & ${Math.round(m[1] * 100) / 100} & ${
							Math.round(m[2] * 100) / 100
						}\\\\${Math.round(m[3] * 100) / 100} & ${
							Math.round(m[4] * 100) / 100
						} & ${Math.round(m[5] * 100) / 100}\\\\${
							Math.round(m[6] * 100) / 100
						} & ${Math.round(m[7] * 100) / 100} & ${
							Math.round(m[8] * 100) / 100
						}\\end{bmatrix}`}
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
