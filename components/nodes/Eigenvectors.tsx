import { CrossCircledIcon } from "@radix-ui/react-icons";
import { observer } from "mobx-react-lite";
import TeX from "@matejmazur/react-katex";

import {
	InputPort as _InputPort,
	EigenvectorsNode as _EigenvectorsNode,
} from "../../node-engine";
import { Tooltip } from "../Tooltip";
import * as Node from "./Node";

export const EigenvectorsNode = observer(
	({ node }: Node.INodeProps<_EigenvectorsNode>) => {
		const onRemove = () => {
			node.destroy();
		};

		const v1 = node.outputPorts.v1.value;
		const v2 = node.outputPorts.v2.value;
		const v3 = node.outputPorts.v3.value;

		const disabledNodes = [];
		if (!node.inputPorts.matrix.isConnected) {
			disabledNodes.push(
				node.outputPorts.v1,
				node.outputPorts.v2,
				node.outputPorts.v3
			);
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
								? `\\begin{bmatrix} ${
										Math.round(v1.x * 100) / 100
								  } & ${Math.round(v1.y * 100) / 100} & ${
										Math.round(v1.z * 100) / 100
								  } \\end{bmatrix}^\\top`
								: "?"
						}
						block
					/>
					<TeX
						math={
							node.inputPorts.matrix.isConnected
								? `\\begin{bmatrix} ${
										Math.round(v2.x * 100) / 100
								  } & ${Math.round(v2.y * 100) / 100} & ${
										Math.round(v2.z * 100) / 100
								  } \\end{bmatrix}^\\top`
								: "?"
						}
						block
					/>
					<TeX
						math={
							node.inputPorts.matrix.isConnected
								? `\\begin{bmatrix} ${
										Math.round(v3.x * 100) / 100
								  } & ${Math.round(v3.y * 100) / 100} & ${
										Math.round(v3.z * 100) / 100
								  } \\end{bmatrix}^\\top`
								: "?"
						}
						block
					/>

					<Node.InputPorts node={node} />
					<Node.OutputPorts node={node} disabled={disabledNodes} />
				</Node.Body>
			</Node.Root>
		);
	}
);
