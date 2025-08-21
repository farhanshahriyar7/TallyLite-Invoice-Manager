"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "./admin-stats"
import { UserManagement } from "./user-management"
import { InvoiceList } from "@/components/dashboard/invoice-list"
import { InvoiceCharts } from "@/components/dashboard/invoice-charts"
import { getAllInvoices, getInvoiceStats } from "@/lib/invoices"
import { getUserStats } from "@/lib/auth"

export function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleDataChange = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const allInvoices = getAllInvoices()
  const invoiceStats = getInvoiceStats(allInvoices)
  const userStats = getUserStats()

  return (
    <div className="space-y-6" key={refreshKey}>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground">System overview and management tools</p>
      </div>

      <AdminStats userStats={userStats} invoiceStats={invoiceStats} />

      <InvoiceCharts invoices={allInvoices} isAdmin={true} />

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">All Invoices</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="space-y-4">
          <InvoiceList invoices={allInvoices} showCreateButton={false} onInvoiceChange={handleDataChange} />
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
