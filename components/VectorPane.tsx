import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useDrag } from "@use-gesture/react";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "../stores";

interface PaneProps {
  id: number;
  x: number;
  y: number;
}

export default function VectorPane({ id, x: initX, y: initY }: PaneProps) {
  const [pointerDown, setPointerDown] = useState(false);

  const pointerDownHandler = () => {
    setPointerDown(true);
  };

  const pointerUpHandler = () => {
    setPointerDown(false);
  };

  useEffect(() => {
    document.addEventListener("pointerdown", pointerDownHandler);
    document.addEventListener("pointerup", pointerUpHandler);

    return () => {
      document.removeEventListener("pointerdown", pointerDownHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
    };
  }, []);

  const { scale, removeVector } = useStore((state) => ({
    scale: state.scale,
    removeVector: state.removeVector,
  }));
  const roundToGrid = (x: number) => Math.round(x / (scale * 24)) * 24;

  const [x, setX] = useState(roundToGrid(initX));
  const [y, setY] = useState(roundToGrid(initY));

  const bind = useDrag(({ offset: [currentX, currentY] }) => {
    setX(roundToGrid(initX + currentX));
    setY(roundToGrid(initY + currentY));
  });

  const onRemove = useCallback(() => {
    removeVector(id);
  }, []);

  return (
    <div
      className="w-72 h-56 rounded overflow-hidden bg-slate-200 absolute shadow-md hover:shadow-lg transition-shadow"
      style={{ translate: `${x}px ${y}px` }}
    >
      <div
        {...bind()}
        className="w-72 h-8 bg-slate-400"
        style={{
          cursor: pointerDown ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        <div className="flex justify-center items-center h-8 w-8">
          <button
            onClick={onRemove}
            className="flex justify-center items-center h-6 w-6 text-slate-200 hover:bg-slate-300/30 rounded"
          >
            <CrossCircledIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
