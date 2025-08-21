// Invoice types and utilities
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled"

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  amount: number
  currency: string
  status: InvoiceStatus
  issueDate: Date
  dueDate: Date
  description: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// Mock invoice data
export const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    clientName: "Acme Corporation",
    clientEmail: "billing@acme.com",
    amount: 2500.0,
    currency: "USD",
    status: "paid",
    issueDate: new Date("2024-01-15"),
    dueDate: new Date("2024-02-15"),
    description: "Web development services",
    createdBy: "2",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    clientName: "Tech Solutions Inc",
    clientEmail: "accounts@techsolutions.com",
    amount: 1800.0,
    currency: "USD",
    status: "sent",
    issueDate: new Date("2024-01-20"),
    dueDate: new Date("2024-02-20"),
    description: "UI/UX Design consultation",
    createdBy: "2",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    clientName: "StartupXYZ",
    clientEmail: "finance@startupxyz.com",
    amount: 3200.0,
    currency: "USD",
    status: "overdue",
    issueDate: new Date("2024-01-10"),
    dueDate: new Date("2024-01-25"),
    description: "Mobile app development",
    createdBy: "2",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    clientName: "Global Enterprises",
    clientEmail: "billing@global.com",
    amount: 4500.0,
    currency: "USD",
    status: "draft",
    issueDate: new Date("2024-01-25"),
    dueDate: new Date("2024-02-25"),
    description: "System integration project",
    createdBy: "1",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
]

// CRUD operations for invoices
export const createInvoice = (invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">): Invoice => {
  const newInvoice: Invoice = {
    ...invoiceData,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockInvoices.push(newInvoice)
  return newInvoice
}

export const updateInvoice = (id: string, updates: Partial<Invoice>): Invoice | null => {
  const index = mockInvoices.findIndex((invoice) => invoice.id === id)
  if (index === -1) return null

  mockInvoices[index] = {
    ...mockInvoices[index],
    ...updates,
    updatedAt: new Date(),
  }

  return mockInvoices[index]
}

export const deleteInvoice = (id: string): boolean => {
  const index = mockInvoices.findIndex((invoice) => invoice.id === id)
  if (index === -1) return false

  mockInvoices.splice(index, 1)
  return true
}

export const getInvoiceById = (id: string): Invoice | null => {
  return mockInvoices.find((invoice) => invoice.id === id) || null
}

export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear()
  const existingNumbers = mockInvoices
    .map((inv) => inv.invoiceNumber)
    .filter((num) => num.startsWith(`INV-${year}-`))
    .map((num) => Number.parseInt(num.split("-")[2]))
    .sort((a, b) => b - a)

  const nextNumber = existingNumbers.length > 0 ? existingNumbers[0] + 1 : 1
  return `INV-${year}-${nextNumber.toString().padStart(3, "0")}`
}

// Utility functions
export const getInvoicesByUser = (userId: string): Invoice[] => {
  return mockInvoices.filter((invoice) => invoice.createdBy === userId)
}

export const getAllInvoices = (): Invoice[] => {
  return mockInvoices
}

export const getInvoiceStats = (invoices: Invoice[]) => {
  const total = invoices.length
  const paid = invoices.filter((inv) => inv.status === "paid").length
  const overdue = invoices.filter((inv) => inv.status === "overdue").length
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)

  return {
    total,
    paid,
    overdue,
    totalAmount,
    paidAmount,
  }
}

export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export const getStatusColor = (status: InvoiceStatus): string => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "sent":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "draft":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    case "cancelled":
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }
}
