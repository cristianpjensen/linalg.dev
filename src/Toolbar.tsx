import React, { useMemo, useState } from "react";
import {
	ArrowRightIcon,
	ArrowTopRightIcon,
	BoxModelIcon,
	CaretDownIcon,
	CaretUpIcon,
	CircleIcon,
	Cross1Icon,
	Cross2Icon,
	DownloadIcon,
	FrameIcon,
	HamburgerMenuIcon,
	HandIcon,
	LayersIcon,
	MoonIcon,
	Pencil1Icon,
	Pencil2Icon,
	PlusIcon,
	SliderIcon,
	SunIcon,
	ThickArrowUpIcon,
	UploadIcon,
} from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";

import { useEditorStore, Tool, setDarkMode, useNodeStore } from "../stores";
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
	const envs = useNodeStore((state) => state.envs);
	const currentEnv = useNodeStore((state) => state.currentEnv);
	const renameEnv = useNodeStore((state) => state.renameEnv);

	const onTitleChange = () => {
		const newTitle = prompt("Enter a new title");
		if (newTitle) {
			renameEnv(currentEnv, newTitle);
		}
	};

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

			<div className="flex items-center justify-center text-sm grow">
				<button
					onClick={onTitleChange}
					className="flex items-center gap-2"
				>
					{envs[currentEnv].title}
					<Pencil1Icon className="text-zinc-600 dark:text-zinc-400" />
				</button>
			</div>

			{minified || <VectorSpaceSizeDropdown />}
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

const VectorSpaceSizeDropdown = () => {
	const vectorSpaceSize = useEditorStore((state) => state.vectorSpaceSize);

	return (
		<DropdownMenu.Root>
			<Toolbar.Button
				className="inline-flex items-center justify-center h-full px-4 text-ellipsis hover:bg-black/10 dark:hover:bg-white/10"
				asChild
			>
				<DropdownMenu.Trigger>
					<div className="flex items-center justify-center h-12 px-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">
						1&thinsp;/&thinsp;
						{vectorSpaceSize === 1e99 ? "∞" : vectorSpaceSize}
						<CaretDownIcon className="ml-05 hover:translate-y-0.5 transition-transform" />
					</div>
				</DropdownMenu.Trigger>
			</Toolbar.Button>

			<DropdownMenu.Portal>
				<DropdownMenu.Content className="z-30 flex flex-col w-32 text-xs text-black bg-white rounded-b shadow-md dark:bg-black dark:text-white">
					<VectorSpaceSizeButton size={1} />
					<VectorSpaceSizeButton size={2} />
					<VectorSpaceSizeButton size={3} />
					<VectorSpaceSizeButton size={4} />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

type VectorSpaceSizeButton = {
	size: 1 | 2 | 3 | 4 | 1e99;
};

const VectorSpaceSizeButton = ({ size }: VectorSpaceSizeButton) => {
	const setVectorSpaceSize = useEditorStore(
		(state) => state.setVectorSpaceSize
	);
	const onClick = () => setVectorSpaceSize(size);

	return (
		<button
			onClick={onClick}
			className="flex items-center justify-center w-full h-10 hover:bg-zinc-200 dark:hover:bg-zinc-700"
		>
			1&thinsp;/&thinsp;{size === 1e99 ? "∞" : size}
		</button>
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
						<Tabs.List
							className={`flex gap-2 p-4 pr-8 rounded-l-md ${
								bottom ? "flex-row justify-between" : "flex-col"
							}`}
						>
							<TabTrigger value="env">Environments</TabTrigger>
							<TabTrigger value="exercises">Exercises</TabTrigger>
							<TabTrigger value="about">About</TabTrigger>
						</Tabs.List>

						<Tabs.Content className="w-full p-4" value="env">
							<Environments />
						</Tabs.Content>

						<Tabs.Content className="w-full p-4" value="exercises">
							<Exercises />
						</Tabs.Content>

						<Tabs.Content className="w-full p-4" value="about">
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
	const envs = useNodeStore((state) => state.envs);
	const currentEnv = useNodeStore((state) => state.currentEnv);
	const addEnv = useNodeStore((state) => state.addEnv);
	const onAddClick = () => {
		addEnv("New environment", null);
	};
	const onUploadClick = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "application/json";

		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];

			if (file) {
				const reader = new FileReader();
				reader.onload = (e) => {
					// Read file
					try {
						const json = JSON.parse(
							(e.target as FileReader).result as string
						);

						addEnv(json.title, {
							nodes: json.nodes,
							edges: json.edges,
						});
					} catch (e) {
						console.error(e);
					}
				};
				reader.readAsText(file);
			}
		};

		input.click();
		input.remove();
	};

	return (
		<div>
			<div className="flex items-center justify-between w-full h-10 mb-2">
				<h1 className="text-xl">Your environments</h1>
				<div className="flex gap-2">
					<button
						onClick={onUploadClick}
						className="flex items-center justify-center w-8 h-8 text-white transition-opacity rounded bg-offblack dark:bg-offwhite dark:text-black hover:opacity-70"
					>
						<UploadIcon />
					</button>

					<button
						onClick={onAddClick}
						className="flex items-center justify-center w-8 h-8 text-white transition-opacity rounded bg-offblack dark:bg-offwhite dark:text-black hover:opacity-70"
					>
						<PlusIcon />
					</button>
				</div>
			</div>

			<p className="mb-2 text-sm text-zinc-500 dark:text-zinc-500">
				These environments are stored locally, so they will be deleted
				if you clear the browser's local storage.
			</p>

			<div className="flex flex-col gap-1 overflow-y-scroll h-96">
				{envs.map((env, index) => (
					<Environment
						key={index}
						id={index}
						title={env.title}
						nodeCount={env.nodes.length}
						edgeCount={env.edges.length}
						selected={index === currentEnv}
					/>
				))}
			</div>
		</div>
	);
};

