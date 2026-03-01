import { Home, Video, Radio, Users, Calendar, Newspaper, BarChart3, Layout, Megaphone, UserCheck, User, LogOut, ChevronDown, Tag, Folder, ChevronRight, MoreVertical, LayoutPanelTop, UserCircle, Trophy, Briefcase, MapPin, Scale, HelpCircle } from "lucide-react";
import teamLogo from "/assets/mosca.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { useGuestMode } from "@/hooks/useGuestMode";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
const mainNavItems = [{
  title: "Home",
  url: "/",
  icon: Home
}, {
  title: "Sports",
  icon: Trophy,
  items: [
    {
      title: "Teams",
      url: "/teams",
      icon: Users
    },
    {
      title: "Players",
      url: "/players",
      icon: User
    },
    {
      title: "Coaches",
      url: "/coaches",
      icon: Briefcase
    },
    {
      title: "Referees",
      url: "/referees",
      icon: Scale
    },
    {
      title: "Competitions",
      url: "/competitions",
      icon: Trophy
    },
    {
      title: "Seasons",
      url: "/seasons",
      icon: Calendar
    },
    {
      title: "Stadiums",
      url: "/stadiums",
      icon: MapPin
    }
  ]
}, {
  title: "Content",
  icon: Folder,
  items: [
    {
      title: "Videos (VOD)",
      url: "/videos",
      icon: Video
    },
    {
      title: "Lives",
      url: "/lives",
      icon: Radio
    },
    {
      title: "Collections",
      url: "/collections",
      icon: Tag
    },
    {
      title: "News",
      url: "/news",
      icon: Newspaper
    },
    {
      title: "Agenda",
      url: "/schedule",
      icon: Calendar
    }
  ]
},
{
  title: "Pages & Shelves",
  icon: LayoutPanelTop,
  items: [
    {
      title: "Banners",
      url: "/banners",
      icon: Megaphone
    },
    {
      title: "Shelves",
      url: "/shelves",
      icon: Layout
    },
    {
      title: "Pages",
      url: "/pages",
      icon: LayoutPanelTop
    }
  ]
},
{
  title: "Analytics",
  url: "/analytics",
  icon: BarChart3
}];
export function AppSidebar() {
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
    // Exact match or path with a slash after it to avoid matching similar paths
    return currentPath === path || currentPath.startsWith(path + "/");
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
    if (!user?.email) return "User";
    return user.email.split("@")[0];
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.substring(0, 2).toUpperCase();
  };
  return <Sidebar className="w-64">
      <SidebarContent className="bg-gradient-to-b from-card to-muted/20">
        {/* Logo Section */}
        <div className="px-4 pt-16 pb-[72px] border-b border-border/50 flex justify-center">
          <div className="flex items-center justify-center overflow-hidden w-full">
            <img src={teamLogo} alt="Logo do Clube" className="w-48 h-14 object-scale-down" />
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="py-4">
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
                              <span className="mx-[6px]">{item.title}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
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
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile Footer */}
        <SidebarFooter className="mt-auto border-t border-border/50">
          {/* Help & Support Micro Banner */}
          <div className="px-3 pt-4 pb-1">
            <NavLink to="/help" className="block">
              <div className={`rounded-xl border p-4 transition-colors cursor-pointer ${isActive("/help") ? "border-border bg-muted/40" : "border-border/50 bg-card hover:bg-muted/30"}`}>
                <HelpCircle className="h-5 w-5 text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">Need Help?</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Browse guides and answers to your questions.
                </p>
              </div>
            </NavLink>
          </div>
          <div className="border-t border-border/50 mx-4" />
          <div className="p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-foreground truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {isGuest ? "Modo visitante" : user?.email}
                    </p>
                  </div>
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>
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
