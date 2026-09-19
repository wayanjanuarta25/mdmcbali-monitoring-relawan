"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { QuickActionItem } from "@/data/mock/dashboard";
import { cn } from "@/lib/utils";

export interface QuickActionCardProps {
  actions: QuickActionItem[];
  title?: string;
  subtitle?: string;
  onActionClick?: (actionKey: string) => void;
  className?: string;
}

export function QuickActionCard({
  actions,
  title = "Quick Action",
  subtitle = "Akses cepat ke modul operasional utama",
  onActionClick,
  className,
}: QuickActionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5",
        className,
      )}
    >
      <div>
        <h3 className="text-base font-bold text-[#0B1F3A] flex items-center gap-2">
          <Sparkles className="size-4 text-amber-500" />
          {title}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const isPrimary = action.variant === "primary";

          return (
            <div
              key={action.id}
              className={cn(
                "group flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 hover:shadow-md",
                isPrimary
                  ? "bg-gradient-to-br from-[#0B1F3A] to-[#124E8C] text-white border-transparent"
                  : "bg-slate-50/80 border-slate-200 text-slate-900 hover:bg-white hover:border-[#124E8C]/40",
              )}
            >
              <div className="space-y-1.5">
                <h4
                  className={cn(
                    "text-sm font-bold",
                    isPrimary ? "text-white" : "text-[#0B1F3A]",
                  )}
                >
                  {action.title}
                </h4>
                <p
                  className={cn(
                    "text-xs leading-relaxed",
                    isPrimary ? "text-sky-200" : "text-slate-500",
                  )}
                >
                  {action.description}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-white/10 border-slate-200/60">
                {action.href ? (
                  <Link
                    href={action.href}
                    className={cn(
                      buttonVariants({
                        size: "sm",
                        variant: isPrimary ? "secondary" : "outline",
                      }),
                      "w-full justify-between font-bold text-xs h-9",
                      isPrimary
                        ? "bg-amber-400 hover:bg-amber-500 text-slate-950 border-none"
                        : "border-slate-300 text-[#124E8C] hover:bg-blue-50",
                    )}
                  >
                    <span>{action.buttonText}</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                ) : (
                  <Button
                    size="sm"
                    variant={isPrimary ? "secondary" : "outline"}
                    onClick={() => action.actionKey && onActionClick?.(action.actionKey)}
                    className={cn(
                      "w-full justify-between font-bold text-xs h-9",
                      isPrimary
                        ? "bg-amber-400 hover:bg-amber-500 text-slate-950 border-none"
                        : "border-slate-300 text-[#124E8C] hover:bg-blue-50",
                    )}
                  >
                    <span>{action.buttonText}</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
