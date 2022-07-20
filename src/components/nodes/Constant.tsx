import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";

import {
	ConstantNode as _ConstantNode,
	ConstantNodeInputPorts as _ConstantNodeInputPorts,
} from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";

export const ConstantNode = observer(
	({ node }: Node.INodeProps<_ConstantNode>) => {
		const onRemove = () => {
			node.destroy();
		};

		return (
			<Node.Root node={node}>
				<Node.Handle
					title={node.type}
					className="bg-green-ext-700 dark:bg-green-ext-900 text-green-ext-200 dark:text-green-ext-100"
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

				<Node.Body className="bg-green-ext-200 dark:bg-green-ext-800 text-green-ext-900 dark:text-green-ext-100">
					<Node.PortNumberInput
						port={node.inputPorts.x}
						className="shadow-green-ext-500 dark:shadow-green-ext-700 focus:shadow-green-ext-700 dark:focus:shadow-green-ext-500 text-green-ext-900 dark:text-green-ext-200"
					/>

					<Node.InputPorts node={node} />
					<Node.OutputPorts node={node} />
				</Node.Body>
			</Node.Root>
		);
	}
);