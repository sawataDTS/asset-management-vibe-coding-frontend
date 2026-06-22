import { Search, X } from "lucide-react"
import { Input } from "../ui/input"

interface SearchUserProps {
  query: string
  placeholder?: string
  onChange: (query: string) => void
}

export default function SearchUser({ query, onChange, placeholder = "Search" }: SearchUserProps) {
  return (
    <div className="relative w-full max-w-[239px] min-w-[239px]">
      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
        <Input
          className="w-full pr-7 pl-10 text-base leading-tight font-medium text-foreground placeholder:font-medium placeholder:text-muted-foreground md:text-base"
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        {query && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground transition-colors hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
