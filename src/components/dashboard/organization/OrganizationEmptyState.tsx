import * as React from "react";
import Link from "next/link";
import { FolderKanban, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OrganizationEmptyStateProps {
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  actionButtonText?: string;
  onActionClick?: () => void;
  actionHref?: string;
  actionComponent?: React.ReactNode;
  className?: string;
}

export function OrganizationEmptyState({
  title,
  description,
  badge,
  icon,
  actionButtonText,
  onActionClick,
  actionHref,
  actionComponent,
  className,
}: OrganizationEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-gradient-to-b from-white to-slate-50/50 p-10 sm:p-14 text-center shadow-xs transition-all",
        className,
      )}
    >
      <div className="relative mb-4">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#124E8C] to-[#0B1F3A] text-amber-300 shadow-md ring-4 ring-sky-100">
          {icon || <FolderKanban className="size-8" />}
        </div>
        {badge ? (
          <Badge
            variant="brand"
            className="absolute -top-2 -right-3 px-2 py-0.5 text-[10px] font-bold shadow-xs bg-amber-400 text-slate-900 border-amber-300"
          >
            {badge}
          </Badge>
        ) : null}
      </div>

      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-bold text-[#0B1F3A] tracking-tight">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      {actionComponent ? (
        <div className="mt-6">{actionComponent}</div>
      ) : actionButtonText ? (
        <div className="mt-6 flex items-center gap-3">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center justify-center gap-2 bg-[#124E8C] text-white hover:bg-[#0B1F3A] font-semibold text-xs shadow-sm h-9 px-4 rounded-xl transition-colors"
            >
              <Sparkles className="size-3.5 mr-1.5 text-amber-300" />
              {actionButtonText}
            </Link>
          ) : (
            <Button
              onClick={onActionClick}
              className="bg-[#124E8C] text-white hover:bg-[#0B1F3A] font-semibold text-xs shadow-sm h-9 px-4 rounded-xl cursor-default"
            >
              <Sparkles className="size-3.5 mr-1.5 text-amber-300" />
              {actionButtonText}
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
