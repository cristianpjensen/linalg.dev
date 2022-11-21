import React, { useMemo, useState } from "react";
import {
	ArrowRightIcon,
	ArrowTopRightIcon,
	ArrowUpIcon,
	BoxModelIcon,
	CaretDownIcon,
	CaretUpIcon,
	CircleIcon,
	Cross2Icon,
	DownloadIcon,
	FrameIcon,
	HamburgerMenuIcon,
	HandIcon,
	LayersIcon,
	MoonIcon,
	Pencil1Icon,
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
import { KeyCode } from "reactflow";
import { useHotkey } from "./hooks";

type IToolbarComponentProps = {
	bottom?: boolean;
	minified?: boolean;
};

function ToolbarComponent({
	bottom = false,
	minified = false,
}: IToolbarComponentProps) {
	const title = useNodeStore((state) => state.currentTitle);
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
			<ToolButton tool={Tool.Hand} hotkey="H" minified={minified}>
				<HandIcon />
			</ToolButton>

			<ToolButton
				tool={Tool.Vector}
				hotkey="V"
				title="Vector"
				minified={minified}
			>
				<ArrowTopRightIcon />
			</ToolButton>

			<ToolButton
				tool={Tool.Plane}
				hotkey="P"
				title="Plane"
				minified={minified}
			>
				<PlaneIcon />
			</ToolButton>

			<ToolButton
				tool={Tool.Matrix}
				hotkey="M"
				title="Matrix"
				minified={minified}
			>
				<LayersIcon />
			</ToolButton>

			{/* prettier-ignore */}
			<ToolDropdown
				tools={[
					[Tool.Scalar, <FrameIcon />, "Scalar", "S"],
					[Tool.Slider, <SliderIcon />, "Slider", "L"],
					[Tool.UnaryOperation, <CircleIcon />, "Unary operation", "U"],
					[Tool.BinaryOperation, <PlusIcon />, "Binary operation", "B"],
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
					[Tool.Norm, <NormIcon />, "Norm", "N"],
					[Tool.Transformed, <TransformationIcon />, "Transform", "R"],
					[Tool.VectorScaling, <VectorScalingIcon />, "Vector scaling", "O"],
					[Tool.VectorComponents, <VectorComponentsIcon />, "Vector components", "C"],
					[Tool.Transpose, <TransposeIcon />, "Transpose", "T"],
					[Tool.MatrixMultiplication, <BoxModelIcon />, "Matrix multiplication", "A"],
					[Tool.Eigenvalues, <ThickArrowUpIcon />, "Eigenvalues", "E"],
					[Tool.Eigenvectors, <EigenvectorsIcon />, "Eigenvectors", "I"],
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
					{title}
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
	hotkey: KeyCode | undefined;
	minified?: boolean;
	title?: string;
	children?: React.ReactNode;
};

const ToolButton = ({
	tool,
	hotkey,
	minified = false,
	title,
	children,
}: IToolButtonProps) => {
	const toolState = useEditorStore((state) => state.tool);
	const setToolState = useEditorStore((state) => state.setTool);
	const onToolChange = () => {
		setToolState(tool);
	};

	useHotkey(`Shift+${hotkey}`, onToolChange);

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
			{hotkey && !minified && title && (
				<span className="inline-flex items-center ml-2 text-xs text-zinc-500">
					<ThickArrowUpIcon className="mr-[0.0625rem]" /> {hotkey}
				</span>
			)}
		</Toolbar.Button>
	);
};

type IToolDropdownProps = {
	tools: Array<[Tool, React.ReactNode, string, KeyCode | undefined]>; // [tool, icon, title, hotkey]
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
	const setToolState = useEditorStore((state) => state.setTool);
	const isSelected = useMemo(() => {
		return tools.some(([tool]) => tool === toolState);
	}, [tools, toolState]);

	tools.forEach(([tool, , , hotkey]) => {
		// Set hotkey here, because otherwise it will only be usable when the
		// dropdown is open
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useHotkey(`Shift+${hotkey}`, () => {
			setToolState(tool);
		});
	});

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
					{tools.map(([tool, icon, title, hotkey]) => (
						<DropdownToolButton
							key={tool}
							tool={tool}
							hotkey={hotkey}
							minified={minified}
							title={title}
							children={icon}
						/>
					))}
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

const DropdownToolButton = ({
	tool,
	title,
	minified,
	hotkey,
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
			className={`inline-flex items-center justify-center h-12 w-full px-4 text-ellipsis ${
				toolState === tool
					? "bg-offblack text-white dark:bg-offwhite dark:text-black"
					: "hover:bg-black/10 dark:hover:bg-white/10"
			}`}
		>
			<div className={title ? "mr-2" : ""}>{children}</div>
			<span>{title}</span>
			{hotkey && !minified && title && (
				<span className="inline-flex items-center ml-2 text-xs text-zinc-500">
					<ThickArrowUpIcon className="mr-[0.0625rem]" /> {hotkey}
				</span>
			)}
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
					<div className="flex items-center justify-center h-12 px-2 cursor-pointer">
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
		<Dialog.Root defaultOpen={true}>
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
							<TabTrigger value="manual">Manual</TabTrigger>
						</Tabs.List>

						<Tabs.Content className="w-full p-8" value="env">
							<Environments />
						</Tabs.Content>

						<Tabs.Content className="w-full p-8" value="exercises">
							<Exercises />
						</Tabs.Content>

						<Tabs.Content className="w-full p-8" value="manual">
							<Manual />
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
			className="flex transition-colors hover:text-zinc-700 dark:hover:text-zinc-300 data-state-active:text-black dark:data-state-active:text-white text-zinc-400 dark:text-zinc-500"
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
					? "bg-black/5 dark:bg-white/10"
					: "hover:bg-black/10 dark:hover:bg-white/20"
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
			<h1 className="mb-4 text-xl">Exercises</h1>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<Exercise
					title="Basics"
					description="The basics of vectors and matrices."
					questions={[
						{
							question:
								"Compute the dot product of two vector nodes.",
							result: "Scalar node.",
							environment: "dot-product",
						},
						{
							question:
								"Compute the cross product of two vector nodes.",
							result: "Green vector.",
							environment: "cross-product",
						},
						{
							question:
								"Given a vector node, find a perpendicular vector.",
							result: "Red vector.",
							environment: "perpendicular-vector",
						},
					]}
				/>

				<Exercise
					title="Intermediate"
					description="Harder linear algebra concepts, such as planes."
					questions={[
						{
							question:
								"Create a plane using only one input vector node.",
							result: "Plane created from one vector node. In the space, the original vector should be perpendicular to the plane (hint: normal vector).",
							environment: "one-vector-plane",
						},
					]}
				/>

				<Exercise
					title="Advanced"
					description="Problems that require a deeper understanding of linear algebra."
					questions={[]}
				/>

				<Exercise
					title="Singular Value Decomposition"
					description="Problems regarding the SVD."
					questions={[]}
				/>

				<Exercise
					title="Principal Component Analysis"
					description="Exercises for understanding PCA better."
					questions={[]}
				/>
			</div>
		</div>
	);
};

type Question = {
	question: string;
	result: string;
	environment?: string;
};

type IExerciseProps = {
	title: string;
	description: string;
	questions: Array<Question>; // Questions
};

const Exercise = ({ title, description, questions }: IExerciseProps) => {
	const addEnv = useNodeStore((state) => state.addEnv);
	const setCurrentEnv = useNodeStore((state) => state.setCurrentEnv);

	const onExerciseStart = (env: string | undefined, question: string) => {
		if (env === undefined) {
			const environment = {
				nodes: [],
				edges: [],
			};

			addEnv(question, environment);
			setCurrentEnv(-1);
			return;
		}

		// Get environment from file
		fetch(`/envs/${env}.json`)
			.then((res) => res.json())
			.then((env) => {
				console.log(env);
				const environment = {
					nodes: env.nodes,
					edges: env.edges,
				};

				addEnv(question, environment);
				setCurrentEnv(-1);
			});
	};

	return (
		<Dialog.Root>
			<Dialog.Trigger>
				<button className="w-full h-full p-3 rounded text-start bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20">
					<h2 className="mb-2 text-lg leading-6">{title}</h2>
					<p className="text-sm text-zinc-600 dark:text-zinc-400">
						{description}
					</p>
				</button>
			</Dialog.Trigger>

			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-[60] animate-fadein-slow bg-black/40 dark:bg-black/60" />
				<Dialog.Content className="fixed z-[70] w-[calc(100vw-32px)] max-w-xl p-6 sm:p-8 h- -translate-x-1/2 -translate-y-1/2 rounded-md shadow-md bg-offwhite dark:bg-black top-1/2 left-1/2">
					<h1 className="mb-2 text-2xl leading-6">{title}</h1>

					<div className="flex flex-col gap-4 mt-4 overflow-y-scroll h-72">
						{questions.map(
							({ question, result, environment }, index) => (
								<div className="flex items-center gap-2">
									<div className="flex-grow">
										<h2>
											{index + 1}&ensp;{question}
										</h2>
										<p className="pl-4 text-zinc-500 dark:text-zinc-500">
											Result: {result}
										</p>
									</div>

									<button
										onClick={() =>
											onExerciseStart(
												environment,
												question
											)
										}
										className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-white transition-opacity rounded bg-offblack dark:bg-offwhite dark:text-black hover:opacity-70"
									>
										<ArrowRightIcon />
									</button>
								</div>
							)
						)}
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

const Manual = () => {
	return (
		<div>
			<h1 className="mb-2 text-xl">Manual</h1>
			<p className="text-zinc-500">Coming soon.</p>
		</div>
	);
};

export default ToolbarComponent;
