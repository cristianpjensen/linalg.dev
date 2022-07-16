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
	PlusIcon,
	RulerSquareIcon,
	StopIcon,
	SunIcon,
	ValueIcon,
} from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import * as TWEEN from "@tweenjs/tween.js";
import { useHotkeys } from "react-hotkeys-hook";
import { observer } from "mobx-react-lite";

import { Tooltip } from "./Tooltip";
import { EditorContext, setDarkMode, Tool as _Tool } from "../editor-state";

export interface IToolbarProps {
	editorContext: EditorContext;
}

const Toolbar = observer(({ editorContext }: IToolbarProps) => {
	const darkMode =
		localStorage.getItem("theme") === "dark" ||
		(!("theme" in localStorage) &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);

	return (
		<div className="absolute top-0 left-0 z-10 flex flex-row w-screen h-12 text-xs antialiased bg-white shadow-sm dark:bg-black flex-nowrap">
			<Tool
				editorContext={editorContext}
				icon={<HandIcon />}
				tool={_Tool.HAND}
				description="Drag to pan the canvas"
				hotkey="h"
			/>
			<Tool
				editorContext={editorContext}
				icon={<ArrowTopRightIcon />}
				tool={_Tool.VECTOR}
				description="Press anywhere on the canvas to add a vector"
				hotkey="v"
			/>
			<Tool
				editorContext={editorContext}
				icon={<LayersIcon />}
				tool={_Tool.MATRIX}
				description="Drag to make a matrix environment"
				hotkey="m"
			/>

			<ToolDropdown
				editorContext={editorContext}
				icon={<FontFamilyIcon />}
				title="Math"
				tools={[
					{
						icon: <ValueIcon />,
						tool: _Tool.CONSTANT,
						description:
							"Press anywhere on the canvas to add a constant",
						hotkey: "c",
					},
					{
						icon: <StopIcon />,
						tool: _Tool.UNARY_OPERATOR,
						description:
							"Press anywhere on the canvas to add a mathematical operator",
						hotkey: "u",
					},
					{
						icon: <PlusIcon />,
						tool: _Tool.BINARY_OPERATOR,
						description:
							"Press anywhere on the canvas to add a mathematical operator",
						hotkey: "b",
					},
				]}
			/>
			<ToolDropdown
				editorContext={editorContext}
				icon={<RulerSquareIcon />}
				title="Linear algebra"
				tools={[]}
			/>

			<div className="flex items-center justify-center text-sm grow">
				Linear algebra
			</div>

			<ZoomControl editorContext={editorContext} />

			<Toggle
				icon={<SunIcon />}
				altIcon={<MoonIcon />}
				toggled={darkMode}
				onClick={setDarkMode}
			/>
			<Toggle icon={<InfoCircledIcon />} />
			<a
				className="h-12"
				href="https://github.com/cristianpjensen/linalg.dev"
			>
				<Toggle icon={<GitHubLogoIcon />} />
			</a>
		</div>
	);
});

const ZoomControl = observer(({ editorContext: editor }: IToolbarProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const tweenScale = (newScale: number) => {
		const newScale_ = Math.max(Math.min(newScale, 2), 0.2);

		const tween = new TWEEN.Tween({
			x: editor.position.x,
			y: editor.position.y,
			scale: editor.scale,
		})
			.to(
				{
					x:
						editor.position.x -
						(newScale_ / editor.scale - 1) *
							(window.innerWidth / 2 - editor.position.x + 12),
					y:
						editor.position.y -
						(newScale_ / editor.scale - 1) *
							(window.innerHeight / 2 - editor.position.y + 12),
					scale: newScale_,
				},
				200
			)
			.easing(TWEEN.Easing.Cubic.Out)
			.onUpdate((tween) => {
				editor.position.x = tween.x;
				editor.position.y = tween.y;
				editor.scale = tween.scale;
			});

		setIsOpen(false);
		tween.start();
	};

	const onClick200 = () => tweenScale(2);
	const onClick100 = () => tweenScale(1);
	const onClick50 = () => tweenScale(0.5);
	const onClick20 = () => tweenScale(0.2);
	const onClickZoomIn = () => tweenScale(editor.scale * 1.2);
	const onClickZoomOut = () => tweenScale(editor.scale * 0.8);

	useHotkeys("1", onClick200);
	useHotkeys("2", onClick100);
	useHotkeys("3", onClick50);
	useHotkeys("4", onClick20);
	useHotkeys("=", onClickZoomIn);
	useHotkeys("-", onClickZoomOut);

	return (
		<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
			<Popover.Trigger>
				<div className="flex items-center justify-center w-20 h-full px-4 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">
					{Math.round(editor.scale * 100)}%
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
});

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
	tool: _Tool;
	icon: React.ReactElement;
	description: string;
	tooltipSide?: "left" | "right" | "top" | "bottom";
	hotkey?: string;
}

const Tool = observer(
	({
		editorContext: editor,
		icon,
		tool,
		description,
		tooltipSide,
		hotkey,
	}: ToolProps & IToolbarProps) => {
		const setTool = () => {
			editor.tool = tool;
		};

		if (hotkey) {
			useHotkeys(hotkey, setTool);
		}

		const title = (tool.charAt(0).toUpperCase() + tool.slice(1)).replace(
			"-",
			" "
		);

		return (
			<Tooltip tip={description} side={tooltipSide} hotkey={hotkey}>
				<div
					className={`flex justify-center items-center px-4 h-12 cursor-pointer ${
						editor.tool === tool
							? "bg-offblack dark:bg-offwhite text-white dark:text-black"
							: "hover:bg-zinc-200 dark:hover:bg-zinc-700"
					}`}
					onClick={setTool}
				>
					<div className={`${tool !== _Tool.HAND ? "mr-2" : ""}`}>
						{icon}
					</div>
					{title}
				</div>
			</Tooltip>
		);
	}
);

interface ToolDropdownProps {
	editorContext: EditorContext;
	title: string;
	icon: React.ReactElement;
	tools: Array<ToolProps>;
}

const ToolDropdown = observer(
	({ editorContext: editor, icon, title, tools }: ToolDropdownProps) => {
		const isSelected = tools.some((tool) => tool.tool === editor.tool);
		const [isOpen, setIsOpen] = useState(false);

		tools.forEach((tool) => {
			// Set hotkey here, because otherwise it will only be usable when the
			// dropdown is open
			if (tool.hotkey) {
				useHotkeys(tool.hotkey, () => {
					editor.tool = tool.tool;
				});
			}
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
						{cloneElement(icon, {
							className: title !== "" ? "mr-2" : "",
						})}{" "}
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
						<Tool
							key={tool.tool}
							editorContext={editor}
							tooltipSide="right"
							{...tool}
						/>
					))}
				</Popover.Content>
			</Popover.Root>
		);
	}
);

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

export default Toolbar;
