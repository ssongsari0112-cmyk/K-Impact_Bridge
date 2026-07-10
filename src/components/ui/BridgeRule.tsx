import { cn } from "@/lib/utils";

export function BridgeRule({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-[3px] w-[120px] rounded-full bg-gradient-to-r from-harbor to-bridge", className)}
    />
  );
}
