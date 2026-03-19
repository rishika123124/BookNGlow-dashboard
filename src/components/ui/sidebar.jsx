"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Simple sidebar context
const SidebarContext = React.createContext()

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children, defaultOpen = false }) {
  const [open, setOpen] = React.useState(defaultOpen)

  const value = {
    open,
    setOpen,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children, className, ...props }) {
  return (
    <div className={cn("flex h-full w-64 flex-col bg-background border-r", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarHeader({ children, className, ...props }) {
  return (
    <div className={cn("p-4 border-b", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarContent({ children, className, ...props }) {
  return (
    <div className={cn("flex-1 overflow-auto p-4", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ children, className, ...props }) {
  return (
    <div className={cn("p-4 border-t", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({ children, className, ...props }) {
  return (
    <ul className={cn("space-y-2", className)} {...props}>
      {children}
    </ul>
  )
}

export function SidebarMenuItem({ children, className, ...props }) {
  return (
    <li className={cn("", className)} {...props}>
      {children}
    </li>
  )
}

export function SidebarMenuButton({ children, className, ...props }) {
  return (
    <button className={cn("w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground", className)} {...props}>
      {children}
    </button>
  )
}
