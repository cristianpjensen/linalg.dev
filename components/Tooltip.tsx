import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface ITooltipProps {
	children: React.ReactNode;
	tip: string;
	side?: "left" | "right" | "top" | "bottom";
	hotkey?: string;
}

export function Tooltip({
	children,
	tip,
	side = "bottom",
	hotkey,
}: ITooltipProps) {
	return (
		<TooltipPrimitive.Root>
			<TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>

			<TooltipPrimitive.Content
				side={side}
				className="bg-white dark:bg-black text-black dark:text-white p-2 rounded text-xs shadow-sm max-w-[172px]"
			>
				{tip}
				{hotkey && (
					<span className="text-zinc-400 dark:text-zinc-500">
						{" "}
						&nbsp;{hotkey.toUpperCase()}
					</span>
				)}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Root>
	);
}
