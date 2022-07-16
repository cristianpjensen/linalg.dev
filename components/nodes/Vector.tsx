import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import TeX from "@matejmazur/react-katex";

import { VectorNode as _VectorNode } from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";

export const VectorNode = observer(({ node }: Node.INodeProps<_VectorNode>) => {
	const onRemove = () => {
		node.destroy();
	};

	const { x, y, z, origin } = node.inputPorts;

	return (
		<Node.Root node={node}>
			<Node.Handle
				title={node.type}
				className="bg-slate-700 dark:bg-slate-900 text-slate-200 dark:text-slate-100"
			>
				<Tooltip tip="Remove constant">
					<button
						onClick={onRemove}
						className="flex items-center justify-center w-8 h-8 hover:bg-gray-300/20"
					>
						<CrossCircledIcon />
					</button>
				</Tooltip>
			</Node.Handle>

			<Node.Body className="flex flex-col justify-evenly bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100">
        <Node.PortNumberInput port={x} />
        <Node.PortNumberInput port={y} />
        <Node.PortNumberInput port={z} />

				<TeX
					math={`\\begin{bmatrix} ${origin.value.x} & ${origin.value.y} & ${origin.value.z} \\end{bmatrix}^\\top`}
					block
				/>

				<Node.InputPorts node={node} />
				<Node.OutputPorts node={node} />
			</Node.Body>
		</Node.Root>
	);
});
