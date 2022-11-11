import React, { useMemo, useState } from "react";
import {
	ArrowTopRightIcon,
	BoxModelIcon,
	CaretDownIcon,
	CaretUpIcon,
	CircleIcon,
	FrameIcon,
	HamburgerMenuIcon,
	HandIcon,
	LayersIcon,
	MoonIcon,
	PlusIcon,
	SliderIcon,
	SunIcon,
	ThickArrowUpIcon,
} from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

import { useEditorStore, Tool, setDarkMode } from "../stores";
import {
	EigenvectorsIcon,
	LinearAlgebraIcon,
	MathIcon,
	NormIcon,
	PlaneIcon,
	TransformationIcon,
	TransposeIcon,
	VectorComponentsIcon,
	VectorScalingIcon,
} from "./icons";

type IToolbarComponentProps = {
	bottom?: boolean;
	minified?: boolean;
};

function ToolbarComponent({
	bottom = false,
	minified = false,
}: IToolbarComponentProps) {
	return (
		<Toolbar.Root
			className={`fixed z-40 overflow-scroll antialiased flex-nowrap flex w-full h-12 text-xs text-black bg-white shadow-sm dark:bg-black dark:text-white ${
				bottom ? "bottom-0" : "top-0"
			}`}
		>
			<ToolButton tool={Tool.Hand} minified={minified}>
				<HandIcon />
			</ToolButton>

			<ToolButton tool={Tool.Vector} title="Vector" minified={minified}>
				<ArrowTopRightIcon />
			</ToolButton>

			<ToolButton tool={Tool.Plane} title="Plane" minified={minified}>
				<PlaneIcon />
			</ToolButton>

			<ToolButton tool={Tool.Matrix} title="Matrix" minified={minified}>
				<LayersIcon />
			</ToolButton>

			{/* prettier-ignore */}
			<ToolDropdown
				tools={[
					[Tool.Constant, <FrameIcon />, "Constant"],
					[Tool.Slider, <SliderIcon />, "Slider"],
					[Tool.UnaryOperation, <CircleIcon />, "Unary operation"],
					[Tool.BinaryOperation, <PlusIcon />, "Binary operation"],
				]}
				bottom={bottom}
				minified={minified}
				title="Math"
			>
				<MathIcon />
			</ToolDropdown>

			{/* prettier-ignore */}
			<ToolDropdown
				tools={[
					[Tool.Norm, <NormIcon />, "Norm"],
					[Tool.Transformed, <TransformationIcon />, "Transform"],
					[Tool.VectorScaling, <VectorScalingIcon />, "Vector scaling"],
					[Tool.VectorComponents, <VectorComponentsIcon />, "Vector components"],
					[Tool.Transpose, <TransposeIcon />, "Transpose"],
					[Tool.MatrixMultiplication, <BoxModelIcon />, "Matrix multiplication"],
					[Tool.Eigenvalues, <ThickArrowUpIcon />, "Eigenvalues"],
					[Tool.Eigenvectors, <EigenvectorsIcon />, "Eigenvectors"],
				]} 
				bottom={bottom}
				minified={minified}
				title="Linear Algebra"
			>
				<LinearAlgebraIcon />
			</ToolDropdown>

			<div className="flex grow" />

			<DarkModeToggle />
			<MenuDialog bottom={bottom} />
		</Toolbar.Root>
	);
}

type IToolButtonProps = {
	tool: Tool;
	minified?: boolean;
	title?: string;
	children?: React.ReactNode;
};

const ToolButton = ({
	tool,
	minified = false,
	title,
	children,
}: IToolButtonProps) => {
	const toolState = useEditorStore((state) => state.tool);
	const setToolState = useEditorStore((state) => state.setTool);
	const onToolChange = () => {
		setToolState(tool);
	};

	return (
		<Toolbar.Button
			onClick={onToolChange}
			className={`inline-flex items-center justify-center h-full px-4 text-ellipsis ${
				toolState === tool
					? "bg-offblack text-white dark:bg-offwhite dark:text-black"
					: "hover:bg-black/10 dark:hover:bg-white/10"
			}`}
		>
			<div className={title && !minified ? "mr-2" : ""}>{children}</div>
			{minified || <span>{title}</span>}
		</Toolbar.Button>
	);
};

type IToolDropdownProps = {
	tools: Array<[Tool, React.ReactNode, string]>; // [tool, icon, title]
	bottom?: boolean;
	minified?: boolean;
	title?: string;
	children?: React.ReactNode;
};

