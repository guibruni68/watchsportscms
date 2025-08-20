import { Home, Video, Radio, Users, Calendar, Palette, Newspaper, DollarSign, BarChart3, Settings, Layout, Megaphone, MonitorSpeaker, UserCheck, User, LogOut, ChevronDown, Tag, Folder, ChevronRight } from "lucide-react";
import teamLogo from "/lovable-uploads/736ea3c4-4ba8-4dd3-84ef-adbda2ce6750.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { useGuestMode } from "@/hooks/useGuestMode";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
const mainNavItems = [{
  title: "Dashboard",
  url: "/",
  icon: Home
}, {
  title: "Banners",
  url: "/banners",
  icon: MonitorSpeaker
}, {
  title: "Carrosséis",
  url: "/carousels",
  icon: Layout
}, {
  title: "Conteúdos",
  icon: Folder,
  items: [{
    title: "Vídeos (VOD)",
    url: "/videos",
    icon: Video
  }, {
    title: "Lives",
    url: "/lives",
    icon: Radio
  }, {
    title: "Catálogos",
    url: "/catalogues",
    icon: Tag
  }]
}, {
  title: "Notícias",
  url: "/news",
  icon: Newspaper
}, {
  title: "Times & Elencos",
  url: "/teams",
  icon: Users
}, {
  title: "Agenda",
  url: "/schedule",
  icon: Calendar
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
  const {
    isGuest,
    disableGuestMode
  } = useGuestMode();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);
  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };
  const getNavClassName = (path: string) => {
    return isActive(path) ? "bg-primary text-white font-medium" : "hover:bg-muted/60 transition-colors font-medium";
  };
  const getCollapsibleNavClassName = (items: any[]) => {
    const hasActiveChild = items.some(subItem => isActive(subItem.url));
    return hasActiveChild ? "bg-primary text-white font-medium" : "hover:bg-muted/60 transition-colors font-medium";
  };
  const handleGuestLogout = () => {
    disableGuestMode();
    toast({
      title: "Modo visitante finalizado",
      description: "Você saiu do modo visitante."
    });
    navigate("/auth");
  };
  return <Sidebar className={state === "collapsed" ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-card to-muted/20">
        {/* Logo Section */}
        <div className="px-6 pt-6 pb-3 border-b border-border/50 flex justify-center">
          <div className="flex items-center justify-center overflow-hidden">
            <img src={teamLogo} alt="Logo do Clube" className="w-40 h-40 object-scale-down" />
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Conteúdo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {mainNavItems.map(item => {
              if (item.items) {
                // Item com sub-itens
                return <Collapsible key={item.title} asChild defaultOpen={item.items.some(subItem => isActive(subItem.url))}>
                      <SidebarMenuItem>
                        <SidebarMenuButton className={`h-12 px-6 ${getCollapsibleNavClassName(item.items)}`}>
                          <CollapsibleTrigger className="w-full flex items-center justify-between">
                            <div className="flex items-center">
                              <item.icon className="h-4 w-4 text-muted-foreground mr-3" />
                              {state !== "collapsed" && <span className="mx-[6px]">{item.title}</span>}
                            </div>
                            {state !== "collapsed" && <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />}
                          </CollapsibleTrigger>
                        </SidebarMenuButton>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-2 space-y-2">
                            {item.items.map(subItem => <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild className={`h-10 px-4 ${getNavClassName(subItem.url)}`}>
                                  <NavLink to={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>)}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>;
              }

              // Item normal
              return <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={`h-12 px-6 ${getNavClassName(item.url!)}`}>
                      <NavLink to={item.url!} end={item.url === "/"}>
                        <item.icon className="h-4 w-4 text-muted-foreground mr-3" />
                        {state !== "collapsed" && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Business Navigation */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Monetização
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {businessNavItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`h-12 px-6 ${getNavClassName(item.url)}`}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4 text-muted-foreground mr-3" />
                      {state !== "collapsed" && <span>{item.title}</span>}
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
            <SidebarMenu className="space-y-3">
              {settingsNavItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`h-12 px-6 ${getNavClassName(item.url)}`}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4 text-muted-foreground mr-3" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}