import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { AreaChart, FileCode2, LayoutDashboard, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="API Blueprint">
                <Link href="/design">
                  <FileCode2 />
                  <span>API Blueprint</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="AI Policy Assistant">
                 <Link href="/policy-assistant">
                    <Sparkles />
                    <span>AI Policy Assistant</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="API Monitoring">
                 <Link href="/monitoring">
                    <AreaChart />
                    <span>API Monitoring</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <div className="mt-auto flex w-full flex-col gap-2 p-2">
           <Button variant="outline" asChild>
                <Link href="#">
                    <Avatar className="mr-2 h-6 w-6">
                        <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar" alt="User avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span>John Doe</span>
                </Link>
            </Button>
        </div>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                {/* Could add breadcrumbs here */}
            </div>
            <div>
                 <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5"/>
                 </Button>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
