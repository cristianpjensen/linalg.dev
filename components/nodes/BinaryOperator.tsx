import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";

import {
	InputPort as _InputPort,
	BinaryOperator,
	BinaryOperatorNode as _BinaryOperatorNode,
} from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";

export const BinaryOperatorNode = observer(
	({ node }: Node.INodeProps<_BinaryOperatorNode>) => {
		const onRemove = () => {
			node.destroy();
		};

		return (
			<Node.Root node={node}>
				<Node.Handle
					title={node.type}
					className="bg-yellow-ext-700 dark:bg-yellow-ext-900 text-yellow-ext-200 dark:text-yellow-ext-100"
				>
					<Tooltip tip="Remove binary operator">
						<button
							onClick={onRemove}
							className="flex items-center justify-center w-8 h-8 hover:bg-gray-300/20"
						>
							<CrossCircledIcon />
						</button>
					</Tooltip>
				</Node.Handle>

				<Node.Body className="bg-yellow-ext-200 dark:bg-yellow-ext-800 text-yellow-ext-900 dark:text-yellow-ext-100">
					<div className="flex flex-col justify-between w-full h-full pb-2">
						<Node.PortSelectInput
							port={node.inputPorts.operator}
							values={Object.values(BinaryOperator)}
							className="bg-yellow-ext-300 text-yellow-ext-900 dark:bg-yellow-ext-900 dark:text-yellow-ext-100"
						/>
						<Node.PortNumberInput port={node.inputPorts.x} />
						<Node.PortNumberInput port={node.inputPorts.y} />
					</div>

					<Node.InputPorts
						node={node}
						omit={[node.inputPorts.operator]}
					/>
					<Node.OutputPorts node={node} />
				</Node.Body>
			</Node.Root>
		);
	}
);
