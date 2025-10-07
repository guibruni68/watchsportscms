import { Home, Video, Radio, Users, Calendar, Palette, Newspaper, DollarSign, BarChart3, Settings, Layout, Megaphone, MonitorSpeaker, UserCheck, User, LogOut, ChevronDown, Tag, Folder, ChevronRight, MoreVertical } from "lucide-react";
import teamLogo from "/lovable-uploads/736ea3c4-4ba8-4dd3-84ef-adbda2ce6750.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";
import { useGuestMode } from "@/hooks/useGuestMode";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
const mainNavItems = [{
  title: "Dashboard",
  url: "/",
  icon: Home
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
  title: "Banners",
  url: "/banners",
  icon: MonitorSpeaker
}, {
  title: "Carrosséis",
  url: "/carousels",
  icon: Layout
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
  const { user, signOut } = useAuth();
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
  const getSubNavClassName = (path: string) => {
    return isActive(path) ? "bg-muted/50 font-bold transition-colors" : "hover:bg-muted/60 transition-colors font-medium";
  };
  const handleSignOut = async () => {
    if (isGuest) {
      disableGuestMode();
      toast({
        title: "Modo visitante finalizado",
        description: "Você saiu do modo visitante."
      });
    } else {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta."
      });
    }
    navigate("/auth");
  };

  const getUserDisplayName = () => {
    if (isGuest) return "Visitante";
    if (!user?.email) return "Usuário";
    return user.email.split("@")[0];
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.substring(0, 2).toUpperCase();
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
                                <SidebarMenuSubButton asChild className={`h-10 px-4 ${getSubNavClassName(subItem.url)}`}>
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

        {/* User Profile Footer */}
        <SidebarFooter className="mt-auto border-t border-border/50">
          <div className="p-4">
            <DropdownMenu>
              <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                <Avatar className="h-10 w-10 border-2 border-border">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {state !== "collapsed" && (
                  <>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-foreground truncate">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {isGuest ? "Modo visitante" : user?.email}
                      </p>
                    </div>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                  </>
                )}
              </div>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>;
}