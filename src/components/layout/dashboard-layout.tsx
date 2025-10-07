import { useEffect } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Bell, User, Search, Menu, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useGuestMode } from "@/hooks/useGuestMode"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut, loading } = useAuth()
  const { isGuest, disableGuestMode } = useGuestMode()
  const navigate = useNavigate()
  const { toast } = useToast()

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (!loading && !user && !isGuest) {
      navigate("/auth")
    }
  }, [user, loading, isGuest, navigate])

  const handleSignOut = async () => {
    try {
      if (user) {
        await signOut()
        toast({
          title: "Logout realizado",
          description: "Você foi desconectado com sucesso.",
        })
      } else if (isGuest) {
        disableGuestMode()
        toast({
          title: "Modo visitante finalizado",
          description: "Você saiu do modo visitante.",
        })
      }
      navigate("/auth")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      })
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user && !isGuest && !loading) {
    return null
  }
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}