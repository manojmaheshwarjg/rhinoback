"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, ArrowLeft, Globe, Shield, Users, FileText, Play, Code, Copy, ChevronDown, ChevronRight, Search, Upload, Heart, MessageCircle, Hash, Bell, Check, CheckCircle2, ExternalLink, Zap } from "lucide-react"

interface StepThreeProps {
  data: any
  onComplete: () => void
  onBack: () => void
}

export function StepThree({ data, onComplete, onBack }: StepThreeProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Authentication']))
  const [testData, setTestData] = useState<any>({})
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      POST: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      PUT: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      DELETE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      PATCH: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    }
    return colors[method] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const getGroupIcon = (groupName: string) => {
    const icons: Record<string, any> = {
      Authentication: Shield,
      Users: Users,
      Posts: FileText,
      Categories: Globe,
      Comments: MessageCircle,
      Tags: Hash,
      Media: Upload,
      Social: Heart,
      Notifications: Bell,
      Search: Search,
    }
    const Icon = icons[groupName] || Globe
    return <Icon className="h-4 w-4 text-[#107a4d]" />
  }

  const totalEndpoints = data.endpoints.reduce((acc: number, group: any) => acc + group.endpoints.length, 0)

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedGroups(newExpanded)
  }

  const selectEndpoint = (group: any, endpoint: any) => {
    setSelectedEndpoint({ ...endpoint, group: group.group })
    setTestData({})
    setResponse(null)
  }

  const simulateApiCall = async () => {
    setLoading(true)
    setResponse(null)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockResponse = generateMockResponse(selectedEndpoint)
    setResponse(mockResponse)
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateMockResponse = (endpoint: any) => {
    const { method, path } = endpoint
    
    if (method === 'GET') {
      if (path.includes('/users')) {
        return {
          status: 200,
          data: {
            id: 'user-123',
            email: 'john@example.com',
            username: 'johndoe',
            first_name: 'John',
            last_name: 'Doe',
            created_at: '2024-01-15T10:30:00Z'
          }
        }
      }
      if (path.includes('/posts')) {
        return {
          status: 200,
          data: [
            {
              id: 'post-456',
              title: 'Getting Started with React',
              content: 'React is a powerful library...',
              author: 'John Doe',
              created_at: '2024-01-15T14:30:00Z'
            }
          ],
          meta: { page: 1, limit: 20, total: 1 }
        }
      }
    }
    
    if (method === 'POST') {
      return {
        status: 201,
        data: {
          id: 'new-resource-789',
          message: 'Resource created successfully',
          created_at: new Date().toISOString()
        }
      }
    }
    
    if (method === 'PUT') {
      return {
        status: 200,
        data: {
          message: 'Resource updated successfully',
          updated_at: new Date().toISOString()
        }
      }
    }
    
    if (method === 'DELETE') {
      return {
        status: 204,
        message: 'Resource deleted successfully'
      }
    }
    
    return {
      status: 200,
      data: { message: 'Success' }
    }
  }

  const filteredEndpoints = data.endpoints.map((group: any) => ({
    ...group,
    endpoints: group.endpoints.filter((endpoint: any) => 
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.group.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((group: any) => group.endpoints.length > 0)

  useEffect(() => {
    if (!selectedEndpoint && data.endpoints.length > 0) {
      const authGroup = data.endpoints.find((group: any) => group.group === 'Authentication')
      if (authGroup && authGroup.endpoints.length > 0) {
        const loginEndpoint = authGroup.endpoints.find((ep: any) => ep.path === '/auth/login') || authGroup.endpoints[0]
        selectEndpoint(authGroup, loginEndpoint)
      } else {
        const firstGroup = data.endpoints[0]
        if (firstGroup && firstGroup.endpoints.length > 0) {
          selectEndpoint(firstGroup, firstGroup.endpoints[0])
        }
      }
    }
  }, [data.endpoints, selectedEndpoint])

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-6 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-[900px] mx-auto mb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#107a4d]/10 text-[#107a4d] text-xs font-medium mb-2">
          <Code className="w-3 h-3" />
          API Explorer
        </div>
        <h1 className="text-[28px] sm:text-[32px] md:text-[36px] font-normal leading-[1.2] text-[#1d1d1f]">
          Interactive API Explorer
        </h1>
        <div className="flex items-center justify-center gap-6 text-sm text-[#605A57]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#107a4d] animate-pulse"></div>
            <span>{totalEndpoints} endpoints</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#605A57]/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#107a4d] animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <span>{data.endpoints.length} API groups</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#605A57]/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#107a4d] animate-pulse" style={{ animationDelay: '300ms' }}></div>
            <span>REST API</span>
          </div>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="max-w-[1000px] mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-[#107a4d]/20 to-transparent"></div>
      </div>

      {/* Stats - Clean Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[900px] mx-auto">
        <div className="bg-white border-2 border-[rgba(55,50,47,0.08)] rounded-xl p-6 text-center transition-all duration-300 hover:border-[#107a4d]/30 hover:shadow-lg">
          <div className="text-2xl font-bold text-[#1d1d1f]">{totalEndpoints}</div>
          <div className="text-xs text-[#605A57] mt-2">Total Endpoints</div>
        </div>
        <div className="bg-white border-2 border-[rgba(55,50,47,0.08)] rounded-xl p-6 text-center transition-all duration-300 hover:border-[#107a4d]/30 hover:shadow-lg">
          <div className="text-2xl font-bold text-[#1d1d1f]">{data.endpoints.length}</div>
          <div className="text-xs text-[#605A57] mt-2">API Groups</div>
        </div>
        <div className="bg-white border-2 border-[rgba(55,50,47,0.08)] rounded-xl p-6 text-center transition-all duration-300 hover:border-[#107a4d]/30 hover:shadow-lg">
          <div className="text-2xl font-bold text-[#1d1d1f]">REST</div>
          <div className="text-xs text-[#605A57] mt-2">API Standard</div>
        </div>
        <div className="bg-white border-2 border-[rgba(55,50,47,0.08)] rounded-xl p-6 text-center transition-all duration-300 hover:border-[#107a4d]/30 hover:shadow-lg">
          <div className="text-2xl font-bold text-[#1d1d1f]">JSON</div>
          <div className="text-xs text-[#605A57] mt-2">Response Format</div>
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="max-w-[1000px] mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-[#107a4d]/20 to-transparent"></div>
      </div>

      {/* Section Header */}
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-base font-semibold text-[#1d1d1f]">Test Your API</h2>
          <p className="text-xs text-[#605A57]">Select an endpoint from the list and test it interactively</p>
        </div>
      </div>

      {/* Main Explorer Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1400px] mx-auto">
        {/* Left Sidebar - Endpoint List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border-2 border-[rgba(55,50,47,0.08)] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#605A57]" />
              <Input
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>
          
          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-2">
            {filteredEndpoints.map((group: any, groupIndex: number) => (
              <div key={groupIndex} className="bg-white border-2 border-[rgba(55,50,47,0.08)] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#107a4d]/30 hover:shadow-md">
                <button 
                  className="w-full p-4 cursor-pointer hover:bg-[#107a4d]/5 transition-colors flex items-center justify-between text-left"
                  onClick={() => toggleGroup(group.group)}
                >
                  <div className="flex items-center gap-3">
                    {expandedGroups.has(group.group) ? 
                      <ChevronDown className="h-4 w-4 text-[#107a4d]" /> : 
                      <ChevronRight className="h-4 w-4 text-[#605A57]" />
                    }
                    <div className="p-1.5 rounded-lg bg-[#107a4d]/10">
                      {getGroupIcon(group.group)}
                    </div>
                    <span className="font-semibold text-sm text-[#1d1d1f]">{group.group}</span>
                  </div>
                  <div className="px-2 py-1 rounded-full bg-[#107a4d]/10 text-[#107a4d] text-xs font-medium">
                    {group.endpoints.length}
                  </div>
                </button>
                
                {expandedGroups.has(group.group) && (
                  <div className="border-t border-[rgba(55,50,47,0.08)]">
                    {group.endpoints.map((endpoint: any, endpointIndex: number) => (
                      <button
                        key={endpointIndex}
                        className={`w-full p-4 cursor-pointer border-b border-[rgba(55,50,47,0.04)] last:border-b-0 transition-all duration-200 text-left ${
                          selectedEndpoint?.path === endpoint.path && selectedEndpoint?.method === endpoint.method
                            ? 'bg-gradient-to-r from-[#e8f5f0] to-[#d4ede4] border-l-4 border-l-[#107a4d]'
                            : 'hover:bg-[#107a4d]/5'
                        }`}
                        onClick={() => selectEndpoint(group, endpoint)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className={`text-xs font-mono ${getMethodColor(endpoint.method)}`}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-xs font-mono text-[#1d1d1f] font-medium">{endpoint.path}</code>
                          </div>
                          <div className="text-xs text-[#605A57] leading-relaxed">{endpoint.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - API Tester */}
        <div className="lg:col-span-8">
          {selectedEndpoint ? (
            <div className="bg-white border-2 border-[rgba(55,50,47,0.08)] rounded-xl p-6">
              <div className="space-y-6">
                {/* Endpoint Header - Enhanced */}
                <div className="space-y-4 pb-6 border-b border-[rgba(55,50,47,0.08)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={`font-mono ${getMethodColor(selectedEndpoint.method)}`}>
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="text-base font-mono font-semibold text-[#1d1d1f]">{selectedEndpoint.path}</code>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      {selectedEndpoint.group}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#605A57] leading-relaxed">{selectedEndpoint.description}</p>
                  
                  {/* Quick Info Pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="px-3 py-1 rounded-full bg-[#107a4d]/10 text-[#107a4d] text-xs font-medium">
                      ⚡ Auto-generated
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                      🔒 Authenticated
                    </div>
                    <div className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                      📊 JSON Response
                    </div>
                  </div>
                </div>

                {/* Request Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-[#107a4d] rounded-full"></div>
                    <h3 className="text-base font-semibold text-[#1d1d1f]">Test Configuration</h3>
                  </div>
                  
                  {/* URL Parameters */}
                  {selectedEndpoint.params && (
                    <div className="space-y-3 p-4 bg-[#107a4d]/5 rounded-lg border border-[#107a4d]/10">
                      <h4 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#107a4d]"></div>
                        URL Parameters
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(selectedEndpoint.params).map(([key, type]) => (
                          <div key={key} className="space-y-1.5">
                            <label className="text-xs font-medium text-[#605A57]">{key} <span className="text-[#107a4d]">*</span></label>
                            <Input 
                              placeholder={`Enter ${type as string}`}
                              onChange={(e) => setTestData({...testData, [key]: e.target.value})}
                              className="bg-white"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Body */}
                  {selectedEndpoint.body && selectedEndpoint.method !== 'GET' && (
                    <div className="space-y-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                      <h4 className="text-sm font-semibold text-[#1d1d1f] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        Request Body
                      </h4>
                      {selectedEndpoint.body === 'multipart/form-data' ? (
                        <div className="p-8 border-2 border-dashed border-blue-200 bg-white rounded-lg text-center hover:border-blue-400 transition-colors cursor-pointer">
                          <Upload className="h-10 w-10 mx-auto text-blue-500 mb-3" />
                          <p className="text-sm font-medium text-[#1d1d1f] mb-1">File upload endpoint</p>
                          <p className="text-xs text-[#605A57]">Drag and drop files or click to browse</p>
                        </div>
                      ) : (
                        <div className="relative">
                          <Textarea 
                            placeholder={JSON.stringify(selectedEndpoint.body, null, 2)}
                            className="font-mono text-xs bg-white border-blue-200"
                            rows={10}
                            onChange={(e) => setTestData({...testData, body: e.target.value})}
                          />
                          <div className="absolute top-2 right-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs"
                              onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.body, null, 2))}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Test Button - Enhanced */}
                  <div className="pt-2">
                    <Button 
                      onClick={simulateApiCall} 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#107a4d] to-[#0d6340] hover:from-[#0d6340] hover:to-[#107a4d] transition-all duration-300"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Send Test Request
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Response - Enhanced */}
                {response && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-green-600 rounded-full"></div>
                      <h3 className="text-base font-semibold text-[#1d1d1f]">Response</h3>
                    </div>
                    
                    {/* Response Header */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-[#1d1d1f]">Request Successful</p>
                          <p className="text-xs text-[#605A57]">Response time: ~1.2s</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={response.status < 300 ? 'default' : 'destructive'} className="text-xs font-mono">
                          {response.status} {response.status < 300 ? 'OK' : 'ERROR'}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8"
                          onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 mr-1 text-green-600" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Response Body */}
                    <div className="relative">
                      <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-5 rounded-b-lg overflow-auto text-xs font-mono border border-t-0 border-green-200 max-h-[400px]">
                        <code>{JSON.stringify(response, null, 2)}</code>
                      </pre>
                      <div className="absolute top-3 right-3">
                        <div className="px-2 py-1 rounded bg-black/20 text-white text-[10px] font-mono">
                          JSON
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#f8fffe] to-[#f0f9f6] border-2 border-[#107a4d]/20 rounded-xl p-12 text-center h-full flex items-center justify-center">
              <div className="space-y-6 max-w-2xl">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-[#107a4d] to-[#0d6340] rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-lg">
                    <Code className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[#1d1d1f]">Ready to Test Your API</h3>
                  <p className="text-sm text-[#605A57] max-w-md mx-auto leading-relaxed">
                    Select an endpoint from the sidebar to start testing. All endpoints are auto-generated and ready to use.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-left mt-8">
                  <div className="p-4 bg-white rounded-lg border border-[#107a4d]/10 space-y-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-lg">✓</span>
                      </div>
                      <h4 className="font-semibold text-green-700">CRUD Operations</h4>
                    </div>
                    <p className="text-xs text-[#605A57] leading-relaxed">Complete Create, Read, Update, Delete for all tables</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#107a4d]/10 space-y-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-lg">🔒</span>
                      </div>
                      <h4 className="font-semibold text-blue-700">Authentication</h4>
                    </div>
                    <p className="text-xs text-[#605A57] leading-relaxed">Login, register, logout, password reset</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#107a4d]/10 space-y-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-lg">📁</span>
                      </div>
                      <h4 className="font-semibold text-purple-700">File Uploads</h4>
                    </div>
                    <p className="text-xs text-[#605A57] leading-relaxed">Avatar, post images, general media</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-[#107a4d]/10 space-y-2 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-lg">⚡</span>
                      </div>
                      <h4 className="font-semibold text-orange-700">Business Logic</h4>
                    </div>
                    <p className="text-xs text-[#605A57] leading-relaxed">Social features, notifications, search</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Divider */}
      <div className="max-w-[1000px] mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-[#107a4d]/20 to-transparent"></div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center items-center gap-4 pt-8 max-w-[800px] mx-auto">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
        >
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Back
        </button>
        <Button 
          onClick={onComplete} 
          size="lg" 
          className="px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl transition-all hover:scale-105 text-base font-semibold"
        >
          View System Architecture
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
