import { MathInput } from "react-three-linalg";
import TeX from "@matejmazur/react-katex";
import { useNodeStore, useUIStore } from "../../stores";
import type { Operator  } from "../../stores/types";
import { Pane } from "./Pane";
import { DotIcon } from "@radix-ui/react-icons";

export default function Operators() {
  const operators = useNodeStore((state) => state.operators);

  return (
    <>
      {[...operators].map(([id]) => (
        <OperatorPane key={id} id={id} />
      ))}
    </>
  );
}

interface OperatorPaneProps {
  id: number;
}

function OperatorPane({ id }: OperatorPaneProps) {
  const { node, setOperatorValue, setOperatorType } = useNodeStore((state) => ({
    node: state.operators.get(id),
    setOperatorValue: state.setOperatorValue,
    setOperatorType: state.setOperatorType,
  }))

  if (!node) return null;

  const onChangeLeft = (value: number) => setOperatorValue(id, "left", value);
  const onChangeRight = (value: number) => setOperatorValue(id, "right", value);
  const onChangeOperator = (operator: Operator) =>
    setOperatorType(id, operator);

  const tool = useUIStore((state) => state.tool);
  const [link, type, linkId] = tool.split("-");

  return (
    <Pane
      id={id}
      {...node.position}
      {...node.dimensions}
      type={node.type}
      blurred={
        (link === "link" && type !== "value") || linkId === id.toString()
      }
      selectable={
        link === "link" && type === "value" && linkId !== id.toString()
      }
      headerProps={{
        title: node.title,
        bg: "bg-yellow-ext-700 dark:bg-yellow-ext-900",
        text: "text-yellow-ext-200 dark:text-yellow-ext-100",
      }}
      bg="bg-yellow-ext-200 dark:bg-yellow-ext-800"
      className="p-4"
    >
      <div className="flex flex-row text-yellow-ext-900 cursor-text dark:text-yellow-ext-100">
        <div className="flex flex-col grow">
          <MathInput
            value={node.value.left.get()}
            onChange={onChangeLeft}
            style={{
              backgroundColor: "transparent",
              color: "none",
            }}
          />

          <button className="flex items-center justify-center w-8 h-8 mx-auto mt-1 rounded text-yellow-ext-800 dark:text-yellow-ext-300 hover:bg-gray-500/20">
            <DotIcon />
          </button>
        </div>

        <TeX className="flex items-center justify-center w-8 h-12">
          {node.value.operator}
        </TeX>

        <div className="flex flex-col grow">
          <MathInput
            value={node.value.right.get()}
            onChange={onChangeRight}
            style={{
              backgroundColor: "transparent",
              color: "none",
            }}
          />

          <button className="flex items-center justify-center w-8 h-8 mx-auto mt-1 rounded text-yellow-ext-800 dark:text-yellow-ext-300 hover:bg-gray-500/20">
            <DotIcon />
          </button>
        </div>
      </div>
    </Pane>
  );
}
