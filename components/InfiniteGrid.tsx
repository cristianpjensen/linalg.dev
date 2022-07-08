import React, { useCallback, useState } from "react";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";
import { RecoilState, useRecoilCallback } from "recoil";
import { useUIStore } from "../stores";
import {
  CONSTANT_HEIGHT,
  CONSTANT_WIDTH,
  GRID_SIZE,
  OPERATOR_HEIGHT,
  OPERATOR_WIDTH,
  VECTOR_HEIGHT,
  VECTOR_WIDTH,
} from "./constants";
import {
  constants,
  defaultConstant,
  defaultOperator,
  defaultVector,
  ids,
  operators,
  vectors,
} from "../stores/atoms";
import {
  VectorNode,
  NodeType,
  OperatorNode,
  ConstantNode,
} from "../stores/types";

const useGesture = createUseGesture([dragAction, pinchAction]);

interface InfiniteGridProps {
  children: React.ReactNode;
}

export default function InfiniteGrid({ children }: InfiniteGridProps) {
  const [pointerDown, setPointerDown] = useState(false);
  const onPointerDown = () => setPointerDown(true);
  const onPointerUp = () => setPointerDown(false);

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

  const createVector = useCreateNode<VectorNode>(
    vectors,
    "vector",
    defaultVector
  );
  const createConstant = useCreateNode<ConstantNode>(
    constants,
    "constant",
    defaultConstant
  );
  const createOperator = useCreateNode<OperatorNode>(
    operators,
    "operator",
    defaultOperator
  );

  const onGridClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tool === "") {
        return;
      }

      if (tool === "vector") {
        const position = getNodePosition(
          { x, y },
          { x: e.clientX, y: e.clientY },
          { width: VECTOR_WIDTH, height: VECTOR_HEIGHT },
          scale
        );

        createVector(position.x, position.y);
        setTool("");
      }

      if (tool === "constant") {
        const position = getNodePosition(
          { x, y },
          { x: e.clientX, y: e.clientY },
          { width: CONSTANT_WIDTH, height: CONSTANT_HEIGHT },
          scale
        );

        createConstant(position.x, position.y);
        setTool("");
      }

      if (tool === "operator") {
        const position = getNodePosition(
          { x, y },
          { x: e.clientX, y: e.clientY },
          { width: OPERATOR_WIDTH, height: OPERATOR_HEIGHT },
          scale
        );

        createOperator(position.x, position.y);
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
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
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

let id = 0;
const getId = () => id++;

function useCreateNode<T>(
  atomFamily: (param: number) => RecoilState<T>,
  type: NodeType,
  defaultValue: T
) {
  return useRecoilCallback(
    ({ set }) =>
      (x: number, y: number) => {
        const id = getId();

        set(ids, (ids) => [...ids, { id, type }]);
        set(atomFamily(id), {
          ...defaultValue,
          position: { x, y },
        });
      },
    []
  );
}

function getNodePosition(
  position: {
    x: number;
    y: number;
  },
  mouse: {
    x: number;
    y: number;
  },
  node: {
    width: number;
    height: number;
  },
  scale: number
) {
  return {
    x:
      Math.round(
        (mouse.x - position.x - node.width * 0.5) / (GRID_SIZE * scale)
      ) * GRID_SIZE,
    y:
      Math.round(
        (mouse.y - position.y - node.height * 0.5) / (GRID_SIZE * scale)
      ) * GRID_SIZE,
  };
}
