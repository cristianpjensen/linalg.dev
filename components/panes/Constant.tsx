import { MathInput } from "react-three-linalg";
import { selector, useRecoilState, useRecoilValue } from "recoil";
import { constants, ids } from "../../stores/atoms";
import { useUIStore } from "../../stores";
import { Pane } from "./Pane";

const constantIds = selector<Array<number>>({
  key: "constant-ids",
  get: ({ get }) =>
    get(ids)
      .filter((id) => id.type === "constant")
      .map((id) => id.id),
});

export default function Constants() {
  const ids = useRecoilValue(constantIds);

  return (
    <>
      {ids.map((id) => (
        <ConstantPane key={id} id={id} />
      ))}
    </>
  );
}

interface ConstantPaneProps {
  id: number;
}

function ConstantPane({ id }: ConstantPaneProps) {
  const tool = useUIStore((state) => state.tool);
  const [link, type, linkId] = tool.split("-");

  const [node, setNode] = useRecoilState(constants(id));

  const onChange = (value: number) => setNode({ ...node, value });

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
        bg: "bg-green-ext-700 dark:bg-green-ext-900",
        text: "text-green-ext-200 dark:text-green-ext-100",
      }}
      bg="bg-green-ext-200 dark:bg-green-ext-800"
      className="flex flex-col gap-4 p-4"
    >
      <div className="border-yellow-900 grow cursor-text text-green-ext-900 dark:text-green-ext-100">
        <MathInput
          value={node.value}
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