type IEnvironmentProps = {
	id: number;
	title: string;
	nodeCount: number;
	edgeCount: number;
	selected?: boolean;
};

const Environment = ({
	id,
	title,
	nodeCount,
	edgeCount,
	selected = false,
}: IEnvironmentProps) => {
	const envs = useNodeStore((state) => state.envs);
	const setCurrentEnv = useNodeStore((state) => state.setCurrentEnv);
	const removeEnv = useNodeStore((state) => state.removeEnv);
	const onClick = () => {
		setCurrentEnv(id);
	};
	const onRemoveClick = () => {
		removeEnv(id);
	};
	const onDownloadClick = () => {
		const json = JSON.stringify(envs[id], null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");

		a.href = url;
		a.download = `${title}.json`;
		a.click();

		// Clean up
		URL.revokeObjectURL(url);
		a.remove();
	};

	return (
		<div
			className={`w-full px-4 py-2 rounded ${
				selected
					? "bg-black/5 dark:bg-white/5"
					: "hover:bg-black/10 dark:hover:bg-white/10"
			}`}
		>
			<div className="flex items-center w-full">
				<button
					onClick={onClick}
					className="flex flex-col items-start gap-1 grow"
				>
					<h2 className="flex items-center gap-1">
						{title}
						<ArrowRightIcon />
					</h2>
					<div>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							{nodeCount} nodes
						</p>
						<p className="text-sm text-zinc-600 dark:text-zinc-400">
							{edgeCount} edges
						</p>
					</div>
				</button>

				<div className="flex gap-2">
					<button
						onClick={onDownloadClick}
						className="flex items-center justify-center w-8 h-8 text-white transition-opacity rounded bg-offblack dark:bg-offwhite dark:text-black hover:opacity-70"
					>
						<DownloadIcon />
					</button>

					<button
						onClick={onRemoveClick}
						className="flex items-center justify-center w-8 h-8 rounded hover:bg-black/10 dark:hover:bg-white/10"
					>
						<Cross2Icon />
					</button>
				</div>
			</div>
		</div>
	);
};

const Exercises = () => {
	return (
		<div>
			<h1 className="text-xl">Exercises</h1>
		</div>
	);
};

const About = () => {
	return (
		<div>
			<h1 className="text-xl">About</h1>
		</div>
	);
};

export default ToolbarComponent;
