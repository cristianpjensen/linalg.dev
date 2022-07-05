import { DotIcon, MagicWandIcon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";
import { MathInput } from "react-three-linalg";
import TeX from "@matejmazur/react-katex";
import { useNodeStore, ValueNode, VectorNode } from "../../stores/nodes";
import { useUIStore } from "../../stores";
import { MathX, MathY, MathZ } from "../icons";
import { Tooltip } from "../Tooltip";
import { Pane } from "./Pane";

import "katex/dist/katex.min.css";

export default function Vectors() {
  const vectors = useNodeStore((state) => state.vectors);

  return (
    <>
      {vectors.map((vector) => (
        <VectorPane key={vector.id} vector={vector} />
      ))}
    </>
  );
}

interface VectorPaneProps {
  vector: VectorNode;
}

function VectorPane({
  vector: {
    id,
    title,
    x,
    y,
    width,
    height,
    vectorX,
    vectorY,
    vectorZ,
    linkVectorX,
    linkVectorY,
    linkVectorZ,
  },
}: VectorPaneProps) {
  const setVectorDimension = useNodeStore((state) => state.setVectorDimension);
  const tool = useUIStore((state) => state.tool);

  const onChangeX = (x: number) => setVectorDimension(id, "x", x);
  const onChangeY = (y: number) => setVectorDimension(id, "y", y);
  const onChangeZ = (z: number) => setVectorDimension(id, "z", z);

  const [link, type, linkId] = tool.split("-");

  return (
    <Pane
      id={id}
      x={x}
      y={y}
      width={width}
      height={height}
      blurred={
        (link === "link" && type !== "vector") || linkId === id.toString()
      }
      selectable={
        link === "link" && type === "vector" && linkId !== id.toString()
      }
      headerProps={{
        title,
        bg: "bg-slate-600 dark:bg-slate-900",
        text: "text-slate-200 dark:text-slate-100",
        children: <ModifierOptions title={title} id={id} />,
      }}
      bg="bg-slate-200 dark:bg-slate-600"
      className="flex gap-4 flex-col p-4"
    >
      <DimensionInput
        id={id}
        dimension="x"
        value={vectorX}
        link={linkVectorX}
        onChange={onChangeX}
      />
      <DimensionInput
        id={id}
        dimension="y"
        value={vectorY}
        link={linkVectorY}
        onChange={onChangeY}
      />
      <DimensionInput
        id={id}
        dimension="z"
        value={vectorZ}
        link={linkVectorZ}
        onChange={onChangeZ}
      />
    </Pane>
  );
}

interface DimensionInputProps {
  id: number;
  value: number;
  link: ValueNode | null;
  dimension: "x" | "y" | "z";
  onChange: (value: number) => void;
}

function DimensionInput({
  id,
  value,
  link,
  dimension,
  onChange,
}: DimensionInputProps) {
  const setTool = useUIStore((state) => state.setTool);

  const linkValue = () => {
    setTool(`link-value-${id}`);
  };

  return (
    <div className="flex flex-row flex-nowrap items-center gap-4 pt-1">
      <label
        className={`${
          dimension === "x"
            ? "text-red-700 dark:text-red-300"
            : dimension === "y"
            ? "text-green-700 dark:text-green-300"
            : "text-blue-700 dark:text-blue-300"
        } w-3 h-3`}
        htmlFor={dimension}
      >
        {dimension === "x" ? (
          <MathX />
        ) : dimension === "y" ? (
          <MathY />
        ) : (
          <MathZ />
        )}
      </label>

      <div className="grow cursor-text">
        <MathInput
          value={value}
          onChange={onChange}
          style={{
            backgroundColor: "transparent",
            fontSize: 20,
            color: "rgb(15, 23, 42)",
            borderColor: "rgb(71, 85, 105)",
          }}
        />
      </div>

      <Tooltip tip={`Connect ${dimension} to a value node`}>
        <button
          className="flex justify-center items-center h-8 w-8 rounded text-slate-800 dark:text-slate-300 hover:bg-gray-500/20"
          onClick={linkValue}
        >
          <DotIcon />
        </button>
      </Tooltip>
    </div>
  );
}

interface ModifierOptionsProps {
  title: string;
  id: number;
}

function ModifierOptions({ title, id }: ModifierOptionsProps) {
  const setTool = useUIStore((state) => state.setTool);
  const [isOpen, setIsOpen] = useState(false);

  const linkOrigin = () => {
    setTool(`link-vector-${id}`);
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <Tooltip tip={`Modify attributes of ${title.toLowerCase()}`}>
          <button className="flex justify-center items-center h-8 w-8 hover:bg-gray-300/20">
            <MagicWandIcon aria-label="Modify vector attributes" />
          </button>
        </Tooltip>
      </Popover.Trigger>

      <Popover.Content>
        <div className="flex flex-col gap-6 bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-500 border-2 rounded w-80 items-center p-4">
          <h2 className="text-slate-800 dark:text-slate-200 font-medium text-base">Modifiers</h2>

          <ModifierFieldset label="Color">
            <input className="rounded outline-none w-full pl-2 pr-2 pt-1 pb-1 text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 font-md font-mono shadow-b1 shadow-slate-400 dark:shadow-slate-500 focus:shadow-b2 focus:shadow-slate-500 dark:focus:shadow-slate-400" />
          </ModifierFieldset>

          <ModifierFieldset label="Opacity">
            <Slider.Root
              className="w-full h-5 relative select-none touch-none flex items-center"
              defaultValue={[100]}
              max={100}
              min={0}
              step={10}
              aria-label="Opacity"
            >
              <Slider.Track className="relative bg-slate-300 dark:bg-slate-600 rounded-full grow h-1">
                <Slider.Range className="bg-slate-400 dark:bg-slate-500 rounded-full h-full absolute" />
              </Slider.Track>
              <Slider.Thumb className="w-4 h-4 block shadow-sm rounded-full outline-none bg-slate-400 dark:bg-slate-500 focus:shadow-[0_0_0_5px_rgba(0,0,0,0.1)] dark:focus:shadow-[0_0_0_5px_rgba(255,255,255,0.1)]" />
            </Slider.Root>
          </ModifierFieldset>

          <ModifierFieldset label="Origin">
            <TeX
              className="grow text-slate-800 dark:text-slate-200"
              block
            >{`\\begin{bmatrix} 0 & 0 & 0 \\end{bmatrix}^\\top`}</TeX>

            <Tooltip tip="Connect the origin to another vector">
              <button
                className="flex justify-center items-center h-8 w-8 rounded text-slate-800 dark:text-slate-100 hover:bg-gray-500/20"
                onClick={linkOrigin}
              >
                <DotIcon />
              </button>
            </Tooltip>
          </ModifierFieldset>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

interface ModifierFieldsetProps {
  label: string;
  children?: React.ReactNode;
}

function ModifierFieldset({ label, children }: ModifierFieldsetProps) {
  return (
    <fieldset className="flex gap-4 w-full items-center">
      <label className="w-16 text-sm text-slate-800 dark:text-slate-300">{label}</label>
      <div className="inline-flex flex-1 items-center justify-end">
        {children}
      </div>
    </fieldset>
  );
}
