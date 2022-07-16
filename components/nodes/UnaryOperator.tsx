import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";

import {
	InputPort as _InputPort,
	UnaryOperator,
	UnaryOperatorNode as _UnaryOperatorNode,
} from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";

export const UnaryOperatorNode = observer(
	({ node }: Node.INodeProps<_UnaryOperatorNode>) => {
		const onRemove = () => {
			node.destroy();
		};

		const onOperatorChange = (operator: UnaryOperator) => {
			node.inputPorts.operator.value = operator;
		};

		return (
			<Node.Root node={node}>
				<Node.Handle
					title={node.type}
					className="bg-yellow-ext-700 dark:bg-yellow-ext-900 text-yellow-ext-200 dark:text-yellow-ext-100"
				>
					<Tooltip tip="Remove unary operator">
						<button
							onClick={onRemove}
							className="flex items-center justify-center w-8 h-8 hover:bg-gray-300/20"
						>
							<CrossCircledIcon />
						</button>
					</Tooltip>
				</Node.Handle>

				<Node.Body className="bg-yellow-ext-200 dark:bg-yellow-ext-800 text-yellow-ext-900 dark:text-yellow-ext-100">
					<Node.PortNumberInput port={node.inputPorts.x} />

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
