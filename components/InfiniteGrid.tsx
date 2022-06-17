import React, { useCallback, useEffect, useState } from "react";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import { useStore } from "../stores";

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

  const [x, setX] = useState(400);
  const [y, setY] = useState(400);
  const { scale, setScale, tool, addVector } = useStore((state) => ({
    scale: state.scale,
    setScale: state.setScale,
    tool: state.tool,
    addVector: state.addVector,
  }));

  const onGridClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tool !== "Vector") {
        return;
      }

      addVector(e.pageX - x, e.pageY - y);
    },
    [tool]
  );

  const bind = useGesture(
    {
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
        offset: [currentScale],
        first,
        memo,
      }) => {
        if (tool !== "") {
          return;
        }

        if (first) {
          const tx = ox - (x + 12);
          const ty = oy - (y + 12);
          memo = [x, y, tx, ty];
        }

        const currentX = memo[0] - (ms - 1) * memo[2];
        const currentY = memo[1] - (ms - 1) * memo[3];

        setScale(currentScale);
        setX(currentX);
        setY(currentY);

        return memo;
      },
    },
    {
      pinch: { scaleBounds: { min: 0.2, max: 2 } },
    }
  );

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div
        className="bg-slate-100 absolute top-0 bottom-0 left-0 right-0 bg-repeat touch-none select-none"
        style={{
          backgroundImage:
            "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgB7dOrEcMwEEBByTYITCkpITA9GaunQJeQUgIN9IkEUoRHu+Tm4L2Ziymlx7qurxjjmXM+9n3/hIks27Y9W2u3Wut9hAiTWcbx/6VHOMNkllLKu0f4jhfo8wgAAAAAAAAAAAAAAAAAAAAX9APY5yL/ZyiGWAAAAABJRU5ErkJggg==)",
          backgroundSize: scale * 24,
          backgroundPositionX: x,
          backgroundPositionY: y,
          cursor:
            tool === "" ? (pointerDown ? "grabbing" : "grab") : "crosshair",
        }}
        onClick={onGridClick}
        {...bind()}
      />
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
