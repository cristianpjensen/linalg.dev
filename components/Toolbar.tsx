import { cloneElement, useState } from "react";
import {
  ArrowTopRightIcon,
  CaretDownIcon,
  FontFamilyIcon,
  GitHubLogoIcon,
  HandIcon,
  InfoCircledIcon,
  LayersIcon,
  MoonIcon,
  RulerSquareIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import * as HoverCard from "@radix-ui/react-hover-card";
import { ToolEnum, useStore } from "../stores";

export default function Toolbar() {
  return (
    <div className="w-screen h-12 absolute top-0 left-0 z-10 bg-slate-50 shadow-sm antialiased text-xs flex flex-row flex-nowrap">
      <Tool icon={<HandIcon />} title="" description="drag to pan the canvas" />
      <Tool
        icon={<ArrowTopRightIcon />}
        title="Vector"
        description="press anywhere on the canvas to add a vector"
      />
      <Tool
        icon={<LayersIcon />}
        title="Matrix"
        description="drag to make a matrix environment"
      />

      <ToolDropdown icon={<FontFamilyIcon />} title="Math" />
      <ToolDropdown icon={<RulerSquareIcon />} title="Linear algebra" />

      <div className="grow flex justify-center items-center text-sm">
        Linear algebra
      </div>

      <ZoomControl />

      <Toggle icon={<SunIcon />} altIcon={<MoonIcon />} />
      <Toggle icon={<InfoCircledIcon />} />
      <a className="h-12" href="https://github.com/cristianpjensen/linalg.dev">
        <Toggle icon={<GitHubLogoIcon />} />
      </a>
    </div>
  );
}

function ZoomControl() {
  const [scale, setScale] = useStore(({ scale, setScale }) => [
    scale,
    setScale,
  ]);

  return (
    <div className="flex justify-center items-center px-4 cursor-pointer hover:bg-slate-200">
      {Math.round(scale * 100)}%{" "}
      <CaretDownIcon className="ml-05 hover:translate-y-0.5 transition-transform" />
    </div>
  );
}

interface ToolProps {
  title: ToolEnum;
  icon: React.ReactElement;
  description: string;
}

function Tool({ icon, title, description }: ToolProps) {
  const [tool, setTool] = useStore(({ tool, setTool }) => [tool, setTool]);

  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <div
          className={`flex justify-center items-center px-4 h-12 cursor-pointer ${
            tool === title ? "bg-slate-500 text-white" : "hover:bg-slate-200"
          }`}
          onClick={() => {
            setTool(title);
          }}
        >
          {icon &&
            cloneElement(icon, { className: title !== "" ? "mr-2" : "" })}{" "}
          {title}
        </div>
      </HoverCard.Trigger>

      <HoverCard.Content className="bg-slate-900 text-white p-2 rounded text-xs w-40 text-center transition-opacity">
        {description}
      </HoverCard.Content>
    </HoverCard.Root>
  );
}

interface ToolDropdownProps {
  title: string;
  icon: React.ReactElement;
}

function ToolDropdown({ icon, title }: ToolDropdownProps) {
  return (
    <div className="flex justify-center items-center h-12 px-4 cursor-pointer hover:bg-slate-200">
      {cloneElement(icon, { className: title !== "" ? "mr-2" : "" })} {title}
      <CaretDownIcon className="ml-0.5 hover:translate-y-0.5 transition-transform" />
    </div>
  );
}

interface ToggleProps {
  icon: React.ReactElement;
  altIcon?: React.ReactElement;
  initialValue?: boolean;
  onPress?: (value: boolean) => void;
}

function Toggle({ icon, altIcon, initialValue = false, onPress }: ToggleProps) {
  const [state, setState] = useState(initialValue);

  const onClick = () => {
    setState((prev) => {
      onPress && onPress(!prev);
      return !prev;
    });
  };

  return (
    <div
      onClick={onClick}
      className="flex justify-center items-center h-12 w-12 cursor-pointer hover:bg-slate-200"
    >
      {state ? (altIcon ? altIcon : icon) : icon}
    </div>
  );
}
