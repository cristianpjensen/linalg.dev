import { CrossCircledIcon } from "@radix-ui/react-icons";
import { MathInput } from "react-three-linalg";
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

		const onValueChange = (value: number) => {
			node.inputPorts.x.value = value;
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
					<Node.PortNumberInput port={node.inputPorts.x} />

					<Node.InputPorts node={node} />
					<Node.OutputPorts node={node} />
				</Node.Body>
			</Node.Root>
		);
	}
);
