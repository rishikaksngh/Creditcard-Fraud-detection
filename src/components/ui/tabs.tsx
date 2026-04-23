import * as React from "react"
import { cn } from "@/src/lib/utils"

const Tabs = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
)
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      aria-orientation="horizontal"
      className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-[var(--muted)] p-1 text-[var(--muted-foreground)]", className)}
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string; activeValue?: string; setValue?: (val: string) => void }>(
  ({ className, value, activeValue, setValue, ...props }, ref) => {
    const isActive = activeValue === value;
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${value}`}
        id={`tab-${value}`}
        tabIndex={isActive ? 0 : -1}
        onClick={() => setValue && setValue(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm" : "hover:bg-[var(--background)]/50",
          className
        )}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string; activeValue?: string }>(
  ({ className, value, activeValue, ...props }, ref) => {
    if (activeValue !== value) return null;
    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        tabIndex={0}
        className={cn("mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2", className)}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

// A simple managed tabs wrapper for ease of use
export function ManagedTabs({ defaultValue, children, className }: { defaultValue: string, children: React.ReactNode, className?: string }) {
  const [value, setValue] = React.useState(defaultValue);
  
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        if (child.type === TabsList) {
          return React.cloneElement(child, {
            children: React.Children.map(child.props.children, c => {
              if (!React.isValidElement(c)) return c;
              return React.cloneElement(c as any, { activeValue: value, setValue });
            })
          } as any);
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child as any, { activeValue: value });
        }
        return child;
      })}
    </div>
  )
}

export { TabsList, TabsTrigger, TabsContent }
