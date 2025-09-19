"use client"

import { useAppContext } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TableManagementModal } from "./table-management-modal"
import { TableSchema, DatabaseType } from "@/lib/app-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Download,
  Database,
  Settings,
  Code,
  Activity,
  Eye,
  Sparkles,
  ExternalLink,
  Layers,
  BarChart3,
} from "lucide-react"

export function SchemaPreview() {
  const { state, dispatch } = useAppContext()
  const { currentProject } = state

  const handleCreateTable = () => {
    const newTable: TableSchema = {
      id: `table_${Date.now()}`,
      name: `table_${(currentProject?.schema.length || 0) + 1}`,
      description: 'New table',
      fields: [
        {
          id: `field_${Date.now()}`,
          name: 'id',
          type: 'UUID',
          isPrimary: true,
          isRequired: true,
          isUnique: true,
          description: 'Primary key'
        }
      ],
      relationships: [],
      indexes: [{ name: `${`table_${(currentProject?.schema.length || 0) + 1}`}_pkey`, fields: ['id'], isUnique: true }],
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      estimatedRows: 0
    }
    
    const updatedSchema = [...(currentProject?.schema || []), newTable]
    dispatch({ type: 'UPDATE_SCHEMA', payload: updatedSchema })
  }

  const handleUpdateTable = (updatedTable: TableSchema) => {
    if (!currentProject) return
    const updatedSchema = currentProject.schema.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    )
    dispatch({ type: 'UPDATE_SCHEMA', payload: updatedSchema })
  }

  const handleDeleteTable = (tableId: string) => {
    if (!currentProject) return
    const updatedSchema = currentProject.schema.filter(table => table.id !== tableId)
    dispatch({ type: 'UPDATE_SCHEMA', payload: updatedSchema })
  }

  const handleDuplicateTable = (table: TableSchema) => {
    const duplicatedTable: TableSchema = {
      ...table,
      id: `table_${Date.now()}`,
      name: `${table.name}_copy`,
      fields: table.fields.map(field => ({
        ...field,
        id: `field_${Date.now()}_${field.name}`
      }))
    }
    
    const updatedSchema = [...(currentProject?.schema || []), duplicatedTable]
    dispatch({ type: 'UPDATE_SCHEMA', payload: updatedSchema })
  }

  const handleDatabaseChange = (dbType: DatabaseType) => {
    if (currentProject?.database) {
      dispatch({ 
        type: 'UPDATE_DATABASE', 
        payload: { ...currentProject.database, type: dbType } 
      })
    }
  }

  // Show empty state if no project
  if (!currentProject) {
    return (
      <div className="h-full w-full border-l border-border bg-white flex flex-col items-center justify-center min-h-0">
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <Database className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Ready to Build?</h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Start chatting with RhinoAI to generate your database schema and API endpoints. 
            Just describe what you want to build!
          </p>
          <div className="space-y-3 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left">
              <p className="text-sm font-medium text-gray-900 mb-1">💬 Example prompts:</p>
              <div className="space-y-1">
                <p className="text-xs text-gray-700">"Build a social media app with users and posts"</p>
                <p className="text-xs text-gray-700">"Create an e-commerce backend with products and orders"</p>
                <p className="text-xs text-gray-700">"I need a blog CMS with categories and tags"</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full border-l border-border bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="space-y-4">
          {/* Text Row */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 leading-tight">Database Schema</h1>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">Manage tables, fields, and relationships</p>
            </div>
          </div>
          
          {/* Buttons Row */}
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-700 border-green-200 px-2 py-1 text-xs"
            >
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white text-sm">
                  <Settings className="h-3 w-3 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Schema
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm">
                  <Code className="mr-2 h-4 w-4" />
                  Generate Code
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview API
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Schema Overview Card */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                      <Layers className="w-3 h-3 text-blue-600" />
                    </div>
                    Schema Overview
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Current database structure and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-blue-700">{currentProject.schema.length}</p>
                          <p className="text-xs font-medium text-blue-600 mt-1">Tables</p>
                        </div>
                        <div className="w-8 h-8 bg-blue-200 rounded-md flex items-center justify-center">
                          <Database className="w-4 h-4 text-blue-700" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-700">
                            {currentProject.schema.reduce((acc, table) => acc + table.fields.length, 0)}
                          </p>
                          <p className="text-xs font-medium text-green-600 mt-1">Fields</p>
                        </div>
                        <div className="w-8 h-8 bg-green-200 rounded-md flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-green-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {currentProject.database && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">Database</h4>
                        <Badge variant="outline" className="bg-white text-xs">
                          {currentProject.database.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                        {currentProject.database.reasoning}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Confidence:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          {Math.round(currentProject.database.confidence * 100)}%
                        </Badge>
                      </div>
                    </div>
                  )}

                  <TableManagementModal
                    tables={currentProject.schema}
                    databaseConfig={currentProject.database}
                    onUpdateTable={handleUpdateTable}
                    onDeleteTable={handleDeleteTable}
                    onDuplicateTable={handleDuplicateTable}
                    onCreateTable={handleCreateTable}
                    onDatabaseChange={handleDatabaseChange}
                  >
                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-sm">
                      <Settings className="w-3 h-3 mr-2" />
                      Manage Database
                    </Button>
                  </TableManagementModal>
              </CardContent>
            </Card>

              {/* AI Assistant Card */}
              <Card className="bg-white shadow-sm border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                    </div>
                    AI Assistant
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Get help with your database design
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3">
                      <h4 className="font-semibold text-purple-900 text-xs mb-2">Try these prompts:</h4>
                      <div className="space-y-1">
                        <div className="bg-white bg-opacity-60 rounded-md p-2 text-xs text-purple-800">
                          "Add user authentication to my schema"
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-md p-2 text-xs text-purple-800">
                          "Create relationships between my tables"
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-md p-2 text-xs text-purple-800">
                          "Optimize my database for performance"
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-md p-2 text-xs text-purple-800">
                          "Add indexes to frequently queried fields"
                        </div>
                      </div>
                    </div>
                  
                    {currentProject.schema.length > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-900 text-xs mb-3">Schema Analysis</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-700 font-medium text-xs">Primary Keys</span>
                            <Badge variant="outline" className="bg-white text-xs">
                              {currentProject.schema.filter(t => t.fields.some(f => f.isPrimary)).length}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between py-1 border-b border-gray-200">
                            <span className="text-gray-700 font-medium text-xs">Foreign Keys</span>
                            <Badge variant="outline" className="bg-white text-xs">
                              {currentProject.schema.reduce((acc, t) => acc + t.fields.filter(f => f.isForeignKey).length, 0)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between py-1">
                            <span className="text-gray-700 font-medium text-xs">Indexed Fields</span>
                            <Badge variant="outline" className="bg-white text-xs">
                              {currentProject.schema.reduce((acc, t) => acc + t.fields.filter(f => f.hasIndex).length, 0)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
