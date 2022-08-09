import React, { cloneElement, useState } from "react";
import { useReactFlow } from "react-flow-renderer/nocss";
import {
	ArrowTopRightIcon,
	BoxIcon,
	BoxModelIcon,
	ButtonIcon,
	CaretDownIcon,
	CaretUpIcon,
	DividerVerticalIcon,
	DotIcon,
	DownloadIcon,
	GitHubLogoIcon,
	HandIcon,
	InfoCircledIcon,
	LayersIcon,
	MoonIcon,
	SliderIcon,
	SunIcon,
	ThickArrowUpIcon,
	UploadIcon,
} from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";

import { Tooltip } from "./Tooltip";
import {
	EigenvectorsIcon,
	FitFrameIcon,
	LinearAlgebraIcon,
	MathIcon,
	NormIcon,
	TransformationIcon,
	TransposeIcon,
	VectorScalingIcon,
	VectorComponentsIcon,
} from "./icons";
import useHotkey from "./hooks/useHotkey";
import { useEditorStore, Tool as _Tool, setDarkMode } from "../stores";
import { useWindowWidth } from "@react-hook/window-size";

type IToolbarProps = {
	bottom?: boolean;
	minify?: boolean;
};

const Toolbar = ({ bottom = false, minify = false }: IToolbarProps) => {
	const darkMode =
		localStorage.getItem("theme") === "dark" ||
		(!("theme" in localStorage) &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);

	const reactFlow = useReactFlow();

	const fitNodes = () => {
		const nodes = reactFlow.getNodes();

		// Get minimum and maximum x and y coordinates
		const bounds = {
			x: { min: Infinity, max: -Infinity },
			y: { min: Infinity, max: -Infinity },
		};

		for (const node of nodes) {
			const { x, y } = node.position;
			const width = node.width || 0;
			const height = node.height || 0;

			if (x < bounds.x.min) bounds.x.min = x;
			if (x + width > bounds.x.max) bounds.x.max = x + width;
			if (y < bounds.y.min) bounds.y.min = y;
			if (y + height > bounds.y.max) bounds.y.max = y + height;
		}

		reactFlow.fitBounds(
			{
				x: bounds.x.min,
				y: bounds.y.min,
				width: bounds.x.max - bounds.x.min,
				height: bounds.y.max - bounds.y.min,
			},
			{ duration: 400 }
		);
	};

	const downloadEnvironment = () => {
		const { nodes, edges } = reactFlow.toObject();
		const json = JSON.stringify({ nodes, edges }, null, 2);

		const date = new Date();

		// Download as JSON file
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `linalg_${date.getFullYear()}_${(
			date.getMonth() + 1
		).toLocaleString("en-GB", {
			minimumIntegerDigits: 2,
		})}_${date
			.getDate()
			.toLocaleString("en-GB", { minimumIntegerDigits: 2 })}.json`;
		a.click();

		// Clean up
		URL.revokeObjectURL(url);
		a.remove();
	};

	const uploadEnvironment = () => {
		// Create a fake input element that gets artificially clicked to upload a
		// file
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

						// Set environment
						reactFlow.setNodes(json.nodes);
						reactFlow.setEdges(json.edges);
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

	useHotkey("Meta+s", downloadEnvironment);
	useHotkey("Shift+F", fitNodes);

	const width = useWindowWidth();

	return (
		<div
			className={`absolute left-0 z-40 flex flex-row h-12 w-full overflow-scroll text-xs antialiased bg-white shadow-sm dark:bg-black flex-nowrap ${
				bottom ? "bottom-0" : "top-0"
			}`}
		>
			<Tool
				icon={<HandIcon />}
				tool={_Tool.Hand}
				description="Drag to pan the canvas"
				hotkey="h"
				showTitle={false}
			/>
			<Tool
				icon={<ArrowTopRightIcon />}
				tool={_Tool.Vector}
				description="Shows a vector in the vector space"
				hotkey="v"
				showTitle={!minify}
			/>
			<Tool
				icon={<LayersIcon />}
				tool={_Tool.Matrix}
				description="Allows you to transform the space"
				hotkey="m"
				showTitle={!minify}
			/>

			<ToolDropdown
				icon={<MathIcon />}
				title="Math"
				showTitle={!minify}
				up={bottom}
				tools={[
					{
						icon: <ButtonIcon />,
						tool: _Tool.Constant,
						description: "Define a constant in your environment",
						hotkey: "c",
					},
					{
						icon: <SliderIcon />,
						tool: _Tool.Slider,
						description: "A slider between two values",
						hotkey: "l",
					},
					{
						icon: <BoxIcon />,
						tool: _Tool.UnaryOperation,
						description:
							"Unary operator that takes a single argument",
						hotkey: "u",
					},
					{
						icon: <DotIcon />,
						tool: _Tool.BinaryOperation,
						description: "Binary operator that takes two arguments",
						hotkey: "b",
					},
				]}
			/>
			<ToolDropdown
				icon={<LinearAlgebraIcon />}
				title="Linear algebra"
				showTitle={!minify}
				up={bottom}
				tools={[
					{
						icon: <NormIcon />,
						tool: _Tool.Norm,
						description: "Computes the norm of a vector",
						hotkey: "n",
					},
					{
						icon: <TransformationIcon />,
						tool: _Tool.Transformed,
						description: "Transforms a vector with a matrix",
						hotkey: "r",
					},
					{
						icon: <VectorScalingIcon />,
						tool: _Tool.VectorScaling,
						description: "Scales a vector by a scalar",
						hotkey: "z",
					},
					{
						icon: <VectorComponentsIcon />,
						tool: _Tool.VectorComponents,
						description: "Returns the components of a vector",
						hotkey: "l",
					},
					{
						icon: <TransposeIcon />,
						tool: _Tool.Transpose,
						description: "Transposes a matrix",
						hotkey: "t",
					},
					{
						icon: <BoxModelIcon />,
						tool: _Tool.MatrixMultiplication,
						description:
							"Computes the multiplication of two matrices",
						hotkey: "a",
					},
					{
						icon: <ThickArrowUpIcon />,
						tool: _Tool.Eigenvalues,
						description: "Computes the eigenvalues of a matrix",
						hotkey: "e",
					},
					{
						icon: <EigenvectorsIcon />,
						tool: _Tool.Eigenvectors,
						description:
							"Computes and shows — in purple — the eigenvectors of a matrix",
						hotkey: "i",
					},
				]}
			/>

			<div className="flex items-center justify-center text-sm grow">
				{minify ? "" : "linalg.dev"}
			</div>

			{minify || (
				<>
					<VectorSpaceSizeControl />
					<Toggle
						icon={<FitFrameIcon />}
						tip="Fit nodes into view"
						onClick={fitNodes}
					/>

					<DividerVerticalIcon className="flex items-center justify-center w-4 h-12 text-zinc-300 dark:text-zinc-700" />

					<Toggle
						icon={<DownloadIcon />}
						tip="Download environment to share with others"
						onClick={downloadEnvironment}
					/>
					<Toggle
						icon={<UploadIcon />}
						tip="Upload environment to view and edit"
						onClick={uploadEnvironment}
					/>

					<DividerVerticalIcon className="flex items-center justify-center w-4 h-12 text-zinc-300 dark:text-zinc-700" />

					<Toggle
						icon={<SunIcon />}
						altIcon={<MoonIcon />}
						tip="Enable/disable dark mode"
						toggled={darkMode}
						onClick={setDarkMode}
					/>
				</>
			)}

			<Dialog.Root>
				<Dialog.Trigger>
					<Toggle
						icon={<InfoCircledIcon />}
						tip="Show information about the project"
					/>
				</Dialog.Trigger>

				<Dialog.Portal>
					<Dialog.Overlay className="fixed inset-0 z-40 animate-fadein-fast bg-offblack/40 dark:bg-offwhite/10" />
					<Dialog.Content
						className="fixed z-50 w-[90vw] max-w-[560px] h-[60vh] max-h-[640px] py-10 px-4 top-[50%] left-[50%] animate-fadein bg-offwhite dark:bg-offblack text-offblack dark:text-offwhite rounded shadow-lg"
						style={{ transform: "translate(-50%, -50%)" }}
					>
						<div className="w-full h-full px-6 overflow-scroll">
							<Dialog.Title className="pt-4 pb-2 text-2xl">
								About the project
							</Dialog.Title>

							<p className="pb-2 text-sm">
								This is a web application for visualising and
								editing linear algebra problems in three
								dimensions with a node environment. Its purpose
								is to be a tool for students studying linear
								algebra to get an intuition of the underlying
								mathematics behind the concepts in linear
								algebra.
							</p>

							<p className="text-sm">
								Nodes can be added to the environment by
								selecting one of the node types in the toolbar
								and clicking anywhere in the environment. The
								nodes can be connected by dragging from one
								handle to another. Vectors will be shown in the
								vector space on the right. You can click on a
								vector there to show its node in the
								environment. Matrices can be used to transform
								the vector space.
							</p>

							<h2 className="pt-4 pb-2 text-xl">
								Example environments
							</h2>

							<div className="flex flex-col gap-4 my-4">
								<ExampleDownload file="svd.json" />
								<ExampleDownload file="pca.json" />
							</div>

							<h2 className="pt-4 pb-4 text-xl">
								Keyboard shortcuts
							</h2>

							<Shortcut
								description="Save environment"
								hotkey="Meta S"
							/>
							<Shortcut
								description="Upload environment"
								hotkey="Meta U"
							/>
							<Shortcut
								description="Fit nodes in frame"
								hotkey="Shift F"
							/>
							<Shortcut
								description="Multi-select nodes"
								hotkey="Hold shift"
							/>

							<p className="mt-4 mb-2 text-xs text-zinc-500">
								Every node type has its own keyboard shortcut
								that can be discovered when hovering over its
								button.
							</p>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>

			<a
				className="h-12"
				href="https://github.com/cristianpjensen/linalg.dev"
			>
				<Toggle icon={<GitHubLogoIcon />} tip="Show source code" />
			</a>
		</div>
	);
};

type IExampleDownloadProps = {
	file: string;
};

const ExampleDownload = ({ file }: IExampleDownloadProps) => {
	return (
		<a
			className="flex items-center justify-between w-full h-12 p-4 border rounded-md cursor-pointer border-zinc-300 dark:border-zinc-700 hover:bg-offblack/10 dark:hover:bg-offwhite/10"
			download={file}
			href={`/examples/${file}`}
		>
			<div className="font-mono text-sm grow">{file}</div>
			<DownloadIcon />
		</a>
	);
};

type IShortcutProps = {
	description: string;
	hotkey: string;
};

const Shortcut = ({ description, hotkey }: IShortcutProps) => {
	let hk = hotkey;
	if (navigator.userAgent.includes("Mac")) {
		hk = hotkey
			.replace("Meta", "⌘")
			.replace("Alt", "⌥")
			.replace("Ctrl", "⌃");
	} else {
		hk = hotkey.replace("Meta", "Ctrl");
	}

	return (
		<div className="flex items-center justify-between w-full h-10 p-2">
			<div className="text-sm text-left grow">{description}</div>
			<div className="text-xs text-zinc-500">{hk}</div>
		</div>
	);
};

const VectorSpaceSizeControl = () => {
	const vectorSpaceSize = useEditorStore((state) => state.vectorSpaceSize);
	const setVectorSpaceSize = useEditorStore(
		(state) => state.setVectorSpaceSize
	);

	const [isOpen, setIsOpen] = useState(false);

	const setSize = (size: 1 | 2 | 3 | 4 | 1e99) => {
		setVectorSpaceSize(size);
		setIsOpen(false);
	};

	const onClick1 = () => setSize(1);
	const onClick2 = () => setSize(2);
	const onClick3 = () => setSize(3);
	const onClick4 = () => setSize(4);
	const onClickInf = () => setSize(1e99);

	return (
		<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
			<Popover.Trigger>
				<Tooltip tip="Change the size of the vector space">
					<div className="flex items-center justify-center w-20 h-12 px-4 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">
						1&thinsp;/&thinsp;
						{vectorSpaceSize === 1e99 ? "∞" : vectorSpaceSize}
						<CaretDownIcon
							className={`ml-05 hover:translate-y-0.5 transition-transform ${
								isOpen ? "translate-y-0.5" : ""
							}`}
						/>
					</div>
				</Tooltip>
			</Popover.Trigger>

			<Popover.Content className="w-32 text-xs text-black bg-white rounded-b shadow-md dark:bg-black dark:text-white">
				<DropdownButton onClick={onClick1}>
					1&thinsp;/&thinsp;1
				</DropdownButton>
				<DropdownButton onClick={onClick2}>
					1&thinsp;/&thinsp;2
				</DropdownButton>
				<DropdownButton onClick={onClick3}>
					1&thinsp;/&thinsp;3
				</DropdownButton>
				<DropdownButton onClick={onClick4}>
					1&thinsp;/&thinsp;4
				</DropdownButton>
				<DropdownButton onClick={onClickInf}>
					1&thinsp;/&thinsp;∞
				</DropdownButton>
			</Popover.Content>
		</Popover.Root>
	);
};

type IDropdownButtonProps = {
	children: React.ReactNode;
	onClick: () => void;
	hotkey?: string;
};

function DropdownButton({ children, onClick, hotkey }: IDropdownButtonProps) {
	return (
		<button
			onClick={onClick}
			className="flex items-center justify-center w-full h-10 hover:bg-zinc-200 dark:hover:bg-zinc-700"
		>
			<div className="absolute flex w-full pl-3 justify-left text-zinc-400 dark:text-zinc-500">
				{hotkey}
			</div>

			{children}
		</button>
	);
}

interface IToolProps {
	tool: _Tool;
	icon: React.ReactElement;
	description: string;
	tooltipSide?: "left" | "right" | "top" | "bottom";
	hotkey?: string;
	dropdown?: boolean;
	showTitle?: boolean;
}

const Tool = ({
	icon,
	tool,
	description,
	tooltipSide,
	hotkey,
	dropdown = false,
	showTitle = true,
}: IToolProps) => {
	const currentTool = useEditorStore((state) => state.tool);
	const setTool = useEditorStore((state) => state.setTool);

	const onToolChange = () => {
		setTool(tool);
	};

	useHotkey(hotkey, onToolChange);

	return (
		<Tooltip tip={description} side={tooltipSide} hotkey={hotkey}>
			<div
				className={`flex justify-center items-center px-4 h-12 cursor-pointer text-ellipsis ${
					currentTool === tool
						? "bg-offblack dark:bg-offwhite text-white dark:text-black"
						: "hover:bg-zinc-200 dark:hover:bg-zinc-700"
				} ${dropdown ? "w-40 pl-10" : ""}`}
				onClick={onToolChange}
			>
				{dropdown ? (
					<>
						<div className="absolute flex items-center justify-center w-4 h-4 left-3">
							{icon}
						</div>
						{tool}
					</>
				) : (
					<>
						<div className={`${showTitle ? "mr-2" : ""}`}>
							{icon}
						</div>
						{!showTitle ? null : tool}
					</>
				)}
			</div>
		</Tooltip>
	);
};

interface IToolDropdownProps {
	title: string;
	icon: React.ReactElement;
	tools: Array<IToolProps>;
	showTitle?: boolean;
	up?: boolean;
}

const ToolDropdown = ({
	icon,
	title,
	tools,
	showTitle = true,
	up = false,
}: IToolDropdownProps) => {
	const currentTool = useEditorStore((state) => state.tool);
	const setTool = useEditorStore((state) => state.setTool);

	const isSelected = tools.some((tool) => tool.tool === currentTool);
	const [isOpen, setIsOpen] = useState(false);

	tools.forEach(({ tool, hotkey }) => {
		// Set hotkey here, because otherwise it will only be usable when the
		// dropdown is open
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useHotkey(hotkey, () => {
			setTool(tool);
		});
	});

	return (
		<Popover.Root open={isOpen} onOpenChange={setIsOpen}>
			<Popover.Trigger>
				<div
					className={`flex justify-center items-center h-12 px-4 cursor-pointer overflow-hidden text-ellipsis ${
						isSelected
							? "bg-offblack dark:bg-offwhite text-white dark:text-black"
							: "hover:bg-zinc-200 dark:hover:bg-zinc-700"
					}`}
				>
					{cloneElement(icon, {
						className: showTitle ? "mr-2" : "",
					})}{" "}
					{showTitle ? title : null}
					{up ? (
						<CaretUpIcon
							className={`ml-0.5 hover:-translate-y-0.5 transition-transform ${
								isOpen ? "-translate-y-0.5" : ""
							}`}
						/>
					) : (
						<CaretDownIcon
							className={`ml-0.5 hover:translate-y-0.5 transition-transform ${
								isOpen ? "translate-y-0.5" : ""
							}`}
						/>
					)}
				</div>
			</Popover.Trigger>

			<Popover.Content
				className={`flex flex-col text-xs text-black bg-white dark:bg-black dark:text-white ${
					up ? "rounded-t" : "rounded-b shadow-md"
				}`}
			>
				{tools.map((tool) => (
					<Tool
						key={tool.tool}
						tooltipSide="right"
						dropdown
						{...tool}
					/>
				))}
			</Popover.Content>
		</Popover.Root>
	);
};

interface IToggleProps {
	icon: React.ReactElement;
	tip: string;
	altIcon?: React.ReactElement;
	toggled?: boolean;
	onClick?: (value: boolean) => void;
}

function Toggle({ icon, tip, altIcon, toggled, onClick }: IToggleProps) {
	const [state, setState] = useState(toggled);

	const onComponentClick = () => {
		setState((prev) => {
			onClick && onClick(!prev);
			return !prev;
		});
	};

	return (
		<Tooltip tip={tip}>
			<div
				onClick={onComponentClick}
				className="flex items-center justify-center w-12 h-12 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700"
			>
				{state && altIcon ? altIcon : icon}
			</div>
		</Tooltip>
	);
}

export default Toolbar;
