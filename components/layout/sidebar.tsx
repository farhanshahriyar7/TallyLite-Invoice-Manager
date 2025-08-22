"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  Menu,
  LogOut,
  Plus,
  Settings,
  HelpCircle,
  User,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { ProfileDialog } from "@/components/profile/profile-dialog"

interface SidebarProps {
  currentView: string
  onViewChange: (view: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ currentView, onViewChange, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { user, logout, hasRole } = useAuth()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["user", "admin"],
    },
    {
      id: "invoices",
      label: "My Invoices",
      icon: FileText,
      roles: ["user", "admin"],
    },
    {
      id: "create-invoice",
      label: "Create Invoice",
      icon: Plus,
      roles: ["user", "admin"],
    },
    {
      id: "all-invoices",
      label: "All Invoices",
      icon: FileText,
      roles: ["admin"],
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      roles: ["admin"],
    },
  ]

  const filteredItems = navigationItems.filter((item) => item.roles.includes(user?.role || "user"))

  const handleNavigation = (viewId: string) => {
    onViewChange(viewId)
    setOpen(false)
  }

  const SidebarContent = ({ showLabels = true }: { showLabels?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className={cn("p-6 border-b border-border", !showLabels && "p-4")}>
        <div className="flex items-center justify-between">
          {showLabels && (
            <div>
              <h2 className="text-lg font-semibold text-foreground">TallyLite</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.role === "admin" ? "Administrator" : "User"} Panel
              </p>
            </div>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={cn("h-8 w-8 p-0", !showLabels && "mx-auto")}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full gap-3 shadow-none",
                showLabels ? "justify-start" : "justify-center p-2",
                isActive && "bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-500/90 hover:to-orange-400/90",
                !isActive && "hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-orange-400/10",
              )}
              onClick={() => handleNavigation(item.id)}
              title={!showLabels ? item.label : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {showLabels && <span className="truncate">{item.label}</span>}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        {showLabels ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-orange-400/10"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md ring-2 ring-orange-500/20 transition-all duration-200 hover:shadow-lg hover:ring-orange-500/30">
                      <span className="text-sm font-semibold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card shadow-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => setProfileOpen(true)}>
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-2 h-auto hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-orange-400/10"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md ring-2 ring-orange-500/20 transition-all duration-200 hover:shadow-lg hover:ring-orange-500/30">
                    <span className="text-sm font-semibold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card shadow-sm"></div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2 ml-2">
              <div className="px-2 py-1.5 text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => setProfileOpen(true)}>
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border transition-all duration-300 ease-in-out",
          isCollapsed ? "md:w-16" : "md:w-64",
        )}
      >
        <SidebarContent showLabels={!isCollapsed} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* ProfileDialog component */}
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  )
}
