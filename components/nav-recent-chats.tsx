"use client"

import { MessageSquare, Clock, MoreHorizontal, Trash2, Archive } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavRecentChats({
  recentChats,
}: {
  recentChats: {
    title: string
    timestamp: string
    messages: number
    project: string
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
      <SidebarMenu>
        {recentChats.map((chat, index) => (
          <SidebarMenuItem key={index}>
            <SidebarMenuButton asChild>
              <a
                href="#"
                className="flex flex-col gap-1 px-3 py-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md transition-colors"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MessageSquare className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <span className="font-medium text-xs tracking-tight truncate leading-tight">
                        {chat.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{chat.timestamp}</span>
                        </div>
                        <span>•</span>
                        <span>{chat.messages} messages</span>
                      </div>
                      <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 border-gray-200 w-fit">
                        {chat.project}
                      </Badge>
                    </div>
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <MessageSquare className="text-muted-foreground w-4 h-4" />
                  <span className="tracking-tight">Resume Chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="text-muted-foreground w-4 h-4" />
                  <span className="tracking-tight">Archive</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground w-4 h-4" />
                  <span className="tracking-tight">Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70 w-4 h-4" />
            <span className="tracking-tight">View all chats</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}