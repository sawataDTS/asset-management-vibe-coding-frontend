import { CardContainer } from "@/components/ui/card-container"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { Mail } from "lucide-react"

export default function MailboxHealthTab() {
  return (
    <CardContainer contentClassName="py-16">
      <Empty className="border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="bg-accent text-primary">
            <Mail />
          </EmptyMedia>
          <EmptyTitle>Mailbox overview</EmptyTitle>
          <EmptyDescription>Coming soon. Mailbox insights will appear here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </CardContainer>
  )
}