const ToolDropdown = ({
	tools,
	bottom = false,
	minified = false,
	title,
	children,
}: IToolDropdownProps) => {
	const toolState = useEditorStore((state) => state.tool);
	const isSelected = useMemo(() => {
		return tools.some(([tool]) => tool === toolState);
	}, [tools, toolState]);

	return (
		<DropdownMenu.Root>
			<Toolbar.Button
				className={`inline-flex items-center justify-center h-full px-4 text-ellipsis ${
					isSelected
						? "bg-offblack text-white dark:bg-offwhite dark:text-black"
						: "hover:bg-black/10 dark:hover:bg-white/10"
				}`}
				asChild
			>
				<DropdownMenu.Trigger>
					<div className={title && !minified ? "mr-2" : ""}>
						{children}
					</div>
					{minified || <span>{title}</span>}

					{bottom ? (
						<CaretUpIcon className="ml-0.5 hover:-translate-y-0.5 transition-transform" />
					) : (
						<CaretDownIcon
							className={`ml-0.5 hover:translate-y-0.5 transition-transform`}
						/>
					)}
				</DropdownMenu.Trigger>
			</Toolbar.Button>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					className={`z-30 flex flex-col text-xs text-black bg-white shadow-md dark:bg-black dark:text-white ${
						bottom ? "rounded-t" : "rounded-b"
					}`}
				>
					{tools.map(([tool, icon, title]) => (
						<DropdownToolButton
							key={tool}
							tool={tool}
							title={title}
							children={icon}
						/>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

const DropdownToolButton = ({ tool, title, children }: IToolButtonProps) => {
	const toolState = useEditorStore((state) => state.tool);
	const setToolState = useEditorStore((state) => state.setTool);
	const onToolChange = () => {
		setToolState(tool);
	};

	return (
		<Toolbar.Button
			onClick={onToolChange}
			className={`inline-flex items-center justify-center h-12 w-full px-4 text-ellipsis ${
				toolState === tool
					? "bg-offblack text-white dark:bg-offwhite dark:text-black"
					: "hover:bg-black/10 dark:hover:bg-white/10"
			}`}
		>
			<div className={title ? "mr-2" : ""}>{children}</div>
			<span>{title}</span>
		</Toolbar.Button>
	);
};

const darkMode =
	localStorage.getItem("theme") === "dark" ||
	(!("theme" in localStorage) &&
		window.matchMedia("(prefers-color-scheme: dark)").matches);

const DarkModeToggle = () => {
	const [darkModeState, setDarkModeState] = useState(darkMode);

	const toggleDarkMode = () => {
		setDarkModeState((prev) => {
			const next = !prev;
			setDarkMode(next);
			return next;
		});
	};

	return (
		<Toolbar.Button
			className="inline-flex items-center justify-center w-12 h-12 hover:bg-black/10 dark:hover:bg-white/10"
			onClick={toggleDarkMode}
		>
			{darkModeState ? <MoonIcon /> : <SunIcon />}
		</Toolbar.Button>
	);
};

type IMenuDialogProps = {
	bottom?: boolean;
};

const MenuDialog = ({ bottom = false }: IMenuDialogProps) => {
	return (
		<Dialog.Root>
			<Toolbar.Button
				className="inline-flex items-center justify-center h-full px-4 text-ellipsis hover:bg-black/10 dark:hover:bg-white/10"
				asChild
			>
				<Dialog.Trigger>
					<HamburgerMenuIcon />
				</Dialog.Trigger>
			</Toolbar.Button>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 animate-fadein-slow bg-black/40 dark:bg-black/60" />
				<Dialog.Content className="fixed z-50 w-[calc(100vw-16px)] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-md shadow-md bg-offwhite dark:bg-black top-1/2 left-1/2">
					<Tabs.Root
						className={bottom ? "flex flex-col" : "flex flex-row"}
						defaultValue="env"
						orientation={bottom ? "horizontal" : "vertical"}
					>
						<Tabs.List className={`flex gap-2 p-4 pr-8 rounded-l-md ${bottom ? "flex-row justify-between" : "flex-col"}`}>
							<TabTrigger value="env">Environments</TabTrigger>
							<TabTrigger value="exercises">Exercises</TabTrigger>
							<TabTrigger value="about">About</TabTrigger>
						</Tabs.List>

						<Tabs.Content value="env">
							<Environments />
						</Tabs.Content>

						<Tabs.Content value="exercises">
							<Exercises />
						</Tabs.Content>

						<Tabs.Content value="about">
							<About />
						</Tabs.Content>
					</Tabs.Root>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

type ITabTriggerProps = {
	children: React.ReactNode;
	value: string;
};

const TabTrigger = ({ children, value }: ITabTriggerProps) => {
	return (
		<Tabs.Trigger
			className="flex transition-colors hover:text-zinc-700 dark:hover:text-zinc-300 data-state-active:text-black dark:data-state-active:text-white text-zinc-400 dark:text-zinc-600"
			value={value}
		>
			{children}
		</Tabs.Trigger>
	);
};

const Environments = () => {
	return (
		<div className="p-4">
			<h1 className="text-xl">Environments</h1>
		</div>
	);
};

const Exercises = () => {
	return (
		<div className="p-4">
			<h1 className="text-xl">Exercises</h1>
		</div>
	);
};

const About = () => {
	return (
		<div className="p-4">
			<h1 className="text-xl">About</h1>
		</div>
	);
};

export default ToolbarComponent;
