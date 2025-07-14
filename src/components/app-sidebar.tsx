import { Home, Video, Radio, Users, Calendar, Palette, Newspaper, DollarSign, BarChart3, Settings, Layout, Megaphone } from "lucide-react";
import teamLogo from "/lovable-uploads/736ea3c4-4ba8-4dd3-84ef-adbda2ce6750.png";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
const mainNavItems = [{
  title: "Dashboard",
  url: "/",
  icon: Home
}, {
  title: "Vídeos VOD",
  url: "/videos",
  icon: Video
}, {
  title: "Lives",
  url: "/lives",
  icon: Radio
}, {
  title: "Times & Elencos",
  url: "/teams",
  icon: Users
}, {
  title: "Agenda",
  url: "/schedule",
  icon: Calendar
}, {
  title: "Notícias",
  url: "/news",
  icon: Newspaper
}, {
  title: "Carrosséis",
  url: "/carousels",
  icon: Layout
}, {
  title: "Campanhas",
  url: "/campaigns",
  icon: Megaphone
}];
const businessNavItems = [{
  title: "Anúncios",
  url: "/ads",
  icon: DollarSign
}, {
  title: "Métricas",
  url: "/analytics",
  icon: BarChart3
}];
const settingsNavItems = [{
  title: "Personalização",
  url: "/customization",
  icon: Palette
}, {
  title: "Configurações",
  url: "/settings",
  icon: Settings
}];
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };
  const getNavClassName = (path: string) => {
    return isActive(path) ? "bg-primary text-white font-medium" : "hover:bg-muted/60 transition-colors";
  };
  return <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-card to-muted/20">
        {/* Logo Section */}
        <div className="px-6 pt-6 pb-3 border-b border-border/50 flex justify-center">
          <div className="flex items-center justify-center overflow-hidden">
            <img src={teamLogo} alt="Logo do Clube" className="w-36 h-36 object-scale-down" />
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Conteúdo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {mainNavItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`h-11 px-4 ${getNavClassName(item.url)}`}>
                    <NavLink to={item.url} end={item.url === "/"}>
                      <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-white' : 'text-muted-foreground'}`} />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Business Navigation */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Monetização
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {businessNavItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`h-11 px-4 ${getNavClassName(item.url)}`}>
                    <NavLink to={item.url}>
                      <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-white' : 'text-muted-foreground'}`} />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Navigation */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Sistema
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {settingsNavItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`h-11 px-4 ${getNavClassName(item.url)}`}>
                    <NavLink to={item.url}>
                      <item.icon className={`h-4 w-4 ${isActive(item.url) ? 'text-white' : 'text-muted-foreground'}`} />
                      {state !== "collapsed" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}