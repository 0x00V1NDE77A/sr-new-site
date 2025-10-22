'use client';
 
import * as React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
 
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
} from '@/components/animate-ui/radix/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AudioWaveform,
  BadgeCheck,
  Bell,
  BookOpen,
  Bot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  FileText,
  Folder,
  Forward,
  Frame,
  GalleryVerticalEnd,
  HelpCircle,
  LogOut,
  Map,
  MessageSquare,
  MoreHorizontal,
  Phone,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
  Edit3,
  List,
  Tag,
  FolderOpen,
  BarChart3,
  Users,
  Shield,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { BlogStats } from './blog-stats';
 
const DATA = {
  user: {
    name: 'Admin',
    email: 'admin@srholding.org',
    avatar:
      'https://pbs.twimg.com/profile_images/1909615404789506048/MTqvRsjo_400x400.jpg',
  },
  teams: [
    {
      name: 'SR Holding',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    }
  ],
  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: BarChart3,
      isActive: false,
    },
    {
      title: 'Blog Management',
      url: '/admin/blog',
      icon: FileText,
      isActive: true,
      items: [
        {
          title: 'All Blogs',
          url: '/admin/blog',
          icon: List,
        },
        {
          title: 'Create New Blog',
          url: '/admin/blog/new',
          icon: Edit3,
        },
        {
          title: 'Categories',
          url: '/admin/blog/categories',
          icon: FolderOpen,
        },
        {
          title: 'Tags',
          url: '/admin/blog/tags',
          icon: Tag,
        },
      ],
    },
    {
      title: 'Contact Management',
      url: '/admin/contacts',
      icon: MessageSquare,
      isActive: false,
      items: [
        {
          title: 'Contact Submissions',
          url: '/admin/contacts',
          icon: MessageSquare,
        },
        {
          title: 'Contact Details',
          url: '/admin/contact-details',
          icon: Phone,
        },
      ],
    },
    {
      title: 'FAQ Management',
      url: '/admin/faqs',
      icon: HelpCircle,
      isActive: false,
    },
    {
      title: 'Admin Logs',
      url: '/admin/admin-logs',
      icon: Shield,
      isActive: false,
      items: [
        {
          title: 'Activity Logs',
          url: '/admin/admin-logs',
          icon: Shield,
        },
      ],
    },
    {
      title: 'Settings',
      url: '/admin/settings/change-password',
      icon: Settings2,
      isActive: false,
      items: [
        {
          title: 'Change Password',
          url: '/admin/settings/change-password',
          icon: Shield,
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};
 
export const RadixSidebarDemo = ({ children }: { children?: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [activeTeam, setActiveTeam] = React.useState(DATA.teams[0]);
  const [activeSection, setActiveSection] = React.useState('Blog');
  const [activeSubSection, setActiveSubSection] = React.useState('View Blog');

  const handleLogout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      
      // First try to sign out with NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: '/'
      });
      
      console.log('✅ NextAuth signOut completed');
      
      // Force redirect to home page
      router.push('/');
      
      // Also try to clear any local storage or cookies if needed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin-session');
        sessionStorage.clear();
      }
      
      console.log('✅ Logout completed successfully');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Fallback: force redirect even if signOut fails
      try {
        router.push('/');
      } catch (redirectError) {
        console.error('❌ Redirect error:', redirectError);
        // Last resort: window.location
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    }
  };

  if (!activeTeam) return null;
 
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          {/* Team Switcher */}
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    tooltip={activeTeam.name}
                  >
                    <div className="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
                      <activeTeam.logo className="size-4" />
                    </div>
                    <div className="grid flex-1 text-sm leading-tight text-left group-data-[collapsible=icon]:hidden">
                      <span className="font-semibold truncate">
                        {activeTeam.name}
                      </span>
                      <span className="text-xs truncate">
                        {activeTeam.plan}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                {/* <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side={isMobile ? 'bottom' : 'right'}
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Teams
                  </DropdownMenuLabel>
                  {DATA.teams.map((team, index) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => setActiveTeam(team)}
                      className="gap-2 p-2"
                    >
                      <div className="flex items-center justify-center border rounded-sm size-6">
                        <team.logo className="size-4 shrink-0" />
                      </div>
                      {team.name}
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex items-center justify-center border rounded-md size-6 bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Add team
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent> */}
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* Team Switcher */}
        </SidebarHeader>
 
        <SidebarContent>
          {/* Nav Main */}
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Platform</SidebarGroupLabel>
            <SidebarMenu>
              {DATA.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        onClick={() => setActiveSection(item.title)}
                        asChild
                      >
                        <Link href={item.url}>
                          {item.icon && <item.icon />}
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                        </Link>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link 
                                href={subItem.url}
                                onClick={() => setActiveSubSection(subItem.title)}
                                className="flex items-center gap-2"
                              >
                                {subItem.icon && <subItem.icon className="w-4 h-4" />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
                    {/* Nav Main */}

          {/* Quick Actions */}
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Quick Actions</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin/blog/new" className="group-data-[collapsible=icon]:hidden">
                    <Plus className="w-4 h-4" />
                    <span>Create New Blog</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          {/* Quick Actions */}

          {/* Logout Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Account</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          {/* Logout Section */}

          {/* Quick Stats */}
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Quick Stats</SidebarGroupLabel>
            <SidebarMenu>
              <div className="group-data-[collapsible=icon]:hidden">
                <BlogStats />
              </div>
            </SidebarMenu>
          </SidebarGroup>
          {/* Quick Stats */}

        </SidebarContent>
        <SidebarFooter>
          {/* Nav User */}
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    tooltip={DATA.user.name}
                  >
                    <Avatar className="w-8 h-8 rounded-lg">
                      <AvatarImage
                        src={DATA.user.avatar}
                        alt={DATA.user.name}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-sm leading-tight text-left group-data-[collapsible=icon]:hidden">
                      <span className="font-semibold truncate">
                        {DATA.user.name}
                      </span>
                      <span className="text-xs truncate">
                        {DATA.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="w-8 h-8 rounded-lg">
                        <AvatarImage
                          src={DATA.user.avatar}
                          alt={DATA.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-sm leading-tight text-left">
                        <span className="font-semibold truncate">
                          {DATA.user.name}
                        </span>
                        <span className="text-xs truncate">
                          {DATA.user.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
          {/* Nav User */}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
 
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 mr-2" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    {activeSection}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{activeSubSection}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">
          {children || (
            <>
              <div className="grid gap-4 auto-rows-min md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};