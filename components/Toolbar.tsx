import { cloneElement, useCallback, useState } from "react";
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
import * as Popover from "@radix-ui/react-popover";
import * as TWEEN from "@tweenjs/tween.js";
import { Tooltip } from "./Tooltip";
import { useUIStore } from "../stores/ui";
import { useHotkeys } from "react-hotkeys-hook";

export default function Toolbar() {
  return (
    <div className="w-screen h-12 absolute top-0 left-0 z-10 bg-slate-50 shadow-sm antialiased text-xs flex flex-row flex-nowrap">
      <Tool
        icon={<HandIcon />}
        title=""
        description="Drag to pan the canvas"
        hotkey="h"
      />
      <Tool
        icon={<ArrowTopRightIcon />}
        title="vector"
        description="Press anywhere on the canvas to add a vector"
        hotkey="v"
      />
      <Tool
        icon={<LayersIcon />}
        title="matrix"
        description="Drag to make a matrix environment"
        hotkey="m"
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
  const [x, y, scale, setXYS] = useUIStore(({ x, y, scale, setXYS }) => [
    x,
    y,
    scale,
    setXYS,
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const tweenScale = (newScale: number) => {
    const newScale_ = Math.max(Math.min(newScale, 2), 0.2);

    const tween = new TWEEN.Tween({ x: x, y: y, scale: scale })
      .to(
        {
          x: x - (newScale_ / scale - 1) * (window.innerWidth / 2 - x + 12),
          y: y - (newScale_ / scale - 1) * (window.innerHeight / 2 - y + 12),
          scale: newScale_,
        },
        200
      )
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate((tween) => {
        setXYS(tween.x, tween.y, tween.scale);
      });

    setIsOpen(false);
    tween.start();
  };

  const onClick200 = () => tweenScale(2);
  const onClick100 = () => tweenScale(1);
  const onClick50 = () => tweenScale(0.5);
  const onClick20 = () => tweenScale(0.2);
  const onClickZoomIn = () => tweenScale(scale * 1.2);
  const onClickZoomOut = () => tweenScale(scale * 0.8);

  useHotkeys("1", onClick200, [scale, x, y]);
  useHotkeys("2", onClick100, [scale, x, y]);
  useHotkeys("3", onClick50, [scale, x, y]);
  useHotkeys("4", onClick20, [scale, x, y]);
  useHotkeys("=", onClickZoomIn, [scale, x, y]);
  useHotkeys("-", onClickZoomOut, [scale, x, y]);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <div className="flex justify-center items-center px-4 cursor-pointer w-20 h-full hover:bg-slate-200">
          {Math.round(scale * 100)}%
          <CaretDownIcon className="ml-05 hover:translate-y-0.5 transition-transform" />
        </div>
      </Popover.Trigger>

      <Popover.Content className="w-32 bg-slate-50 text-xs shadow-md rounded-b">
        <ZoomButton onClick={onClick200} hotkey="1">
          200%
        </ZoomButton>
        <ZoomButton onClick={onClick100} hotkey="2">
          100%
        </ZoomButton>
        <ZoomButton onClick={onClick50} hotkey="3">
          50%
        </ZoomButton>
        <ZoomButton onClick={onClick20} hotkey="4">
          20%
        </ZoomButton>
        <ZoomButton onClick={onClickZoomIn} hotkey="=">
          Zoom in
        </ZoomButton>
        <ZoomButton onClick={onClickZoomOut} hotkey="-">
          Zoom out
        </ZoomButton>
      </Popover.Content>
    </Popover.Root>
  );
}

interface ZoomButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  hotkey?: string;
}

function ZoomButton({ children, onClick, hotkey }: ZoomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex justify-center items-center h-10 hover:bg-slate-200"
    >
      <div className="flex w-full absolute justify-left pl-3 text-gray-400">
        {hotkey?.toUpperCase()}
      </div>

      {children}
    </button>
  );
}

interface ToolProps {
  title: string;
  icon: React.ReactElement;
  description: string;
  hotkey?: string;
}

function Tool({ icon, title, description, hotkey }: ToolProps) {
  const [tool, setTool] = useUIStore(({ tool, setTool }) => [tool, setTool]);
  if (hotkey) useHotkeys(hotkey, () => setTool(title));

  const titleCapitalized = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <Tooltip tip={description} hotkey={hotkey}>
      <div
        className={`flex justify-center items-center px-4 h-12 cursor-pointer ${
          tool === title ? "bg-slate-500 text-white" : "hover:bg-slate-200"
        }`}
        onClick={() => {
          setTool(title);
        }}
      >
        {icon && cloneElement(icon, { className: title !== "" ? "mr-2" : "" })}{" "}
        {titleCapitalized}
      </div>
    </Tooltip>
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
