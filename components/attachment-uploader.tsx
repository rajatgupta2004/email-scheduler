"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, File, X, AlertCircle } from "lucide-react"
import { useEmailStore } from "@/lib/store"

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploading?: boolean
  progress?: number
}

export function AttachmentUploader() {
  const { emailData, updateEmailData } = useEmailStore()
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const emailDataRef = useRef(emailData)
  useEffect(() => {
    emailDataRef.current = emailData
  }, [emailData])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setError("")

    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        setError(prev =>
          prev
            ? `${prev}, ${file.name}`
            : `These files exceed 5MB limit: ${file.name}`
        )
        return false
      }
      return true
    })

    if (validFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    validFiles.forEach(file => {
  const id = Math.random().toString(36).substring(2, 11)

  const attachment: Attachment = {
    id,
    name: file.name,
    size: file.size,
    type: file.type,
    uploading: true,
    progress: 0,
  }

  // Add attachment immediately
  const updatedAttachments = [...emailDataRef.current.attachments, attachment]
  updateEmailData({ attachments: updatedAttachments })

  // Generate preview
  generatePreview(file, id, updatedAttachments) // <-- pass updated list
  simulateUpload(id)
})


    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const generatePreview = (file: File, attachmentId: string, attachments: Attachment[]) => {
  console.log("Generating preview:", file.name, file.type)

  if (file.type.startsWith("image/")) {
    const reader = new FileReader()
    reader.onload = e => {
      updateEmailData({
        attachments: attachments.map(att =>
          att.id === attachmentId
            ? { ...att, url: e.target?.result as string }
            : att
        ),
      })
    }
    reader.readAsDataURL(file)
  } else {
    const url = URL.createObjectURL(file)
    console.log("Assigned URL:", url)
    updateEmailData({
      attachments: attachments.map(att =>
        att.id === attachmentId
          ? { ...att, url }
          : att
      ),
    })
  }
}


  const simulateUpload = (attachmentId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      progress = Math.min(progress, 100)

      updateEmailData({
        attachments: emailDataRef.current.attachments.map(att =>
          att.id === attachmentId
            ? { ...att, progress }
            : att
        ),
      })

      if (progress >= 100) {
        clearInterval(interval)
        updateEmailData({
          attachments: emailDataRef.current.attachments.map(att =>
            att.id === attachmentId
              ? { ...att, uploading: false, progress: 100 }
              : att
          ),
        })
      }
    }, 200)
  }

  const removeAttachment = (attachmentId: string) => {
    const attachment = emailDataRef.current.attachments.find(att => att.id === attachmentId)
    if (attachment?.url) {
      URL.revokeObjectURL(attachment.url)
    }
    updateEmailData({
      attachments: emailDataRef.current.attachments.filter(att => att.id !== attachmentId),
    })
  }

  const renderFilePreview = (attachment: Attachment) => {
    // console.log('hiiiiii');
    // console.log(attachment);
    if (!attachment.url) return null

    const extension = attachment.name.split(".").pop()?.toLowerCase()
    if (attachment.type.startsWith("image/")) {
      return (
        <div className="w-16 h-16 flex-shrink-0">
          <img
            src={attachment.url}
            alt={attachment.name}
            className="w-full h-full object-cover rounded border border-gray-200"
          />
        </div>
      )
    }
    return (
      <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
        {attachment.type === "application/pdf" ? (
          <File className="w-8 h-8 text-red-500" />
        ) : (
          <File className="w-8 h-8 text-gray-400" />
        )}
      </div>
    )
  }

  console.log("Current attachments:", emailData.attachments);


  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
        <p className="text-xs text-gray-500 mt-1">
          Maximum 5MB per file (Images, PDFs, Docs)
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {emailData.attachments.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Attachments ({emailData.attachments.length})</span>
            <span>
              Total:{" "}
              {formatFileSize(
                emailData.attachments.reduce((sum, att) => sum + att.size, 0)
              )}
            </span>
          </div>

          <div className="space-y-3">
            {emailData.attachments.map(attachment => (
              <div
                key={attachment.id}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
              >
                {renderFilePreview(attachment)}

                <div className="flex-1 min-w-0">
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-medium text-blue-600 hover:underline truncate"
                  >
                    {attachment.name}
                  </a>
                  <p className="text-xs text-gray-500 mb-1">
                    {formatFileSize(attachment.size)} •{" "}
                    {attachment.type.split("/")[1] || attachment.type}
                  </p>

                  {attachment.uploading && (
                    <div className="mt-1">
                      <Progress value={attachment.progress || 0} className="h-1" />
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {attachment.progress?.toFixed(0)}%
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="text-gray-400 hover:text-red-600 flex-shrink-0 mt-1"
                  disabled={attachment.uploading}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
