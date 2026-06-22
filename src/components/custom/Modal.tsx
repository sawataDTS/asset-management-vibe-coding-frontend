import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import closeIcon from "@/assets/cross.svg"
import { Button } from "../ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"
interface modal {
  title: string
  maxWidth?: string
  className?: string
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
  description?: string
}

export default function Modal({ title, description, open, setOpen, maxWidth, children, className }: modal) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          `${maxWidth} inline-flex max-h-[90%] w-[90%] max-w-[600px] flex-col gap-6 overflow-y-auto rounded-2xl bg-card p-10 md:w-full`,
          className
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
          <div className="flex flex-col">
            <DialogTitle className="text-2xl leading-7 font-medium text-foreground">{title}</DialogTitle>
            <DialogDescription className="text-sm leading-snug font-medium text-muted-foreground">
              {description}
            </DialogDescription>
          </div>

          <Button
            variant="ghost"
            onClick={() => setOpen(!open)}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded p-0 hover:bg-transparent"
            aria-label="Close"
          >
            <Image src={closeIcon} height={18} width={18} alt="close modal" className="block" />
          </Button>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  )
}
