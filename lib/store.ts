"use client"

import { create } from "zustand"

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploading?: boolean
  progress?: number
}

interface EmailData {
  subject: string
  recipients: string[]
  attachments: Attachment[]
  scheduledDate: Date | null
  timezone: string
}

interface EmailStore {
  emailData: EmailData
  updateEmailData: (data: Partial<EmailData>) => void
  isValid: () => boolean
  reset: () => void
}

const initialEmailData: EmailData = {
  subject: "",
  recipients: [],
  attachments: [],
  scheduledDate: null,
  timezone: "UTC",
}

export const useEmailStore = create<EmailStore>((set, get) => ({
  emailData: initialEmailData,

  updateEmailData: (data) =>
    set((state) => ({
      emailData: { ...state.emailData, ...data },
    })),
  isValid: () => {
    const { emailData } = get()
    return !!(
      emailData.subject.trim() &&
      emailData.recipients.length > 0 &&
      emailData.scheduledDate
    )
  },
  reset: () => set({ emailData: initialEmailData }),
}))
