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

      <HoverCard.Content className="bg-slate-900 text-white p-2 rounded text-xs max-w-[172px] text-center">
        {tip} &nbsp;<span className="text-slate-400">{hotkey?.toUpperCase()}</span>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
