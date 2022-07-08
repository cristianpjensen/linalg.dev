import { useCallback } from "react";
import { MathInput } from "react-three-linalg";
import { useNodeStore, useUIStore } from "../../stores";
import { Pane } from "./Pane";

export default function Constants() {
  const constants = useNodeStore((state) => state.constants);

  return (
    <>
      {[...constants].map(([id]) => (
        <ConstantPane key={id} id={id} />
      ))}
    </>
  );
}

interface ConstantPaneProps {
  id: number;
}

function ConstantPane({ id }: ConstantPaneProps) {
  const { node, setConstantValue } = useNodeStore((state) => ({
    node: state.constants.get(id),
    setConstantValue: state.setConstantValue,
  }));
  if (!node) return null;

  const onChange = useCallback(
    (value: number) => setConstantValue(id, value),
    [id, setConstantValue]
  );

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
        bg: "bg-green-ext-700 dark:bg-green-ext-900",
        text: "text-green-ext-200 dark:text-green-ext-100",
      }}
      bg="bg-green-ext-200 dark:bg-green-ext-800"
      className="flex flex-col gap-4 p-4"
    >
      <div className="border-yellow-900 grow cursor-text text-green-ext-900 dark:text-green-ext-100">
        <MathInput
          value={node.value.get()}
          onChange={onChange}
          style={{
            backgroundColor: "transparent",
            color: "none",
          }}
        />
      </div>
    </Pane>
  );
}
