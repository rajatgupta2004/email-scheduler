"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Smartphone, X } from "lucide-react"
import { useEmailStore } from "@/lib/store"
import { format } from "date-fns"

interface EmailPreviewProps {
  onClose: () => void
}

export function EmailPreview({ onClose }: EmailPreviewProps) {
  const { emailData } = useEmailStore()

  const EmailContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div
      className={` border border-gray-200 rounded-lg overflow-hidden ${isMobile ? "max-w-sm mx-auto" : "max-w-2xl mx-auto"}`}
    >
      {/* Email Header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="text-sm text-gray-600 mb-1">From: your-email@company.com</div>
        <div className="text-sm text-gray-600 mb-1">
          To: {emailData.recipients.length} recipient{emailData.recipients.length !== 1 ? "s" : ""}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {emailData.scheduledDate && (
            <>
              Scheduled: {format(emailData.scheduledDate, "PPP p")} ({emailData.timezone})
            </>
          )}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">{emailData.subject || "No Subject"}</h2>
      </div>

      {/* Email Body */}
      <div className={`p-4 ${isMobile ? "text-sm" : ""}`}>
        <div
          className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: localStorage.getItem('editorContent') || '<p>No content</p>' }}/>
      </div>

      {/* Attachments */}
      {emailData.attachments.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments ({emailData.attachments.length})</h3>
          <div className="space-y-1">
            {emailData.attachments.map((attachment) => (
              <div key={attachment.id} className="text-sm text-blue-600">
                📎 {attachment.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    
    <Dialog  open={true} onOpenChange={onClose}> 
      <DialogContent className="rounded rounded-2x max-w-4xl max-h-[90vh] overflow-y-auto p-6 bg-zinc-200">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Email Preview</DialogTitle>
          </div>
        </DialogHeader>
        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="desktop" className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Desktop View
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Mobile View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="desktop" className="mt-4">
            <div className="bg-gray-100 p-6 rounded-lg">
              <EmailContent />
            </div>
          </TabsContent>

          <TabsContent value="mobile" className="mt-4">
            <div className="bg-gray-100 p-6 rounded-lg">
              <EmailContent isMobile={true} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview Summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Email Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Recipients:</span>
              <span className="ml-2 font-medium">{emailData.recipients.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Attachments:</span>
              <span className="ml-2 font-medium">{emailData.attachments.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Subject:</span>
              <span className="ml-2 font-medium">{emailData.subject || "No subject"}</span>
            </div>
            <div>
              <span className="text-gray-600">Scheduled:</span>
              <span className="ml-2 font-medium">
                {emailData.scheduledDate ? format(emailData.scheduledDate, "PPP p") : "Not scheduled"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}
