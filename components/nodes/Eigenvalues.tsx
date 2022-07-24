import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import TeX from "@matejmazur/react-katex";

import {
	InputPort as _InputPort,
	EigenvaluesNode as _EigenvaluesNode,
} from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";

export const EigenvaluesNode = observer(
	({ node }: Node.INodeProps<_EigenvaluesNode>) => {
		const onRemove = () => {
			node.destroy();
		};

		const { e1, e2, e3, i1, i2, i3 } = node.outputPorts;

		const disabledNodes = [];
		if (node.inputPorts.matrix.isConnected) {
			if (i1.value) disabledNodes.push(e1);
			if (i2.value) disabledNodes.push(e2);
			if (i3.value) disabledNodes.push(e3);
		} else {
			disabledNodes.push(e1, e2, e3);
		}

		return (
			<Node.Root node={node}>
				<Node.Handle
					title={node.type}
					className="bg-purple-ext-700 dark:bg-purple-ext-900 text-purple-ext-200 dark:text-purple-ext-100"
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

				<Node.Body className="flex flex-col justify-between bg-purple-ext-200 dark:bg-purple-ext-800 text-purple-ext-900 dark:text-purple-ext-100">
					<TeX
						math={
							node.inputPorts.matrix.isConnected
								? `${Math.round(e1.value * 100) / 100} ${
										i1.value
											? i1.value > 0
												? `+${
														Math.round(
															i1.value * 100
														) / 100
												  }i`
												: `${
														Math.round(
															i1.value * 100
														) / 100
												  }i`
											: ""
								  }`
								: "?"
						}
						block
					/>
					<TeX
						math={
							node.inputPorts.matrix.isConnected
								? `${Math.round(e2.value * 100) / 100} ${
										i2.value
											? i2.value > 0
												? `+${
														Math.round(
															i2.value * 100
														) / 100
												  }i`
												: `${
														Math.round(
															i2.value * 100
														) / 100
												  }i`
											: ""
								  }`
								: "?"
						}
						block
					/>
					<TeX
						math={
							node.inputPorts.matrix.isConnected
								? `${Math.round(e3.value * 100) / 100} ${
										i3.value
											? i3.value > 0
												? `+${
														Math.round(
															i3.value * 100
														) / 100
												  }i`
												: `${
														Math.round(
															i3.value * 100
														) / 100
												  }i`
											: ""
								  }`
								: "?"
						}
						block
					/>

					<Node.InputPorts node={node} />
					<Node.OutputPorts
						node={node}
						omit={[
							node.outputPorts.i1,
							node.outputPorts.i2,
							node.outputPorts.i3,
						]}
						disabled={disabledNodes}
					/>
				</Node.Body>
			</Node.Root>
		);
	}
);
