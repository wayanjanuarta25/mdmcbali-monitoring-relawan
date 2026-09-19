import * as React from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center transition-all ${className}`}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-blue-50 text-[#124E8C] shadow-xs">
        {icon || <AlertCircle className="size-6" />}
      </div>
      <h3 className="mt-4 text-base font-bold text-[#0B1F3A]">{title}</h3>
      <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          className="mt-5 bg-[#124E8C] hover:bg-[#0B1F3A] text-white shadow-xs font-semibold"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
