import { MathInput } from "react-three-linalg";
import TeX from "@matejmazur/react-katex";
import { DotIcon } from "@radix-ui/react-icons";
import { selector, useRecoilState, useRecoilValue } from "recoil";
import { useUIStore } from "../../stores";
import { Pane } from "./Pane";
import { ids, operators } from "../../stores/atoms";

const operatorIds = selector<Array<number>>({
  key: "operator-ids",
  get: ({ get }) =>
    get(ids)
      .filter((id) => id.type === "operator")
      .map((id) => id.id),
});

export default function Operators() {
  const ids = useRecoilValue(operatorIds);

  return (
    <>
      {ids.map((id) => (
        <OperatorPane key={id} id={id} />
      ))}
    </>
  );
}

interface OperatorPaneProps {
  id: number;
}

function OperatorPane({ id }: OperatorPaneProps) {
  const tool = useUIStore((state) => state.tool);
  const [link, type, linkId] = tool.split("-");

  const [node, setNode] = useRecoilState(operators(id));

  const onChangeLeft = (left: number) =>
    setNode({ ...node, values: { ...node.values, left } });
  const onChangeRight = (right: number) =>
    setNode({ ...node, values: { ...node.values, right } });

  const onDrag = (x: number, y: number) => {
    setNode({ ...node, position: { x, y } });
  };

  return (
    <Pane
      id={id}
      {...node.position}
      {...node.dimensions}
      onDrag={onDrag}
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
            value={node.values.left}
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
          {node.operator}
        </TeX>

        <div className="flex flex-col grow">
          <MathInput
            value={node.values.right}
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
