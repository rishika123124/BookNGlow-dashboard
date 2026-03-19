"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simple chart container component
const ChartContainer = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full h-full", className)}
    {...props}
  >
    {children}
  </div>
))
ChartContainer.displayName = "ChartContainer"

// Simple chart tooltip
const ChartTooltip = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-background p-2 shadow-md", className)}
    {...props}
  >
    {children}
  </div>
))
ChartTooltip.displayName = "ChartTooltip"

// Simple chart legend
const ChartLegend = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-2", className)}
    {...props}
  >
    {children}
  </div>
))
ChartLegend.displayName = "ChartLegend"

export { ChartContainer, ChartTooltip, ChartLegend }
