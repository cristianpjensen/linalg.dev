import { DotIcon } from "@radix-ui/react-icons";
import LineTo from "react-lineto";
import { MathInput } from "react-three-linalg";
import { useNodeStore, ValueNode, VectorNode } from "../../stores/nodes";
import { MathX, MathY, MathZ } from "../icons";
import { Tooltip } from "../Tooltip";
import { Pane } from "./Pane";

export default function Vectors() {
  const vectors = useNodeStore((state) => state.vectors);

  return (
    <>
      {vectors.map((vector) => (
        <VectorPane key={vector.id} vector={vector} />
      ))}
    </>
  );
}

interface VectorPaneProps {
  vector: VectorNode;
}

function VectorPane({
  vector: {
    id,
    title,
    x,
    y,
    width,
    height,
    vectorX,
    vectorY,
    vectorZ,
    linkVectorX,
    linkVectorY,
    linkVectorZ,
  },
}: VectorPaneProps) {
  const setVectorDimension = useNodeStore((state) => state.setVectorDimension);

  const onChangeX = (x: number) => setVectorDimension(id, "x", x);
  const onChangeY = (y: number) => setVectorDimension(id, "y", y);
  const onChangeZ = (z: number) => setVectorDimension(id, "z", z);

  return (
    <Pane
      id={id}
      x={x}
      y={y}
      width={width}
      height={height}
      headerProps={{ title }}
      className="flex gap-4 flex-col p-4"
    >
      <DimensionInput
        id={id}
        dimension="x"
        value={vectorX}
        link={linkVectorX}
        onChange={onChangeX}
      />
      <DimensionInput
        id={id}
        dimension="y"
        value={vectorY}
        link={linkVectorY}
        onChange={onChangeY}
      />
      <DimensionInput
        id={id}
        dimension="z"
        value={vectorZ}
        link={linkVectorZ}
        onChange={onChangeZ}
      />
    </Pane>
  );
}

interface DimensionInputProps {
  id: number;
  value: number;
  link: ValueNode | null;
  dimension: "x" | "y" | "z";
  onChange: (value: number) => void;
}

function DimensionInput({
  id,
  value,
  link,
  dimension,
  onChange,
}: DimensionInputProps) {
  return (
    <div className="flex flex-row flex-nowrap items-center gap-4 pt-1">
      <label
        className={`${
          dimension === "x"
            ? "text-red-600"
            : dimension === "y"
            ? "text-green-600"
            : "text-blue-600"
        } w-3 h-3`}
        htmlFor={dimension}
      >
        {dimension === "x" ? (
          <MathX />
        ) : dimension === "y" ? (
          <MathY />
        ) : (
          <MathZ />
        )}
      </label>

      <div className="grow">
        <MathInput value={value} onChange={onChange} />
      </div>

      <Tooltip tip={`connect ${dimension} to another node`}>
        <button
          id={`${dimension}-${id}`}
          className="flex justify-center items-center h-8 w-8 rounded text-slate-800 hover:bg-gray-500/20"
        >
          <DotIcon />
        </button>

        {link && <LineTo from={`${dimension}-${id}`} to={`${link.id}`} />}
      </Tooltip>
    </div>
  );
}
