import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import TeX from "@matejmazur/react-katex";

import { NormNode as _NormNode } from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";

export const NormNode = observer(({ node }: Node.INodeProps<_NormNode>) => {
	const onRemove = () => {
		node.destroy();
	};

	const disabledNodes = [];
	if (!node.inputPorts.vector.isConnected) {
		disabledNodes.push(node.outputPorts.result);
	}

	return (
		<Node.Root node={node}>
			<Node.Handle
				title={node.type}
				className="bg-slate-700 dark:bg-slate-900 text-slate-200 dark:text-slate-100"
			>
				<Tooltip tip="Remove norm node">
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
					math={
						node.inputPorts.vector.isConnected
							? `${Math.round(node.outputPorts.result.value * 100) / 100}`
							: "?"
					}
          block
				/>

				<Node.InputPorts node={node} />
				<Node.OutputPorts node={node} disabled={disabledNodes} />
			</Node.Body>
		</Node.Root>
	);
});
