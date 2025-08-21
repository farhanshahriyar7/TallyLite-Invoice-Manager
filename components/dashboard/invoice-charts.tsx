"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import type { Invoice } from "@/lib/invoices"

interface InvoiceChartsProps {
  invoices: Invoice[]
  isAdmin?: boolean
}

export function InvoiceCharts({ invoices, isAdmin = false }: InvoiceChartsProps) {
  // Status distribution data
  const statusData = [
    {
      name: "Paid",
      value: invoices.filter((inv) => inv.status === "paid").length,
      fill: "hsl(var(--chart-1))",
      label: "Paid",
    },
    {
      name: "Pending",
      value: invoices.filter((inv) => inv.status === "pending").length,
      fill: "hsl(var(--chart-2))",
      label: "Pending",
    },
    {
      name: "Overdue",
      value: invoices.filter((inv) => inv.status === "overdue").length,
      fill: "hsl(var(--chart-3))",
      label: "Overdue",
    },
    {
      name: "Draft",
      value: invoices.filter((inv) => inv.status === "draft").length,
      fill: "hsl(var(--chart-4))",
      label: "Draft",
    },
  ].filter((item) => item.value > 0)

  // Monthly revenue data (last 6 months)
  const monthlyData = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleDateString("en-US", { month: "short" })
    const monthInvoices = invoices.filter((inv) => {
      const invDate = new Date(inv.issueDate)
      return invDate.getMonth() === date.getMonth() && invDate.getFullYear() === date.getFullYear()
    })
    const revenue = monthInvoices.reduce((sum, inv) => sum + inv.amount, 0)
    monthlyData.push({
      month: monthName,
      revenue,
      label: monthName, // Added label property
    })
  }

  // Top clients data (for admin view)
  const clientData = isAdmin
    ? (() => {
        const clientRevenue = invoices.reduce(
          (acc, inv) => {
            if (inv?.clientName) {
              // Added safety check
              acc[inv.clientName] = (acc[inv.clientName] || 0) + inv.amount
            }
            return acc
          },
          {} as Record<string, number>,
        )

        return Object.entries(clientRevenue)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([client, revenue]) => ({
            client,
            revenue,
            label: client, // Added label property
          }))
      })()
    : []

  if (!invoices || invoices.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>Create some invoices to see charts</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Invoice Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Status</CardTitle>
          <CardDescription>Distribution of invoice statuses</CardDescription>
        </CardHeader>
        <CardContent>
          {statusData.length > 0 ? (
            <ChartContainer
              config={{
                paid: { label: "Paid", color: "hsl(var(--chart-1))" },
                pending: { label: "Pending", color: "hsl(var(--chart-2))" },
                overdue: { label: "Overdue", color: "hsl(var(--chart-3))" },
                draft: { label: "Draft", color: "hsl(var(--chart-4))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">{data.name}</span>
                                <span className="font-bold text-muted-foreground">{data.value}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No invoice data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                              <span className="font-bold text-muted-foreground">${payload[0].value}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-revenue)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top Clients (Admin only) */}
      {isAdmin && clientData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
            <CardDescription>Highest revenue generating clients</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--chart-2))" },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="client" type="category" width={80} />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                                <span className="font-bold text-muted-foreground">${payload[0].value}</span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
