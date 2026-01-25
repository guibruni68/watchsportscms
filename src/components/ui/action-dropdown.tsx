import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, BarChart3 } from "lucide-react"

interface ActionDropdownProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onStats?: () => void
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showStats?: boolean
}

export function ActionDropdown({ 
  onView, 
  onEdit, 
  onDelete,
  onStats,
  showView = true, 
  showEdit = true, 
  showDelete = true,
  showStats = false
}: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open options menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {showView && onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        {showEdit && onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {showStats && onStats && (
          <DropdownMenuItem onClick={onStats}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Stats
          </DropdownMenuItem>
        )}
        {showDelete && onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}