import React, { useCallback, useEffect, useState } from "react";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import { useUIStore } from "../stores";
import { useNodeStore } from "../stores/nodes";
import { GRID_SIZE, VECTOR_HEIGHT, VECTOR_WIDTH } from "./constants";

const useGesture = createUseGesture([dragAction, pinchAction]);

interface InfiniteGridProps {
  children: React.ReactNode;
}

export default function InfiniteGrid({ children }: InfiniteGridProps) {
  const [pointerDown, setPointerDown] = useState(false);

  const pointerDownHandler = () => {
    setPointerDown(true);
  };

  const pointerUpHandler = () => {
    setPointerDown(false);
  };

  useEffect(() => {
    const handler = (e: any) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    document.addEventListener("wheel", handler, { passive: false });
    document.addEventListener("pointerdown", pointerDownHandler);
    document.addEventListener("pointerup", pointerUpHandler);

    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
      document.removeEventListener("wheel", handler);
      document.removeEventListener("pointerdown", pointerDownHandler);
      document.removeEventListener("pointerup", pointerUpHandler);
    };
  }, []);

  const { x, setX, y, setY, scale, setXYS, tool, setTool } = useUIStore(
    (state) => ({
      x: state.x,
      setX: state.setX,
      y: state.y,
      setY: state.setY,
      scale: state.scale,
      setXYS: state.setXYS,
      tool: state.tool,
      setTool: state.setTool,
    })
  );

  const { addVector, addConstant, addOperator } = useNodeStore((state) => ({
    addVector: state.addVector,
    addConstant: state.addConstant,
    addOperator: state.addOperator,
  }));

  const onGridClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tool === "") {
        return;
      }

      const currentX =
        Math.round((e.pageX - x - VECTOR_WIDTH * 0.5) / (GRID_SIZE * scale)) *
        GRID_SIZE;
      const currentY =
        Math.round((e.pageY - y - VECTOR_HEIGHT * 0.5) / (GRID_SIZE * scale)) *
        GRID_SIZE;

      if (tool === "vector") {
        addVector("Vector", currentX, currentY);
        setTool("");
      }

      if (tool === "constant") {
        addConstant("Constant", currentX, currentY);
        setTool("");
      }

      if (tool === "operator") {
        addOperator("Operator", "+", currentX, currentY);
        setTool("");
      }
    },
    [tool]
  );

  const bind = useGesture({
    onDrag: ({ initial: [ix, iy], xy: [mx, my], first, memo }) => {
      if (tool !== "") {
        return;
      }

      if (first) {
        memo = [x, y];
      }

      setX(memo[0] + (mx - ix));
      setY(memo[1] + (my - iy));

      return memo;
    },
    onPinch: ({
      origin: [ox, oy],
      movement: [ms],
      direction: [dir],
      first,
      memo,
    }) => {
      if ((scale <= 0.2 && dir === -1) || (scale >= 2 && dir === 1)) {
        return memo;
      }

      if (first) {
        const tx = ox - x + 12;
        const ty = oy - y + 12;
        memo = [x, y, tx, ty, scale];
      }

      const currentX = memo[0] - (ms - 1) * memo[2];
      const currentY = memo[1] - (ms - 1) * memo[3];

      setXYS(currentX, currentY, Math.min(Math.max(ms * memo[4], 0.2), 2));

      return memo;
    },
  });

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="absolute top-0 bottom-0 left-0 right-0 bg-repeat select-none bg-offwhite dark:bg-offblack touch-none"
        style={{
          backgroundImage:
            "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgB7dOrEcMwEEBByTYITCkpITA9GaunQJeQUgIN9IkEUoRHu+Tm4L2Ziymlx7qurxjjmXM+9n3/hIks27Y9W2u3Wut9hAiTWcbx/6VHOMNkllLKu0f4jhfo8wgAAAAAAAAAAAAAAAAAAAAX9APY5yL/ZyiGWAAAAABJRU5ErkJggg==)",
          backgroundSize: scale * GRID_SIZE,
          backgroundPositionX: x,
          backgroundPositionY: y,
          cursor:
            tool === "" ? (pointerDown ? "grabbing" : "grab") : "crosshair",
        }}
        onClick={onGridClick}
        {...bind()}
      >
        <div
          className="w-0 h-0"
          style={{ translate: `${x}px ${y}px`, transform: `scale(${scale})` }}
        >
          <div
            className="absolute w-2 bg-gray-400 rounded-sm dark:bg-gray-600"
            style={{ height: 1.25, marginLeft: -3.375 }}
          />
          <div
            className="absolute h-2 bg-gray-400 rounded-sm dark:bg-gray-600"
            style={{ width: 1.25, marginTop: -3.375 }}
          />
        </div>
      </div>

      <div
        className="w-0 h-0"
        style={{
          translate: `${x}px ${y}px`,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
