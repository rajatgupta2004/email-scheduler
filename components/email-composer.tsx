"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RichTextEditor  from "@/components/rich-text-editor"
import { RecipientManager } from "@/components/recipient-manager"
import { AttachmentUploader } from "@/components/attachment-uploader"
import { ScheduleSelector } from "@/components/schedule-selector"
import { useEmailStore } from "@/lib/store"

export function EmailComposer() {
  const { emailData, updateEmailData } = useEmailStore()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Subject */}
        <Card className="bg-white/80 shadow-xl rounded-2xl border-[3px] border-gray-600/50">
          <CardHeader>
            <CardTitle>Email Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="subject">Subject Line *</Label>
            <Input
              id="subject"
              placeholder="Enter your email subject..."
              value={emailData.subject}
              onChange={(e) => updateEmailData({ subject: e.target.value })}
              className="mt-2 rounded-xl"
            />
          </CardContent>
        </Card>

        {/* Rich Text Editor */}
        <Card className="bg-white/80 shadow-xl rounded-2xl border-[3px] border-gray-600/50 ">
          <CardHeader>
            <CardTitle>Email Message</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor />
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="bg-white/80 shadow-xl rounded-2xl border-[3px] border-gray-600/50">
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <AttachmentUploader />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Recipients */}
        <Card className="bg-white/80 shadow-xl rounded-2xl border-[3px] border-gray-600/50">
          <CardHeader>
            <CardTitle>Recipients</CardTitle>
          </CardHeader>
          <CardContent>
            <RecipientManager />
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="bg-white/80 shadow-xl rounded-2xl border-[3px] border-gray-600/50">
          <CardHeader>
            <CardTitle>Schedule Send</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleSelector />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
