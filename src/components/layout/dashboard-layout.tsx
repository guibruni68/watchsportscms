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
              <SidebarTrigger className="lg:hidden" />
              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar conteúdo..."
                    className="pl-10 pr-4 py-2 w-64 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile search trigger */}
              <Button variant="ghost" size="sm" className="md:hidden">
                <Search className="h-4 w-4" />
              </Button>


              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">
                      {user?.email?.split('@')[0] || (isGuest ? 'Visitante' : 'Usuário')}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {isGuest ? 'Sair do Modo Visitante' : 'Sair'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu trigger */}
              <SidebarTrigger className="md:hidden">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
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