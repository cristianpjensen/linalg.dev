import Draggable, { DraggableData } from "react-draggable";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { usePointerDown } from "../../hooks/usePointerDown";
import { useNodeStore } from "../../stores/nodes";
import { useUIStore } from "../../stores";
import { GRID_SIZE } from "../constants";
import { Tooltip } from "../Tooltip";

import "react-resizable/css/styles.css";

interface PaneProps {
  children?: React.ReactNode;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  headerProps: PaneHeaderProps;
  className?: string;
  blurred?: boolean;
  selectable?: boolean;
  bg?: string;
  resizable?: boolean;
}

export function Pane({
  children,
  id,
  x,
  y,
  width,
  height,
  headerProps,
  className,
  blurred = false,
  selectable = false,
  bg = "bg-zinc-200 dark:bg-zinc-800",
  resizable = false,
}: PaneProps) {
  const { scale, setTool } = useUIStore((state) => ({
    scale: state.scale,
    setTool: state.setTool,
  }));
  const setNodePosition = useNodeStore((state) => state.setNodePosition);
  const setNodeDimensions = useNodeStore((state) => state.setNodeDimensions);

  const onDragStop = (_: unknown, { x, y }: DraggableData) => {
    setNodePosition(id, x, y);
  };

  const onResizeStop = (
    _: unknown,
    { size: { width, height } }: ResizeCallbackData
  ) => {
    setNodeDimensions(id, width, height);
  };

  const onSelectClick = () => {
    setTool("");
  };

  return (
    <Draggable
      defaultPosition={{ x, y }}
      grid={[GRID_SIZE * scale, GRID_SIZE * scale]}
      scale={scale}
      onStop={onDragStop}
      handle=".handle"
    >
      <div className={`absolute ${blurred && "opacity-40 pointer-events-none"}`}>
        <ResizableBox
          width={width}
          height={height}
          transformScale={scale}
          resizeHandles={resizable ? ["se"] : []}
          onResizeStop={onResizeStop}
          axis={resizable ? "both" : "none"}
          minConstraints={[width, height]}
          draggableOpts={{
            grid: [GRID_SIZE * scale, GRID_SIZE * scale],
          }}
        >
          <div
            className={`w-full h-full rounded overflow-hidden shadow-md hover:shadow-lg transition-shadow ${bg}`}
          >
            <PaneHeader id={id} {...headerProps} />
            <div className={className}>{children}</div>
          </div>
          {selectable && (
            <div
              className="absolute transition-opacity bg-blue-400 border-2 border-blue-900 rounded opacity-0 cursor-pointer -top-2 -left-2 hover:opacity-30"
              style={{ width: width + 16, height: height + 16 }}
              onClick={onSelectClick}
            />
          )}
        </ResizableBox>
      </div>
    </Draggable>
  );
}

interface PaneHeaderProps {
  children?: React.ReactNode;
  title?: string;
  bg?: string;
  text?: string;
}

function PaneHeader({
  children,
  id,
  title = "",
  bg = "bg-zinc-500 dark:bg-zinc-300",
  text = "text-zinc-100 dark:text-zinc-900",
}: PaneHeaderProps & { id: number }) {
  const removeNode = useNodeStore((state) => state.removeNode);
  const onRemove = () => {
    removeNode(id);
  };

  const pointerDown = usePointerDown();

  return (
    <div
      className={`handle w-full h-8 pl-2 flex flex-row flex-nowrap text-sm ${text} ${bg}`}
      style={{ cursor: pointerDown ? "grabbing" : "grab" }}
    >
      <div className="flex items-center select-none grow justify-left">
        {title}
      </div>

      {children}

      <Tooltip tip="Remove vector">
        <button
          onClick={onRemove}
          className="flex items-center justify-center w-8 h-8 hover:bg-gray-300/20"
        >
          <CrossCircledIcon />
        </button>
      </Tooltip>
    </div>
  );
}
