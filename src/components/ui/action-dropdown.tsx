import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, BarChart3, Users, AlertTriangle, Gamepad2 } from "lucide-react"

interface ActionDropdownProps {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onStats?: () => void
  onManageSquad?: () => void
  onMatchControl?: () => void
  onReport?: () => void
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showStats?: boolean
  showManageSquad?: boolean
  showMatchControl?: boolean
  showReport?: boolean
}

export function ActionDropdown({
  onView,
  onEdit,
  onDelete,
  onStats,
  onManageSquad,
  onMatchControl,
  onReport,
  showView = true,
  showEdit = true,
  showDelete = true,
  showStats = false,
  showManageSquad = false,
  showMatchControl = false,
  showReport = false
}: ActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open options menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-2">
        {showView && onView && (
          <DropdownMenuItem onClick={onView} className="py-2 px-3 cursor-pointer">
            <Eye className="mr-3 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        {showEdit && onEdit && (
          <DropdownMenuItem onClick={onEdit} className="py-2 px-3 cursor-pointer">
            <Edit className="mr-3 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {showStats && onStats && (
          <DropdownMenuItem onClick={onStats} className="py-2 px-3 cursor-pointer">
            <BarChart3 className="mr-3 h-4 w-4" />
            Stats
          </DropdownMenuItem>
        )}
        {showManageSquad && onManageSquad && (
          <DropdownMenuItem onClick={onManageSquad} className="py-2 px-3 cursor-pointer">
            <Users className="mr-3 h-4 w-4" />
            Manage Squad
          </DropdownMenuItem>
        )}
        {showMatchControl && onMatchControl && (
          <DropdownMenuItem onClick={onMatchControl} className="py-2 px-3 cursor-pointer">
            <Gamepad2 className="mr-3 h-4 w-4" />
            Controle de Partida
          </DropdownMenuItem>
        )}
        {showReport && onReport && (
          <DropdownMenuItem onClick={onReport} className="py-2 px-3 cursor-pointer">
            <AlertTriangle className="mr-3 h-4 w-4" />
            Reportar Problema
          </DropdownMenuItem>
        )}
        {showDelete && onDelete && (
          <DropdownMenuItem onClick={onDelete} className="py-2 px-3 cursor-pointer">
            <Trash2 className="mr-3 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}