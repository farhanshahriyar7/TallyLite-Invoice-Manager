export interface Notification {
  id: string
  type: "invoice" | "user" | "system" | "payment" | "activity"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionable?: boolean
  actionText?: string
  actionView?: string
  icon?: string
  priority: "low" | "medium" | "high"
}

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "invoice",
    title: "Invoice Overdue",
    message: "Invoice #INV-001 from Acme Corp is 5 days overdue",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionable: true,
    actionText: "View Invoice",
    actionView: "invoices",
    priority: "high",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received",
    message: "Payment of $2,500 received for Invoice #INV-003",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    type: "user",
    title: "New User Registered",
    message: "Sarah Johnson has joined as a new user",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: true,
    actionable: true,
    actionText: "View Users",
    actionView: "users",
    priority: "low",
  },
  {
    id: "4",
    type: "invoice",
    title: "Invoice Created",
    message: "New invoice #INV-005 created for TechStart Inc",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: true,
    priority: "low",
  },
  {
    id: "5",
    type: "system",
    title: "System Update",
    message: "Invoice management system updated to v2.1.0",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: "medium",
  },
  {
    id: "6",
    type: "activity",
    title: "Bulk Action Completed",
    message: "Successfully updated 12 invoice statuses",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    actionable: true,
    actionText: "Undo Changes",
    priority: "low",
  },
]

export function getNotifications(): Notification[] {
  return mockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getUnreadCount(): number {
  return mockNotifications.filter((n) => !n.read).length
}

export function markAsRead(notificationId: string): void {
  const notification = mockNotifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.read = true
  }
}

export function markAllAsRead(): void {
  mockNotifications.forEach((n) => (n.read = true))
}

export function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return date.toLocaleDateString()
}
