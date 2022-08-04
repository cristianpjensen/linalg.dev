import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface ITooltipProps {
	children: React.ReactNode;
	tip: string;
	side?: "left" | "right" | "top" | "bottom";
	hotkey?: string;
	delay?: number;
}

export function Tooltip({
	children,
	tip,
	side = "bottom",
	hotkey,
	delay,
}: ITooltipProps) {
	return (
		<TooltipPrimitive.Root delayDuration={delay}>
			<TooltipPrimitive.Trigger>{children}</TooltipPrimitive.Trigger>

			<TooltipPrimitive.Content
				side={side}
				className="bg-white dark:bg-black text-black dark:text-white p-2 rounded text-xs shadow text-center max-w-[172px]"
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
