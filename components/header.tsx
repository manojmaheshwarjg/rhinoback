import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Settings, User, LogOut, Zap, Plus, Bell, Search, GitBranch, Star, Eye, MessageSquare, Database } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppContext } from "@/lib/app-context"
import Link from "next/link"

export function Header() {
  const { state } = useAppContext()
  const { currentProject, projects } = state

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Logo, Sidebar trigger, Project info */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-600 hover:bg-gray-100 hover:text-gray-900" />
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">Rhinoback</h1>
              <span className="text-gray-400">/</span>
              {currentProject ? (
                <span className="text-lg font-semibold text-gray-900">{currentProject.name}</span>
              ) : (
                <span className="text-lg text-gray-500">New Project</span>
              )}
            </div>
          </div>
          
          {/* Platform Navigation */}
          <nav className="flex items-center gap-1 ml-6">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-gray-700 hover:bg-gray-100 font-medium"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat & Build
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-gray-700 hover:bg-gray-100 font-medium"
            >
              <Database className="mr-2 h-4 w-4" />
              Database Tools
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-3 text-gray-700 hover:bg-gray-100 font-medium"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>

          {/* Project status and stats */}
          <div className="flex items-center gap-2">
            {currentProject && (
              <>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    currentProject.status === 'deployed' ? 'bg-green-100 text-green-700 border-green-200' :
                    currentProject.status === 'building' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                    currentProject.status === 'error' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}
                >
                  {currentProject.status}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <GitBranch className="w-3 h-3" />
                  <span>{currentProject.schema?.length || 0} tables</span>
                </div>
              </>
            )}
            <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
              Beta
            </Badge>
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link href="/onboarding">
              <Button
                variant="outline"
                size="sm"
                className="h-9 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
            
            {currentProject && (
              <Button
                size="sm"
                className="h-9 bg-gray-900 hover:bg-gray-800 text-white"
              >
                <GitBranch className="mr-2 h-4 w-4" />
                Deploy
              </Button>
            )}
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 rounded-full hover:bg-gray-100"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback className="bg-gray-100 text-gray-700">DL</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">Dev Legend</p>
                <p className="text-xs text-gray-500">dev@rhinoback.com</p>
              </div>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Your profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" />
                <span>Your projects</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
