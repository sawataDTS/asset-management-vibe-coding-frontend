"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Bookmark, Download, FileDown, Sparkles } from "lucide-react"

import { PromptReportResults } from "./prompt-report-results"
import { useRegisterReportExport } from "../shared/reports-export-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { downloadReportCsv, openPrintableReport } from "@/lib/reports/export"
import {
  generatePromptReport,
  getPromptGeneratedOn,
  PROMPT_EXAMPLES,
  type PromptReportResult,
} from "@/lib/reports/prompt"
import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

function PromptReportTab() {
  const [query, setQuery] = useState("")
  const [savedPrompts, setSavedPrompts] = useState<string[]>([])
  const [result, setResult] = useState<PromptReportResult | null>(null)
  const generatedOn = getPromptGeneratedOn()

  const exportSnapshot = useMemo(() => {
    if (!result) return null

    return {
      reportTitle: result.title,
      rowCount: result.rows.length,
      columns: result.columns,
      rows: result.rows,
      kpis: result.kpis,
    }
  }, [result])

  useRegisterReportExport(exportSnapshot)

  function handleGenerate(nextQuery = query) {
    const trimmed = nextQuery.trim()
    if (!trimmed) {
      toast.error("Enter a question before generating a report.")
      return
    }

    const report = generatePromptReport(trimmed)
    if (!report) {
      toast.error("Could not build a report from that prompt.")
      return
    }

    setQuery(trimmed)
    setResult(report)
    toast.success("Report generated")
  }

  function handleSavePrompt() {
    const trimmed = query.trim()
    if (!trimmed) {
      toast.error("Enter a question to save.")
      return
    }

    if (savedPrompts.includes(trimmed)) {
      toast.message("Prompt already saved")
      return
    }

    setSavedPrompts((current) => [trimmed, ...current])
    toast.success("Prompt saved")
  }

  function handleExampleClick(example: string) {
    setQuery(example)
    handleGenerate(example)
  }

  function handleSavedPromptClick(prompt: string) {
    setQuery(prompt)
    handleGenerate(prompt)
  }

  function handleCsvExport() {
    if (!exportSnapshot?.rowCount) {
      toast.error("Generate a report before exporting.")
      return
    }

    downloadReportCsv(exportSnapshot)
    toast.success("CSV download started")
  }

  function handlePdfExport() {
    if (!exportSnapshot?.rowCount) {
      toast.error("Generate a report before exporting.")
      return
    }

    const opened = openPrintableReport(exportSnapshot)
    if (!opened) {
      toast.error("Allow pop-ups to download this report as PDF.")
      return
    }

    toast.success("Choose Save as PDF in the print dialog")
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-0 py-0" data-report-export-hide>
        <CardContent className="flex flex-col gap-6 p-(--card-spacing)">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary ring-1 ring-border/60">
              <Sparkles className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <h3 className={typeScale.title}>Prompt-based report</h3>
              <p className={cn("mt-1.5 max-w-3xl leading-relaxed", typeScale.body.muted)}>
                Describe what you need in plain language — assets, licenses, employees, or Google
                Workspace mailbox storage and quotas (synced from directory). AssetOps converts your
                prompt to read-only SQL and builds a presentation-ready report with KPIs and detail
                rows.
              </p>
            </div>
          </div>

          <Field>
            <FieldLabel htmlFor="prompt-query">Your question</FieldLabel>
            <Textarea
              id="prompt-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. Employees over 90% mailbox quota with department, or assigned MacBooks with warranty expiring in 60 days"
              className="min-h-28"
            />
          </Field>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              className="bg-gradient-brand text-primary-foreground hover:opacity-90"
              onClick={() => handleGenerate()}
            >
              <Sparkles />
              Generate report
            </Button>
            <Button variant="outline" onClick={handleSavePrompt}>
              <Bookmark />
              Save prompt
            </Button>
            {result ? (
              <>
                <Button variant="outline" onClick={handleCsvExport}>
                  <Download />
                  CSV
                </Button>
                <Button variant="outline" onClick={handlePdfExport}>
                  <FileDown />
                  PDF
                </Button>
              </>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <p className={typeScale.caption.overline}>Try an example</p>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              {PROMPT_EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                >
                  <span className={typeScale.body.default}>{example}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border/60 pt-6">
            <p className={typeScale.caption.overline}>Saved prompts</p>
            {savedPrompts.length === 0 ? (
              <p className={typeScale.body.muted}>
                Save a prompt to reuse it later — your saved questions appear here.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {savedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSavedPromptClick(prompt)}
                    className="rounded-lg border border-border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className={typeScale.body.default}>{prompt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {result ? (
        <div data-report-printable>
          <PromptReportResults result={result} generatedOn={generatedOn} />
        </div>
      ) : null}
    </div>
  )
}

export { PromptReportTab }
