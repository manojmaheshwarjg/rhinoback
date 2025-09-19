"use client"

import { Database, Forward, MoreHorizontal, Trash2, Folder } from "lucide-react"
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
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    status?: string
    tables?: number
    endpoints?: number
    lastActive?: string
  }[]
}) {
  const { open } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={!open ? item.name : undefined}
            >
              <a href={item.url} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 w-full">
                  <Folder className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.status && open && (
                    <Badge
                      variant="secondary"
                      className={`text-xs px-1.5 py-0.5 ml-auto shrink-0 ${
                        item.status === 'deployed' ? 'bg-green-100 text-green-700' :
                        item.status === 'building' ? 'bg-orange-100 text-orange-700' :
                        item.status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </Badge>
                  )}
                </div>
                {open && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground ml-6">
                    {typeof item.tables === "number" && (
                      <div className="flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        <span>{item.tables} tables</span>
                      </div>
                    )}
                    {typeof item.endpoints === "number" && (
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>{item.endpoints} endpoints</span>
                      </div>
                    )}
                  </div>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        
        {/* More button */}
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={!open ? "More projects" : undefined}
          >
            <MoreHorizontal className="h-4 w-4" />
            {open && <span>More</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
