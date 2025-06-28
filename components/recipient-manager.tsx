"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Users } from "lucide-react"
import { useEmailStore } from "@/lib/store"
import Papa from "papaparse"

export function RecipientManager() {
  const { emailData, updateEmailData } = useEmailStore()
  const [emailInput, setEmailInput] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase()

    if (!email) return

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (emailData.recipients.includes(email)) {
      setError("Email already added")
      return
    }

    if (emailData.recipients.length >= 1000) {
      setError("Maximum 1000 recipients allowed")
      return
    }

    updateEmailData({
      recipients: [...emailData.recipients, email],
    })
    setEmailInput("")
    setError("")
  }

  const removeEmail = (emailToRemove: string) => {
    updateEmailData({
      recipients: emailData.recipients.filter((email) => email !== emailToRemove),
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addEmail()
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "text/csv") {
      setError("Please upload a CSV file")
      return
    }

    Papa.parse(file, {
      complete: (results) => {
        const emails: string[] = []

        results.data.forEach((row: any) => {
          if (Array.isArray(row)) {
            row.forEach((cell) => {
              const email = String(cell).trim().toLowerCase()
              if (isValidEmail(email) && !emails.includes(email)) {
                emails.push(email)
              }
            })
          }
        })

        const newEmails = emails.filter((email) => !emailData.recipients.includes(email))
        const totalEmails = emailData.recipients.length + newEmails.length

        if (totalEmails > 1000) {
          setError(`Cannot add ${newEmails.length} emails. Maximum 1000 recipients allowed.`)
          return
        }

        updateEmailData({
          recipients: [...emailData.recipients, ...newEmails],
        })
        setError("")
      },
      error: () => {
        setError("Error parsing CSV file")
      },
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Users className="w-4 h-4" />
        <span>{emailData.recipients.length} / 1000 recipients</span>
      </div>

      {/* Manual Input */}
      <div>
        <Label htmlFor="email-input">Add Recipients</Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="email-input"
            placeholder="Enter email address..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 rounded-xl"
          />
          <Button onClick={addEmail} size="sm">
            Add
          </Button>
        </div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>

      {/* CSV Upload */}
      <div>
        <Label>Upload CSV</Label>
        <div className="mt-2">
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2 rounded-xl"
          >
            <Upload className="w-4 h-4" />
            Upload CSV File
          </Button>
        </div>
      </div>

      {/* Recipients List */}
      {emailData.recipients.length > 0 && (
        <div>
          <Label>Recipients ({emailData.recipients.length})</Label>
          <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
            {emailData.recipients.map((email, index) => (
              <Badge key={index} variant="secondary" className="flex items-center justify-between w-full text-left">
                <span className="truncate flex-1">{email}</span>
                <button onClick={() => removeEmail(email)} className="ml-2 hover:text-red-600">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
