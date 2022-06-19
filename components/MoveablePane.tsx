import { useDrag } from "@use-gesture/react";
import { useState } from "react";
import { usePointerDown } from "../hooks/usePointerDown";
import { useStore } from "../stores";

interface MoveablePaneProps {
  title: string;
  x: number;
  y: number;
  onDragEnd?: (x: number, y: number) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  headerChildren?: React.ReactNode;
  headerStyle?: React.CSSProperties;
  headerClassName?: string;
}

export default function MoveablePane({
  title,
  x: initX,
  y: initY,
  onDragEnd,
  children,
  style,
  className,
  headerChildren,
  headerStyle,
  headerClassName,
}: MoveablePaneProps) {
  const scale = useStore((state) => state.scale);
  const roundToGrid = (x: number) => Math.round(x / (scale * 24)) * 24;
  const pointerDown = usePointerDown();

  const [x, setX] = useState(roundToGrid(initX));
  const [y, setY] = useState(roundToGrid(initY));

  const bind = useDrag(({ offset: [ox, oy], last }) => {
    const currentX = roundToGrid(initX + ox);
    const currentY = roundToGrid(initY + oy);

    setX(currentX);
    setY(currentY);

    if (last && onDragEnd) {
      onDragEnd(currentX, currentY);
    }
  });

  return (
    <div
      className={`${
        className ? className : "bg-slate-300"
      } w-72 rounded overflow-hidden absolute shadow-md hover:shadow-lg transition-shadow`}
      style={{ translate: `${x}px ${y}px`, ...style }}
    >
      <div
        {...bind()}
        className={`${
          headerClassName ? headerClassName : "bg-slate-500"
        } flex flex-row flex-nowrap pl-2 w-full h-8 touch-none`}
        style={{ cursor: pointerDown ? "grabbing" : "grab", ...headerStyle }}
      >
        <div className="flex grow justify-left items-center text-sm text-slate-200 select-none">
          {title}
        </div>

        {headerChildren}
      </div>

      {children}
    </div>
  );
}
