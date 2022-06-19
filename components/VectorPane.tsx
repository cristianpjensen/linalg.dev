import { useState } from "react";
import { ArrowRightIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import * as HoverCard from "@radix-ui/react-hover-card";
import { MathInput } from "react-three-linalg";
import { useStore } from "../stores";
import MoveablePane from "./MoveablePane";

interface PaneProps {
  id: number;
  title: string;
}

// TODO: Render this component on load once, so it doesn't take forever for it
// to render the first time when used. This long loading is caused by the
// MathInput component.
export default function VectorPane({ id, title }: PaneProps) {
  const {
    vector,
    removeVector,
    setVectorX,
    setVectorY,
    setVectorZ,
    setVectorPane,
  } = useStore((state) => ({
    vector: state.vectors.find((v) => v.id === id),
    removeVector: state.removeVector,
    setVectorX: state.setVectorX,
    setVectorY: state.setVectorY,
    setVectorZ: state.setVectorZ,
    setVectorPane: state.setVectorPane,
  }));

  if (!vector) {
    return null;
  }

  const [x] = useState(vector.canvasX);
  const [y] = useState(vector.canvasY);

  const onDragEnd = (x: number, y: number) => {
    setVectorPane(id, x, y);
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
          <HoverCard.Root>
            <HoverCard.Trigger>
              <button
                onClick={onRemove}
                className="flex justify-center items-center h-8 w-8 text-slate-200 hover:bg-slate-300/30"
              >
                <CrossCircledIcon />
              </button>
            </HoverCard.Trigger>

            <HoverCard.Content className="bg-slate-900 text-white p-2 rounded text-xs max-w-40 text-center">
              remove vector
            </HoverCard.Content>
          </HoverCard.Root>

          <HoverCard.Root>
            <HoverCard.Trigger>
              <button className="flex justify-center items-center h-8 w-8 text-slate-200 hover:bg-slate-300/30">
                <ArrowRightIcon />
              </button>
            </HoverCard.Trigger>

            <HoverCard.Content className="bg-slate-900 text-white p-2 rounded text-xs max-w-40 text-center">
              connect to another node
            </HoverCard.Content>
          </HoverCard.Root>
        </>
      }
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-nowrap items-center gap-4">
          <label className="text-red-500" htmlFor="x">
            x:
          </label>
          <MathInput value={vector.vector.x} onChange={onEditX} />
          <div>{Math.round((vector.vector.x + Number.EPSILON) * 100) / 100}</div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="text-green-500" htmlFor="y">
            y:
          </label>
          <MathInput value={vector.vector.y} onChange={onEditY} />
          <div>{Math.round((vector.vector.y + Number.EPSILON) * 100) / 100}</div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="text-blue-500" htmlFor="z">
            z:
          </label>
          <MathInput value={vector.vector.z} onChange={onEditZ} />
          <div>{Math.round((vector.vector.z + Number.EPSILON) * 100) / 100}</div>
        </div>
      </div>
    </MoveablePane>
  );
}
