import { cloneElement, useState } from "react";
import {
  ArrowTopRightIcon,
  BoxIcon,
  CaretDownIcon,
  FontFamilyIcon,
  GitHubLogoIcon,
  HandIcon,
  InfoCircledIcon,
  LayersIcon,
  MoonIcon,
  PlusIcon,
  RulerSquareIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import * as TWEEN from "@tweenjs/tween.js";
import { useHotkeys } from "react-hotkeys-hook";
import { Tooltip } from "./Tooltip";
import { useUIStore, setDarkMode } from "../stores";

// TODO: Give each tool its own component and a selector that only becomes true
// when it is the selected tool. This might cause it not to re-render. 

// TODO: It should not re-render on dragging the grid, so fix that.
export default function Toolbar() {
  const darkMode =
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="absolute top-0 left-0 z-10 flex flex-row w-screen h-12 text-xs antialiased bg-white shadow-sm dark:bg-black flex-nowrap">
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

      <ToolDropdown
        icon={<FontFamilyIcon />}
        title="Math"
        tools={[
          {
            icon: <BoxIcon />,
            title: "constant",
            description: "Press anywhere on the canvas to add a constant",
            hotkey: "c",
          },
          {
            icon: <PlusIcon />,
            title: "operator",
            description: "Press anywhere on the canvas to add a mathematical operator",
            hotkey: "o",
          },
        ]}
      />
      <ToolDropdown
        icon={<RulerSquareIcon />}
        title="Linear algebra"
        tools={[]}
      />

      <div className="flex items-center justify-center text-sm grow">
        Linear algebra
      </div>

      <ZoomControl />

      <Toggle
        icon={<SunIcon />}
        altIcon={<MoonIcon />}
        toggled={darkMode}
        onClick={setDarkMode}
      />
      <Toggle icon={<InfoCircledIcon />} />
      <a className="h-12" href="https://github.com/cristianpjensen/linalg.dev">
        <Toggle icon={<GitHubLogoIcon />} />
      </a>
    </div>
  );
}

// TODO: Only fetch the position when zooming in or out, since otherwise they
// are not necessary and cause a lot of unnecessary re-renders.
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
        <div className="flex items-center justify-center w-20 h-full px-4 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">
          {Math.round(scale * 100)}%
          <CaretDownIcon
            className={`ml-05 hover:translate-y-0.5 transition-transform ${
              isOpen ? "translate-y-0.5" : ""
            }`}
          />
        </div>
      </Popover.Trigger>

      <Popover.Content className="w-32 text-xs text-black bg-white rounded-b shadow-md dark:bg-black dark:text-white">
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
      className="flex items-center justify-center w-full h-10 hover:bg-zinc-200 dark:hover:bg-zinc-700"
    >
      <div className="absolute flex w-full pl-3 justify-left text-zinc-400 dark:text-zinc-500">
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
  tooltipSide?: "left" | "right" | "top" | "bottom";
  hotkey?: string;
}

function Tool({ icon, title, description, tooltipSide, hotkey }: ToolProps) {
  const [tool, setTool] = useUIStore(({ tool, setTool }) => [tool, setTool]);
  if (hotkey) useHotkeys(hotkey, () => setTool(title));

  const titleCapitalized = title.charAt(0).toUpperCase() + title.slice(1);

  return (
    <Tooltip tip={description} side={tooltipSide} hotkey={hotkey}>
      <div
        className={`flex justify-center items-center px-4 h-12 cursor-pointer ${
          tool === title
            ? "bg-offblack dark:bg-offwhite text-white dark:text-black"
            : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
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
  tools: Array<ToolProps>;
}

function ToolDropdown({ icon, title, tools }: ToolDropdownProps) {
  const [currentTool, setTool] = useUIStore((state) => [
    state.tool,
    state.setTool,
  ]);
  const isSelected = tools.some((tool) => tool.title === currentTool);
  const [isOpen, setIsOpen] = useState(false);

  tools.forEach((tool) => {
    if (tool.hotkey) useHotkeys(tool.hotkey, () => setTool(tool.title));
  });

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger>
        <div
          className={`flex justify-center items-center h-12 px-4 cursor-pointer ${
            isSelected
              ? "bg-offblack dark:bg-offwhite text-white dark:text-black"
              : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
          }`}
        >
          {cloneElement(icon, { className: title !== "" ? "mr-2" : "" })}{" "}
          {title}
          <CaretDownIcon
            className={`ml-0.5 hover:translate-y-0.5 transition-transform ${
              isOpen ? "translate-y-0.5" : ""
            }`}
          />
        </div>
      </Popover.Trigger>

      <Popover.Content className="flex flex-col text-xs text-black bg-white rounded-b shadow-md dark:bg-black dark:text-white">
        {tools.map((tool) => (
          <Tool key={tool.title} tooltipSide="right" {...tool} />
        ))}
      </Popover.Content>
    </Popover.Root>
  );
}

interface ToggleProps {
  icon: React.ReactElement;
  altIcon?: React.ReactElement;
  toggled?: boolean;
  onClick?: (value: boolean) => void;
}

function Toggle({ icon, altIcon, toggled, onClick }: ToggleProps) {
  const [state, setState] = useState(toggled);

  const onComponentClick = () => {
    setState((prev) => {
      onClick && onClick(!prev);
      return !prev;
    });
  };

  return (
    <div
      onClick={onComponentClick}
      className="flex items-center justify-center w-12 h-12 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700"
    >
      {state && altIcon ? altIcon : icon}
    </div>
  );
}
