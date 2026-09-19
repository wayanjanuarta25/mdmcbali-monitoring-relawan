import * as React from "react";
import { FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center space-y-3 transition-all",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl bg-[#EAF3FF] text-[#124E8C] shadow-xs ring-1 ring-[#124E8C]/10">
        {icon || <FolderOpen className="size-7" />}
      </div>
      <div className="max-w-md space-y-1">
        <h4 className="text-sm font-bold text-[#0B1F3A]">{title}</h4>
        {description ? (
          <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        ) : null}
      </div>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
