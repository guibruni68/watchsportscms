import { 
  Home, 
  Video, 
  Radio, 
  Users, 
  Calendar, 
  Palette, 
  Newspaper, 
  DollarSign, 
  BarChart3,
  Settings
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Vídeos VOD", url: "/videos", icon: Video },
  { title: "Lives", url: "/lives", icon: Radio },
  { title: "Times & Elencos", url: "/teams", icon: Users },
  { title: "Agenda", url: "/schedule", icon: Calendar },
  { title: "Notícias", url: "/news", icon: Newspaper },
]

const businessNavItems = [
  { title: "Anúncios", url: "/ads", icon: DollarSign },
  { title: "Métricas", url: "/analytics", icon: BarChart3 },
]

const settingsNavItems = [
  { title: "Personalização", url: "/customization", icon: Palette },
  { title: "Configurações", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/60 transition-colors"
  }

  return (
    <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-card to-muted/20">
        {/* Logo Section */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            {state !== "collapsed" && (
              <div>
                <h2 className="font-bold text-lg text-foreground">Sports CMS</h2>
                <p className="text-xs text-muted-foreground">Clube Fictício FC</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Conteúdo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={getNavClassName(item.url)}>
                    <NavLink to={item.url} end={item.url === "/"}>
                      <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-primary' : 'text-muted-foreground'}`} />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Business Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Monetização
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={getNavClassName(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-primary' : 'text-muted-foreground'}`} />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={getNavClassName(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-primary' : 'text-muted-foreground'}`} />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}