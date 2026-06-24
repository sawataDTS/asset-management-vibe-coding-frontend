import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Standard content container inside the scrolling main area. Page padding and
 * vertical rhythm are owned by `PageHeader` (the page wrapper).
 */
function ContentWrapper({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="content-wrapper" className={cn("w-full", className)} {...props} />
}

export { ContentWrapper }
