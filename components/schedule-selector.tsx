"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock } from "lucide-react"
import { useEmailStore } from "@/lib/store"
import { format, addHours, isAfter } from "date-fns"

export function ScheduleSelector() {
  const { emailData, updateEmailData } = useEmailStore()
  const [error, setError] = useState("")

  // Get current date and minimum allowed date (1 hour from now)
  const now = new Date()
  const minDateTime = addHours(now, 1)

  // Format for datetime-local input
  const formatForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm")
  }

  const handleDateTimeChange = (value: string) => {
    const selectedDate = new Date(value)

    if (!isAfter(selectedDate, minDateTime)) {
      setError("Schedule time must be at least 1 hour from now")
      return
    }

    updateEmailData({ scheduledDate: selectedDate })
    setError("")
  }

  const handleTimezoneChange = (timezone: string) => {
    updateEmailData({ timezone })
  }

  const quickScheduleOptions = [
    { label: "In 1 hour", value: addHours(now, 1) },
    { label: "In 2 hours", value: addHours(now, 2) },
    { label: "Tomorrow 9 AM", value: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0) },
    {
      label: "Next Monday 9 AM",
      value: (() => {
        const nextMonday = new Date(now)
        nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7))
        nextMonday.setHours(9, 0, 0, 0)
        return nextMonday
      })(),
    },
  ]

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ]

  return (
    <div className="space-y-4">
      {/* Quick Schedule Options */}
      <div>
        <Label>Quick Schedule</Label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {quickScheduleOptions.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                updateEmailData({ scheduledDate: option.value })
                setError("")
              }}
              className="justify-start text-left"
            >
              <Clock className="w-4 h-4 mr-2" />
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Date/Time */}
      <div>
        <Label htmlFor="schedule-datetime">Custom Date & Time</Label>
        <div className="mt-2">
          <Input
            id="schedule-datetime"
            type="datetime-local"
            min={formatForInput(minDateTime)}
            value={emailData.scheduledDate ? formatForInput(emailData.scheduledDate) : ""}
            onChange={(e) => handleDateTimeChange(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>

      {/* Timezone */}
      <div>
        <Label>Timezone</Label>
        <Select value={emailData.timezone} onValueChange={handleTimezoneChange}>
          <SelectTrigger className="mt-2 rounded-xl">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-gray-200 hover:cursor-pointer">
            {timezones.map((tz) => (
              <SelectItem key={tz} value={tz} className="hover:cursor-pointer">
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Schedule Summary */}
      {emailData.scheduledDate && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">Scheduled for:</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            {format(emailData.scheduledDate, "PPP p")} ({emailData.timezone})
          </p>
        </div>
      )}
    </div>
  )
}
