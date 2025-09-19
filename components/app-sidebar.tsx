"use client"

import type * as React from "react"
import { Folder, Zap, Rocket } from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Dev Legend",
    email: "dev@rhinoback.com",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "Rhinoback",
      logo: Rocket,
      plan: "Pro",
    },
    {
      name: "Personal",
      logo: Zap,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Social Media App",
      url: "#",
      icon: Folder,
      status: "building",
      tables: 5,
      endpoints: 12,
    },
    {
      name: "E-commerce API",
      url: "#",
      icon: Folder,
      status: "deployed",
      tables: 8,
      endpoints: 24,
    },
    {
      name: "Blog CMS",
      url: "#",
      icon: Folder,
      status: "draft",
      tables: 3,
      endpoints: 8,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
