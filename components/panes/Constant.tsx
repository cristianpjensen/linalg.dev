import { MathInput } from "react-three-linalg";
import { useNodeStore, useUIStore } from "../../stores";
import type { ConstantNode } from "../../stores/nodes";
import { Pane } from "./Pane";

export default function Constants() {
  const constants = useNodeStore((state) => state.constants);

  return (
    <>
      {constants.map((constant) => (
        <ConstantPane key={constant.id} constant={constant} />
      ))}
    </>
  );
}

interface ConstantPaneProps {
  constant: ConstantNode;
}

function ConstantPane({
  constant: { id, title, width, height, x, y, value },
}: ConstantPaneProps) {
  const setConstantValue = useNodeStore((state) => state.setConstantValue);
  const onChange = (value: number) => setConstantValue(id, value);

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
        bg: "bg-green-ext-700 dark:bg-green-ext-900",
        text: "text-green-ext-200 dark:text-green-ext-100",
      }}
      bg="bg-green-ext-200 dark:bg-green-ext-800"
      className="flex flex-col gap-4 p-4"
    >
      <div className="border-yellow-900 grow cursor-text text-green-ext-900 dark:text-green-ext-100">
        <MathInput value={value} onChange={onChange} style={{
          backgroundColor: "transparent",
          color: "none",
        }} />
      </div>
    </Pane>
  );
}
