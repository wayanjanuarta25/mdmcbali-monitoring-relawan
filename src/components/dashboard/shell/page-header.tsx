import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  scopeBadge?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  scopeBadge,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 mb-6">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} />
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1 max-w-3xl">
          {eyebrow && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#124E8C]">
              {eyebrow}
            </span>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-[#0B1F3A] sm:text-3xl">
              {title}
            </h1>
            {scopeBadge && (
              <Badge variant="brand" className="text-xs px-2.5 py-0.5">
                {scopeBadge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed pt-1">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
