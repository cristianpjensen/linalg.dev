import { useState } from "react";
import { CrossCircledIcon, DotIcon } from "@radix-ui/react-icons";
import { MathInput } from "react-three-linalg";
import { MathX, MathY, MathZ } from "./icons";
import { useNodeStore } from "../stores/nodes";
import MoveablePane from "./MoveablePane";
import { Tooltip } from "./Tooltip";

interface PaneProps {
  id: number;
  title: string;
}

// TODO: Render this component on load once, so it doesn't take forever for it
// to render the first time when used. This long loading is caused by the
// MathInput component.
export default function VectorPane({ id, title }: PaneProps) {
  const { vector, removeVector, setVectorX, setVectorY, setVectorZ } =
    useNodeStore((state) => ({
      vector: state.vectors.find((v) => v.id === id),
      removeVector: state.removeVector,
      setVectorX: state.setVectorX,
      setVectorY: state.setVectorY,
      setVectorZ: state.setVectorZ,
    }));

  if (!vector) {
    return null;
  }

  const [x] = useState(vector.x);
  const [y] = useState(vector.y);

  const onDragEnd = (x: number, y: number) => {
    vector.x = x;
    vector.y = y;
  };
  const onRemove = () => removeVector(id);
  const onEditX = (x: number) => setVectorX(id, x);
  const onEditY = (y: number) => setVectorY(id, y);
  const onEditZ = (z: number) => setVectorZ(id, z);

  return (
    <MoveablePane
      title={title}
      x={x}
      y={y}
      onDragEnd={onDragEnd}
      headerChildren={
        <>
          <Tooltip tip="remove vector">
            <button
              onClick={onRemove}
              className="flex justify-center items-center h-8 w-8 text-slate-200 hover:bg-slate-300/30"
            >
              <CrossCircledIcon />
            </button>
          </Tooltip>
        </>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-row flex-nowrap items-center gap-4">
          <label className="text-red-600 w-3 h-3" htmlFor="x">
            <MathX />
          </label>

          <div className="grow">
            <MathInput value={vector.vectorX} onChange={onEditX} />
          </div>

          <Tooltip tip="connect to another node">
            <button className="flex justify-center items-center h-8 w-8 rounded text-slate-800 hover:bg-slate-400/30">
              <DotIcon />
            </button>
          </Tooltip>
        </div>

        <div className="flex flex-row flex-nowrap items-center gap-4">
          <label className="text-green-600 w-3 h-3" htmlFor="y">
            <MathY />
          </label>

          <div className="grow">
            <MathInput value={vector.vectorY} onChange={onEditY} />
          </div>

          <Tooltip tip="connect to another node">
            <button className="flex justify-center items-center h-8 w-8 rounded text-slate-800 hover:bg-slate-400/30">
              <DotIcon />
            </button>
          </Tooltip>
        </div>

        <div className="flex flex-row flex-nowrap items-center gap-4">
          <label className="text-blue-600 w-3 h-3" htmlFor="z">
            <MathZ />
          </label>

          <div className="grow">
            <MathInput value={vector.vectorZ} onChange={onEditZ} />
          </div>

          <Tooltip tip="connect to another node">
            <button className="flex justify-center items-center h-8 w-8 rounded text-slate-800 hover:bg-slate-400/30">
              <DotIcon />
            </button>
          </Tooltip>
        </div>
      </div>
    </MoveablePane>
  );
}
