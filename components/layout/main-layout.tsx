"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "./sidebar"
import { UserDashboard } from "@/components/dashboard/user-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { InvoiceList } from "@/components/dashboard/invoice-list"
import { InvoiceForm } from "@/components/invoices/invoice-form"
import { UserManagement } from "@/components/admin/user-management"
import { RoleGuard } from "@/components/auth/role-guard"
import { getInvoicesByUser, getAllInvoices } from "@/lib/invoices"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Settings, ChevronRight, Home } from "lucide-react"
import { NotificationPanel } from "./notification-panel"

export function MainLayout() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState("dashboard")
  const [refreshKey, setRefreshKey] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleDataChange = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />

      case "invoices":
        return (
          <div className="space-y-6" key={refreshKey}>
            <div>
              <h2 className="text-2xl font-bold text-foreground">My Invoices</h2>
              <p className="text-muted-foreground">Manage your personal invoices</p>
            </div>
            <InvoiceList invoices={getInvoicesByUser(user?.id || "")} onInvoiceChange={handleDataChange} />
          </div>
        )

      case "create-invoice":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Create Invoice</h2>
              <p className="text-muted-foreground">Create a new invoice for your client</p>
            </div>
            <InvoiceForm
              onSuccess={() => {
                setCurrentView("invoices")
                handleDataChange()
              }}
              onCancel={() => setCurrentView("invoices")}
            />
          </div>
        )

      case "all-invoices":
        return (
          <RoleGuard allowedRoles={["admin"]}>
            <div className="space-y-6" key={refreshKey}>
              <div>
                <h2 className="text-2xl font-bold text-foreground">All Invoices</h2>
                <p className="text-muted-foreground">System-wide invoice management</p>
              </div>
              <InvoiceList invoices={getAllInvoices()} showCreateButton={false} onInvoiceChange={handleDataChange} />
            </div>
          </RoleGuard>
        )

      case "users":
        return (
          <RoleGuard allowedRoles={["admin"]}>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">User Management</h2>
                <p className="text-muted-foreground">Manage system users and permissions</p>
              </div>
              <UserManagement />
            </div>
          </RoleGuard>
        )

      default:
        return user?.role === "admin" ? <AdminDashboard /> : <UserDashboard />
    }
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ label: "Home", view: "dashboard" }]

    switch (currentView) {
      case "invoices":
        breadcrumbs.push({ label: "My Invoices", view: "invoices" })
        break
      case "create-invoice":
        breadcrumbs.push({ label: "My Invoices", view: "invoices" })
        breadcrumbs.push({ label: "Create Invoice", view: "create-invoice" })
        break
      case "all-invoices":
        breadcrumbs.push({ label: "All Invoices", view: "all-invoices" })
        break
      case "users":
        breadcrumbs.push({ label: "User Management", view: "users" })
        break
    }

    return breadcrumbs
  }

  const getPageTitle = () => {
    switch (currentView) {
      case "dashboard":
        return user?.role === "admin" ? "Admin Dashboard" : "Dashboard"
      case "invoices":
        return "My Invoices"
      case "create-invoice":
        return "Create New Invoice"
      case "all-invoices":
        return "All Invoices"
      case "users":
        return "User Management"
      default:
        return "Dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
      />

      {/* Main Content */}
      <div className={cn("transition-all duration-300 ease-in-out", sidebarCollapsed ? "md:pl-16" : "md:pl-64")}>
        <header className="bg-card border-b border-border px-4 py-3 md:px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-foreground">{getPageTitle()}</h1>
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  {getBreadcrumbs().map((crumb, index) => (
                    <div key={crumb.view} className="flex items-center gap-1">
                      {index === 0 && <Home className="w-3 h-3" />}
                      <button
                        onClick={() => setCurrentView(crumb.view)}
                        className={cn(
                          "hover:text-foreground transition-colors",
                          index === getBreadcrumbs().length - 1 && "text-foreground font-medium",
                        )}
                      >
                        {crumb.label}
                      </button>
                      {index < getBreadcrumbs().length - 1 && <ChevronRight className="w-3 h-3" />}
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>

              {/* Quick Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Quick Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCurrentView("create-invoice")}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Invoice
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => setCurrentView("users")}>
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Users
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications */}
              <NotificationPanel onNavigate={setCurrentView} />

              {/* User Info */}
              <div className="flex items-center gap-2 pl-3 border-l border-border">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <Badge variant={user?.role === "admin" ? "default" : "secondary"}>
                  {user?.role === "admin" ? "Admin" : "User"}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">{renderContent()}</main>
      </div>
    </div>
  )
}
