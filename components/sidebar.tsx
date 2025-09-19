import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Database, MessageSquare, Plus, History, Folder, Code, Settings } from "lucide-react"

export function Sidebar() {
  const projects = [
    { name: "My sick app", status: "building", tables: 5 },
    { name: "Side hustle API", status: "deployed", tables: 3 },
    { name: "Weekend project", status: "draft", tables: 0 },
  ]

  const recentChats = [
    "Build me a social app backend",
    "Add payment processing vibes",
    "Need user auth that slaps",
    "E-commerce but make it fast",
  ]

  return (
    <div className="w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <Button className="w-full justify-start gap-2" size="sm">
          <Plus className="w-4 h-4" />
          Start something fresh
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-sidebar-foreground mb-3 flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Your projects
            </h3>
            <div className="space-y-2">
              {projects.map((project, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-sidebar-accent-foreground">{project.name}</span>
                    <Badge variant={project.status === "deployed" ? "default" : "secondary"} className="text-xs">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Database className="w-3 h-3" />
                    {project.tables} tables
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-sidebar-foreground mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              Recent convos
            </h3>
            <div className="space-y-1">
              {recentChats.map((chat, i) => (
                <div key={i} className="p-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-3 h-3 mt-0.5 text-muted-foreground" />
                    <span className="text-xs text-sidebar-accent-foreground line-clamp-2">{chat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Code className="w-4 h-4" />
            API docs
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
