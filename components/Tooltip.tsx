import * as HoverCard from "@radix-ui/react-hover-card";

interface TooltipProps {
  children: React.ReactNode;
  tip: string;
}

export function Tooltip({ children, tip }: TooltipProps) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>{children}</HoverCard.Trigger>

      <HoverCard.Content className="bg-slate-900 text-white p-2 rounded text-xs max-w-40 text-center">
        {tip}
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
