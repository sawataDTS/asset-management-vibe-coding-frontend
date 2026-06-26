"use client"

import { Button } from "@/components/ui/button"
import { CardActions } from "@/components/ui/card"

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { dialogHeaderClassName, dialogScrollBodyClassName, dialogShellClassName } from "@/lib/dialog-layout"

import { typeScale } from "@/lib/typography"
import { cn } from "@/lib/utils"

interface IProps {
  open: any
  onOpenChange: any
  selectedAsset: any
}

export default function HistoryHardwareDialog({ open, onOpenChange, selectedAsset }: IProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogShellClassName}>
        <DialogHeader className={dialogHeaderClassName}>
          <DialogTitle>Audit & Activity Tracking</DialogTitle>
          <DialogDescription>
            Timeline logs for device <span className={typeScale.body.emphasis}>{selectedAsset?.tag}</span> (
            {selectedAsset?.name}).
          </DialogDescription>
        </DialogHeader>

        {selectedAsset ? (
          <>
            <DialogBody className={dialogScrollBodyClassName}>
              <div className="relative ml-2 space-y-6 border-l-2 border-border pl-6">
                {selectedAsset.history.map((evt, idx) => (
                  <div key={`${evt.date}-${idx}`} className="relative">
                    <div className="absolute top-1.5 left-[-31px] size-2.5 rounded-full bg-primary ring-4 ring-card" />
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className={typeScale.body.emphasis}>{evt.action}</span>
                        <span className={cn(typeScale.caption.meta, "font-mono tabular-nums")}>
                          {evt.date}
                        </span>
                      </div>
                      <p className={cn("mt-0.5", typeScale.body.muted)}>
                        Performed by <span className={typeScale.body.emphasis}>{evt.user}</span>
                      </p>
                      {evt.notes ? (
                        <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 p-2 italic">
                          <p className={typeScale.body.muted}>&ldquo;{evt.notes}&rdquo;</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </DialogBody>
            <CardActions>
              <DialogClose asChild>
                <Button type="button">Close Log</Button>
              </DialogClose>
            </CardActions>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
