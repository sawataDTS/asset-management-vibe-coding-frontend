"use client"
import { useRef, useState } from "react"
import { InfoIcon, UploadIcon } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CardContainer } from "@/components/ui/card-container"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

export default function InvoiceIntakeForm() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file: File | null) => {
    if (!file) return
    const allowed = ["image/jpeg", "image/png", "application/pdf"]
    if (!allowed.includes(file.type)) {
      toast.error("Upload a JPG, PNG, or PDF file.")
      return
    }
    if (file.size > 12 * 1024 * 1024) {
      toast.error("File must be under 12 MB.")
      return
    }
    setFileName(file.name)
    toast.success(`Uploaded ${file.name} — ready for AI review.`)
  }

  return (
    <CardContainer
      variant="form"
      title="Add by Invoice"
      description="Upload an invoice (JPG, PNG, or PDF). AI extracts supplier, hardware, and software line items for you to review before creating assets and licenses."
      footer={
        fileName ? (
          <Button onClick={() => toast.success("Opening review step with extracted line items…")}>
            Review extracted items
          </Button>
        ) : undefined
      }
    >
      <ul className={cn("list-inside list-disc space-y-1", typeScale.body.muted)}>
        <li>Hardware lines become asset items.</li>
        <li>Software lines become software licenses.</li>
        <li>Suppliers are matched by name.</li>
        <li>Supported files: JPG, PNG, or PDF.</li>
      </ul>

      <input
        ref={fileRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") fileRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files?.[0] ?? null)
        }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/20 hover:border-primary/40 hover:bg-primary/5"
        )}
      >
        <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-accent text-primary">
          <UploadIcon className="size-5" />
        </span>
        <p className={typeScale.body.emphasis}>{fileName ? fileName : "Drop an invoice here, or"}</p>
        {!fileName ? (
          <Button
            type="button"
            className="mt-3"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              fileRef.current?.click()
            }}
          >
            Choose file
          </Button>
        ) : null}
        <p className={cn("mt-2", typeScale.caption.meta)}>JPG, PNG, or PDF · up to ~12 MB</p>
      </div>

      <Alert>
        <InfoIcon />
        <AlertTitle>How parsing works</AlertTitle>
        <AlertDescription>
          AI parses the invoice into editable line items. Nothing is created until you confirm on the review
          step. The parser will not invent items not present on the invoice.
        </AlertDescription>
      </Alert>
    </CardContainer>
  )
}
