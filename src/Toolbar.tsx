import React, { cloneElement, useState } from "react";
import { useReactFlow } from "reactflow";
import {
	ArrowTopRightIcon,
	BoxIcon,
	BoxModelIcon,
	ButtonIcon,
	CaretDownIcon,
	CaretUpIcon,
	CubeIcon,
	DividerVerticalIcon,
	DotIcon,
	DownloadIcon,
	GitHubLogoIcon,
	HandIcon,
	InfoCircledIcon,
	LayersIcon,
	MoonIcon,
	ResetIcon,
	ShadowInnerIcon,
	SliderIcon,
	SunIcon,
	ThickArrowUpIcon,
	UploadIcon,
	VideoIcon,
} from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";

import { Tooltip } from "./utils";
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
	PlaneIcon,
	VectorSpaceIcon,
} from "./icons";
import { useHotkey } from "./hooks";
import { useEditorStore, Tool as _Tool, setDarkMode } from "../stores";

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

	const [isInfoOpen, setIsInfoOpen] = useState(
		localStorage.getItem("info") === null
	);

	const handleInfo = (open: boolean) => {
		if (!open) {
			localStorage.setItem("info", "seen");
		}

		setIsInfoOpen(open);
	};

	return (
		<div
			className={`fixed left-0 z-40 flex flex-row h-12 w-full overflow-scroll text-xs antialiased bg-white shadow-sm dark:bg-black flex-nowrap ${
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
						hotkey: "w",
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
						icon: <PlaneIcon />,
						tool: _Tool.Plane,
						description:
							"Defines a plane by a point and two direction vectors",
						hotkey: "p",
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

			<Dialog.Root open={isInfoOpen} onOpenChange={handleInfo}>
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

							<p className="pb-2">
								This is a web application for visualising and
								editing linear algebra problems in three
								dimensions with a node environment. Its purpose
								is to be a tool for students studying linear
								algebra to get an intuition of the underlying
								mathematics behind the concepts in linear
								algebra.
							</p>

							<p className="pb-2">
								Nodes can be added to the environment by
								selecting one of the node types in the toolbar
								and clicking anywhere in the environment. The
								real power of this application comes from the
								ability to connect nodes together to form a
								graph. Nodes can be connected by dragging an
								edge from one handle to another.
							</p>

							<p>
								Vectors will be shown in the vector space on the
								right. You can click on a vector there to show
								its node in the environment. Matrices can be
								used to transform the vector space.
							</p>

							<h2 className="pt-4 pb-2 text-xl">Controls</h2>

							<div className="flex flex-col gap-4 mt-2 mb-4">
								<Control
									title="Vector node"
									icon={<ArrowTopRightIcon />}
									description="Select this tool by clicking on it in the toolbar or by pressing the V hotkey. Click anywhere in the environment to add a vector node. The x-, y-, and z-components of the vector can be edited by clicking on the corresponding input field. They can also be edited by connecting it to other nodes that output numbers, like the constant node. The vector can then be seen in the vector space on the right. It animates as the vector changes and as the vector space is transformed. The vector node itself also has some settings that can be played around with, such as the color and how it is represented."
									video="/assets/vector.gif"
								/>

								<Control
									title="Matrix node"
									icon={<LayersIcon />}
									description="This node can be added to the environment in the same way as the vector node. The matrix can be edited by clicking on the corresponding input fields. The matrix can then be used to transform the vector space by clicking on the Transform button."
									video="/assets/matrix.gif"
								/>

								<Control
									title="Elementary math nodes"
									icon={<MathIcon />}
									description="These nodes can be used to perform basic arithmetic operations on numbers. These nodes output numbers and can be connected to other nodes that take numbers as input, like vector nodes. If you want to control a matrix in this way, you must first pass it to a vector which is then passed to the matrix. If you do not want to show this vector in the vector space, you can click on the eye icon to hide it."
									video="/assets/math.gif"
								/>

								<Control
									title="Linear algebra nodes"
									icon={<LinearAlgebraIcon />}
									description="These nodes can be used to perform linear algebra operations on vectors and matrices."
								/>

								<Control
									title="Plane node"
									icon={<PlaneIcon />}
									description="This node represents a plane in the vector space. It is defined by a point and two direction vectors. It can be found under the linear algebra nodes."
									video="/assets/plane.gif"
								/>

								<Control
									title="Undo all transformations"
									icon={<ResetIcon />}
									description="This button will reset the vector space to its original state. It can be found in the bottom right."
									video="/assets/matrix.gif"
								/>

								<Control
									title="Transform grid with transformations"
									icon={<VectorSpaceIcon />}
									description="If on (default), the grid in the vector space will be transformed with the transformations applied to the vector space. If off, the grid will remain static."
								/>

								<Control
									title="Show colorful cube"
									icon={<CubeIcon />}
									description="Shows a colorful cube that gives a better overview of the transformations."
									video="/assets/matrix.gif"
								/>

								<Control
									title="Show vectors as data points"
									icon={<ShadowInnerIcon />}
									description="If on, vectors will be shown as spheres in the vector space. This can be turned off or on individually for each vector as well."
								/>

								<Control
									title="Fit nodes in frame"
									icon={<FitFrameIcon />}
								/>

								<Control
									title="Download current environment"
									icon={<DownloadIcon />}
									description="Encodes your current environment as a JSON file and downloads it. This is used for sharing environments."
								/>

								<Control
									title="Upload environment"
									icon={<UploadIcon />}
									description="Uploads a JSON file that encodes an environment. Example environments to upload can be found under Example environments."
								/>

								<Control
									title="Show this dialog"
									icon={<InfoCircledIcon />}
								/>
							</div>

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

type IControlProps = {
	title: string;
	icon: React.ReactNode;
	description?: string;
	video?: string;
};

const Control = ({ title, icon, description, video }: IControlProps) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-4">
				<div className="flex items-center justify-center flex-none w-8 h-8 transition-all duration-200 rounded shadow-b1 shadow-zinc-400 dark:shadow-zinc-600 hover:shadow-zinc-600 dark:hover:shadow-zinc-400 hover:shadow-b2">
					{icon}
				</div>

				<div className="grow">{title}</div>

				{video && (
					<Popover.Root>
						<Popover.Trigger>
							<div className="flex items-center justify-center flex-none w-8 h-8 rounded cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
								<VideoIcon />
							</div>
						</Popover.Trigger>

						<Popover.Content className="p-4 bg-white rounded w-[600px] max-w-[100vw] shadow-b1 shadow-zinc-400 dark:shadow-zinc-600 dark:bg-black">
							<img src={video} className="w-full aspect-video" />
						</Popover.Content>
					</Popover.Root>
				)}
			</div>

			{description && (
				<p className="text-sm text-zinc-600 dark:text-zinc-400">
					{description}
				</p>
			)}
		</div>
	);
};

type IExampleDownloadProps = {
	file: string;
};

const ExampleDownload = ({ file }: IExampleDownloadProps) => {
	return (
		<a
			className="flex items-center justify-between w-full h-12 p-4 transition-all duration-200 rounded-md cursor-pointer shadow-b1 shadow-zinc-400 dark:shadow-zinc-600 hover:shadow-b2 hover:shadow-zinc-600 dark:hover:shadow-zinc-400"
			download={file}
			href={`/examples/${file}`}
		>
			<div className="font-mono grow">{file}</div>
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
			<div className="text-left grow">{description}</div>
			<div className="text-sm text-zinc-500">{hk}</div>
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
