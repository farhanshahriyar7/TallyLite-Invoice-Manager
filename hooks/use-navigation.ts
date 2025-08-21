"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"

export type NavigationView = "dashboard" | "invoices" | "create-invoice" | "all-invoices" | "users"

export function useNavigation() {
  const { hasRole } = useAuth()
  const [currentView, setCurrentView] = useState<NavigationView>("dashboard")

  const navigateTo = useCallback(
    (view: NavigationView) => {
      // Role-based navigation guards
      if (view === "all-invoices" && !hasRole("admin")) {
        console.warn("Access denied: Admin role required for all invoices view")
        return
      }

      if (view === "users" && !hasRole("admin")) {
        console.warn("Access denied: Admin role required for user management")
        return
      }

      setCurrentView(view)
    },
    [hasRole],
  )

  const canAccess = useCallback(
    (view: NavigationView): boolean => {
      switch (view) {
        case "all-invoices":
        case "users":
          return hasRole("admin")
        case "dashboard":
        case "invoices":
        case "create-invoice":
          return true
        default:
          return false
      }
    },
    [hasRole],
  )

  return {
    currentView,
    navigateTo,
    canAccess,
  }
}
