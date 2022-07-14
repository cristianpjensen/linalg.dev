import { CrossCircledIcon } from "@radix-ui/react-icons";
import { MathInput } from "react-three-linalg";
import { observer } from "mobx-react-lite";
import { set } from "mobx";

import {
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

		const onValueChange = (value: number) => {
			set(node.inputPorts.x, "value", value);
		};

		const onOperatorChange = (operator: UnaryOperator) => {
			set(node.inputPorts.operator, "value", operator);
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
					<div
						className={`transition-opacity duration-200 ease-out z-20 ${
							node.inputPorts.x.isConnected
								? "opacity-0 invisible"
								: "opacity-100 visible"
						}`}
					>
						<MathInput
							value={node.inputPorts.x.value}
							onChange={onValueChange}
							style={{
								backgroundColor: "transparent",
								color: "none",
							}}
						/>
					</div>

					<div
						className={`font-math text-2xl -mt-[2.5625rem] ml-[0.625rem] transition-opacity duration-200 z-10 ease-out ${
							node.inputPorts.x.isConnected
								? "opacity-100 visible"
								: "opacity-0 invisible"
						}`}
					>
						{Math.round(node.inputPorts.x.value * 100) / 100}
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
