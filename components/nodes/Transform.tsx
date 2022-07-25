import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import TeX from "@matejmazur/react-katex";

import { TransformNode as _TransformNode } from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";

export const TransformNode = observer(
	({ node }: Node.INodeProps<_TransformNode>) => {
		const onRemove = () => {
			node.destroy();
		};

		const v = node.outputPorts.result.value;

		return (
			<Node.Root node={node}>
				<Node.Handle
					title={node.type}
					className="bg-slate-700 dark:bg-slate-900 text-slate-200 dark:text-slate-100"
				>
					<Tooltip tip="Remove transform node">
						<button
							onClick={onRemove}
							className="flex items-center justify-center w-8 h-8 hover:bg-gray-300/20"
						>
							<CrossCircledIcon />
						</button>
					</Tooltip>
				</Node.Handle>

				<Node.Body className="flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
					<TeX
						math={`\\begin{bmatrix} ${
							Math.round(v.x * 100) / 100
						} & ${Math.round(v.y * 100) / 100} & ${
							Math.round(v.z * 100) / 100
						} \\end{bmatrix}^\\top`}
						block
					/>

					<Node.InputPorts node={node} />
					<Node.OutputPorts node={node} />
				</Node.Body>
			</Node.Root>
		);
	}
);
