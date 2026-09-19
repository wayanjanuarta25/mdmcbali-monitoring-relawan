import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-slate-500">
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li className="inline-flex items-center gap-1.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-slate-500 hover:text-[#124E8C] transition-colors"
          >
            <Home className="size-3.5 text-slate-400" />
            <span>MDMC</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              <ChevronRight className="size-3.5 text-slate-400 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[#124E8C] transition-colors font-medium text-slate-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-[#0B1F3A]">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
