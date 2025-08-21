"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/contexts/auth-context"
import { InvoiceStats } from "./invoice-stats"
import { InvoiceList } from "./invoice-list"
import { InvoiceCharts } from "./invoice-charts"
import { getInvoicesByUser, getInvoiceStats } from "@/lib/invoices"

export function UserDashboard() {
  const { user } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const handleInvoiceChange = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  if (!user) return null

  const userInvoices = getInvoicesByUser(user.id)
  const stats = getInvoiceStats(userInvoices)

  return (
    <div className="space-y-6" key={refreshKey}>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your invoices and recent activity</p>
      </div>

      <InvoiceStats stats={stats} />

      <InvoiceCharts invoices={userInvoices} />

      <InvoiceList invoices={userInvoices} onInvoiceChange={handleInvoiceChange} />
    </div>
  )
}
