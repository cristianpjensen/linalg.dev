import { MathInput } from "react-three-linalg";
import TeX from "@matejmazur/react-katex";
import { useNodeStore, useUIStore } from "../../stores";
import type { Operator, OperatorNode } from "../../stores/nodes";
import { Pane } from "./Pane";

export default function Operators() {
  const operators = useNodeStore((state) => state.operators);

  return (
    <>
      {operators.map((operator) => (
        <OperatorPane key={operator.id} operator={operator} />
      ))}
    </>
  );
}

interface OperatorPaneProps {
  operator: OperatorNode;
}

function OperatorPane({
  operator: { id, title, width, height, x, y, value1, value2, operator },
}: OperatorPaneProps) {
  const { setOperatorValue, setOperatorType } = useNodeStore((state) => ({
    setOperatorValue: state.setOperatorValue,
    setOperatorType: state.setOperatorType,
  }));
  const onChangeLeft = (value: number) => setOperatorValue(id, 1, value);
  const onChangeRight = (value: number) => setOperatorValue(id, 2, value);
  const onChangeOperator = (operator: Operator) =>
    setOperatorType(id, operator);

  const tool = useUIStore((state) => state.tool);
  const [link, type, linkId] = tool.split("-");

  return (
    <Pane
      id={id}
      x={x}
      y={y}
      width={width}
      height={height}
      resizable
      blurred={
        (link === "link" && type !== "value") || linkId === id.toString()
      }
      selectable={
        link === "link" && type === "value" && linkId !== id.toString()
      }
      headerProps={{
        title,
        bg: "bg-yellow-ext-700 dark:bg-yellow-ext-900",
        text: "text-yellow-ext-200 dark:text-yellow-ext-100",
      }}
      bg="bg-yellow-ext-200 dark:bg-yellow-ext-800"
      className="p-4"
    >
      <div className="flex flex-row text-yellow-ext-900 cursor-text dark:text-yellow-ext-100">
        <div className="grow">
          <MathInput
            value={value1}
            onChange={onChangeLeft}
            style={{
              backgroundColor: "transparent",
              color: "none",
            }}
          />
        </div>

        <TeX className="flex items-center justify-center w-4 m-2">
          {operator}
        </TeX>

        <div className="grow">
          <MathInput
            value={value2}
            onChange={onChangeRight}
            style={{
              backgroundColor: "transparent",
              color: "none",
            }}
          />
        </div>
      </div>
    </Pane>
  );
}
