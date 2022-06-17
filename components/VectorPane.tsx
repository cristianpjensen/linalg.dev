import { useCallback, useEffect, useState } from "react";
import { ArrowRightIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { useDrag } from "@use-gesture/react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useStore } from "../stores";

interface PaneProps {
  id: number;
  title: string;
  x: number;
  y: number;
}

export default function VectorPane({
  id,
  title,
  x: initX,
  y: initY,
}: PaneProps) {
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
  }, [id]);

  return (
    <div
      className="w-72 h-56 rounded overflow-hidden bg-slate-200 absolute shadow-md hover:shadow-lg transition-shadow"
      style={{ translate: `${x}px ${y}px` }}
    >
      <div
        {...bind()}
        className="flex flex-row flex-nowrap pl-2 w-72 h-8 bg-slate-400"
        style={{
          cursor: pointerDown ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        <div className="flex grow justify-left items-center text-sm text-slate-200 select-none">
          {title}
        </div>

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
      </div>
    </div>
  );
}
