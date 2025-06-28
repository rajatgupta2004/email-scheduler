"use client"

import { useEffect, useState } from "react"
import { EmailComposer } from "@/components/email-composer"
import { EmailPreview } from "@/components/email-preview"
import { Button } from "@/components/ui/button"
import { Eye, Send, Save } from "lucide-react"
import { useEmailStore } from "@/lib/store"
import { toast } from "sonner"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [showPreview, setShowPreview] = useState(false)
  const [editorContent, setEditorContent] = useState<string>("");

  const { emailData, isValid } = useEmailStore()
  const handlePreview = () => {
    setShowPreview(true)
  }
  
   useEffect(() => {
    const value = localStorage.getItem("editorContent");
    setEditorContent(value||"");
  }, []);
  const handleSend = () => {
    if (isValid()) {
      console.log("Sending email:", emailData)
      console.log('email body:',editorContent)
      toast("Email scheduled successfully!", {
        description: "Your email has been scheduled for sending.",
        duration: 3000,
      }
      )
      // alert("Email scheduled successfully!")
    }
  }

  return (
    <div className="min-h-scree bg-sky-600/10">
      <header className="bg-zinc-100 shadow-sm border-b border-gray-200 px-4 py-4 ">
        <div className="max-w-6xl mx-auto flex items-center justify-between ">
          <h1 className="text-2xl font-bold text-gray-900">Email Scheduler</h1>
          <div className="flex items-center gap-3">
            <Button onClick={handlePreview} className=" bg-blue-500 text-white hover:bg-blue-600 rounded-xl flex items-center gap-2 ">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button onClick={handleSend} disabled={!isValid()} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Schedule Send
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        <EmailComposer />
      </main>

      {showPreview && <EmailPreview onClose={() => setShowPreview(false)} />}
    </div>
  )
}
