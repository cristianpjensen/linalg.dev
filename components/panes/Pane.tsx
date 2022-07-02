import Draggable, { DraggableData } from "react-draggable";
import { ResizableBox, ResizeCallbackData } from "react-resizable";
import { usePointerDown } from "../../hooks/usePointerDown";
import { useNodeStore } from "../../stores/nodes";
import { useUIStore } from "../../stores/ui";
import { GRID_SIZE } from "../constants";

import "react-resizable/css/styles.css";
import { Tooltip } from "../Tooltip";
import { CrossCircledIcon } from "@radix-ui/react-icons";

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
  bg = "bg-slate-200",
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
      <div className={`absolute ${blurred && "opacity-40"}`}>
        <ResizableBox
          width={width}
          height={height}
          transformScale={scale}
          resizeHandles={resizable ? ["se"] : []}
          onResizeStop={onResizeStop}
          axis={resizable ? "both" : "none"}
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
              className="absolute -top-2 -left-2 bg-blue-400 opacity-0 hover:opacity-30 cursor-pointer transition-opacity border-blue-900 border-2 rounded"
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
  bg = "bg-slate-500",
  text = "text-slate-100",
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
      <div className="flex grow justify-left items-center select-none">
        {title}
      </div>

      {children}

      <Tooltip tip="remove vector">
        <button
          onClick={onRemove}
          className="flex justify-center items-center h-8 w-8 hover:bg-gray-300/20"
        >
          <CrossCircledIcon />
        </button>
      </Tooltip>
    </div>
  );
}
