"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Bell, FileText, User, Settings, CreditCard, Activity, Clock } from "lucide-react"
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  formatTimeAgo,
  type Notification,
} from "@/lib/notifications"
import { cn } from "@/lib/utils"

interface NotificationPanelProps {
  onNavigate?: (view: string) => void
}

export function NotificationPanel({ onNavigate }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(getNotifications())
  const [unreadCount, setUnreadCount] = useState(getUnreadCount())

  const getNotificationIcon = (type: Notification["type"], priority: Notification["priority"]) => {
    const iconClass = cn(
      "w-4 h-4",
      priority === "high" ? "text-red-500" : priority === "medium" ? "text-orange-500" : "text-blue-500",
    )

    switch (type) {
      case "invoice":
        return <FileText className={iconClass} />
      case "user":
        return <User className={iconClass} />
      case "system":
        return <Settings className={iconClass} />
      case "payment":
        return <CreditCard className={iconClass} />
      case "activity":
        return <Activity className={iconClass} />
      default:
        return <Bell className={iconClass} />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
      setNotifications(getNotifications())
      setUnreadCount(getUnreadCount())
    }

    if (notification.actionable && notification.actionView && onNavigate) {
      onNavigate(notification.actionView)
    }
  }

  const handleMarkAllRead = () => {
    markAllAsRead()
    setNotifications(getNotifications())
    setUnreadCount(0)
  }

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500"
      case "medium":
        return "border-l-orange-500"
      default:
        return "border-l-blue-500"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-orange-400/10"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-orange-500 to-orange-400">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs">
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "p-3 border-l-2 cursor-pointer transition-colors hover:bg-muted/50",
                    getPriorityColor(notification.priority),
                    !notification.read && "bg-muted/30",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type, notification.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={cn(
                            "text-sm font-medium truncate",
                            !notification.read && "text-foreground",
                            notification.read && "text-muted-foreground",
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        {notification.actionable && (
                          <span className="text-xs text-orange-500 font-medium">
                            {notification.actionText || "View"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full justify-center text-xs">
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
