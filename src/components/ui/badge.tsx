import * as React from "react"
import { cn } from "@/src/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/80",
    secondary: "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary)]/80",
    destructive: "border-transparent bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]/80",
    success: "border-transparent bg-[var(--success)] text-[var(--success-foreground)] hover:bg-[var(--success)]/80",
    warning: "border-transparent bg-[var(--warning)] text-[var(--warning-foreground)] hover:bg-[var(--warning)]/80",
    outline: "text-[var(--foreground)] border-[var(--border)]",
  }

  return (
    <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2", variants[variant], className)} {...props} />
  )
}

export { Badge }
