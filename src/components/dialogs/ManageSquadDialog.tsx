import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AgentMultiSelect, Agent } from "@/components/ui/agent-multi-select"
import { mockPlayers } from "@/data/mockData"

interface Team {
  id: string
  name: string
  acronym: string
  logoUrl?: string
  city?: string
  country?: string
  squadCount: number
}

interface ManageSquadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team: Team
  seasonId: string
  seasonName: string
}

// Mock current squad members (already in the squad)
const mockCurrentSquad: Agent[] = [
  { id: "player2", name: "André Silva", type: "agent", number: 15 },
  { id: "player6", name: "Michael Brown", type: "agent", number: 33 },
  { id: "player7", name: "Lucas Mendes", type: "agent", number: 8 },
]

export function ManageSquadDialog({
  open,
  onOpenChange,
  team,
  seasonId,
  seasonName
}: ManageSquadDialogProps) {
  const [squadMembers, setSquadMembers] = useState<Agent[]>(mockCurrentSquad)

  const handleSave = () => {
    console.log("Saving squad:", squadMembers.map(a => a.id))
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset to original squad on cancel
    setSquadMembers(mockCurrentSquad)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-[#0d0d0d] border-[#1f1f1f]">
        <DialogHeader>
          <DialogTitle className="text-white">Manage Squad - {team.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <AgentMultiSelect
            value={squadMembers}
            onChange={setSquadMembers}
            players={mockPlayers.map(p => ({ id: p.id, name: p.name, number: p.number }))}
            teams={[]}
            placeholder="Search and select members..."
          />
          <p className="text-sm text-muted-foreground">
            Add players and coaches that belong to this team in {seasonName}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-[#1f1f1f]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#153A8A] hover:bg-[#1a4aa8]"
          >
            Save Squad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
