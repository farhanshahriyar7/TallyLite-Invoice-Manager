"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Invoice, InvoiceStatus } from "@/lib/invoices"
import { createInvoice, updateInvoice, generateInvoiceNumber } from "@/lib/invoices"
import { useAuth } from "@/contexts/auth-context"

interface InvoiceFormProps {
  invoice?: Invoice
  onSuccess?: (invoice: Invoice) => void
  onCancel?: () => void
}

export function InvoiceForm({ invoice, onSuccess, onCancel }: InvoiceFormProps) {
  const { user } = useAuth()
  const isEditing = !!invoice

  const [formData, setFormData] = useState({
    invoiceNumber: invoice?.invoiceNumber || generateInvoiceNumber(),
    clientName: invoice?.clientName || "",
    clientEmail: invoice?.clientEmail || "",
    amount: invoice?.amount?.toString() || "",
    currency: invoice?.currency || "USD",
    status: invoice?.status || ("draft" as InvoiceStatus),
    issueDate: invoice?.issueDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0],
    dueDate: invoice?.dueDate?.toISOString().split("T")[0] || "",
    description: invoice?.description || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required"
    if (!formData.clientEmail.trim()) newErrors.clientEmail = "Client email is required"
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) newErrors.amount = "Valid amount is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.clientEmail && !emailRegex.test(formData.clientEmail)) {
      newErrors.clientEmail = "Valid email address is required"
    }

    // Due date validation
    if (formData.dueDate && new Date(formData.dueDate) < new Date(formData.issueDate)) {
      newErrors.dueDate = "Due date must be after issue date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !user) return

    setIsSubmitting(true)

    try {
      const invoiceData = {
        invoiceNumber: formData.invoiceNumber,
        clientName: formData.clientName.trim(),
        clientEmail: formData.clientEmail.trim(),
        amount: Number.parseFloat(formData.amount),
        currency: formData.currency,
        status: formData.status,
        issueDate: new Date(formData.issueDate),
        dueDate: new Date(formData.dueDate),
        description: formData.description.trim(),
        createdBy: user.id,
      }

      let result: Invoice | null

      if (isEditing && invoice) {
        result = updateInvoice(invoice.id, invoiceData)
      } else {
        result = createInvoice(invoiceData)
      }

      if (result) {
        onSuccess?.(result)
      }
    } catch (error) {
      console.error("Error saving invoice:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Invoice" : "Create New Invoice"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                disabled={isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                placeholder="Enter client name"
              />
              {errors.clientName && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.clientName}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                placeholder="client@example.com"
              />
              {errors.clientEmail && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.clientEmail}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                placeholder="0.00"
              />
              {errors.amount && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.amount}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={(e) => handleInputChange("issueDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
              />
              {errors.dueDate && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.dueDate}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the services or products..."
              rows={4}
            />
            {errors.description && (
              <Alert variant="destructive">
                <AlertDescription>{errors.description}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Invoice" : "Create Invoice"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
