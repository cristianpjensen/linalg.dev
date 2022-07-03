import * as HoverCard from "@radix-ui/react-hover-card";

interface TooltipProps {
  children: React.ReactNode;
  tip: string;
  hotkey?: string;
}

export function Tooltip({ children, tip, hotkey }: TooltipProps) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>{children}</HoverCard.Trigger>

      <HoverCard.Content className="bg-white dark:bg-black text-black dark:text-white p-2 rounded text-xs shadow-sm max-w-[172px] text-center">
        {tip}
        {hotkey && (
          <span className="text-gray-400"> &nbsp;{hotkey.toUpperCase()}</span>
        )}
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
