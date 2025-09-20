"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Rocket, 
  ExternalLink, 
  Copy, 
  Check, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Globe,
  Settings,
  Database
} from "lucide-react"
import { useAppContext } from "@/lib/app-context"

interface DeploymentModalProps {
  children: React.ReactNode
}

interface DeploymentResult {
  success: boolean
  deploymentUrl?: string
  deploymentId?: string
  status: 'deploying' | 'deployed' | 'failed'
  logs?: string[]
  error?: string
}

export function DeploymentModal({ children }: DeploymentModalProps) {
  const { state } = useAppContext()
  const { currentProject } = state
  
  const [isOpen, setIsOpen] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false)
  
  // Form state
  const [platform, setPlatform] = useState<string>('vercel')
  const [environment, setEnvironment] = useState<string>('production')
  const [envVariables, setEnvVariables] = useState<Record<string, string>>({
    NODE_ENV: 'production',
    PORT: '3000'
  })

  const [currentLog, setCurrentLog] = useState<string[]>([])

  const platforms = [
    {
      id: 'vercel',
      name: 'Vercel',
      description: 'Deploy to Vercel with automatic HTTPS and global CDN',
      icon: '▲',
      color: 'bg-black text-white'
    },
    {
      id: 'railway',
      name: 'Railway',
      description: 'Deploy to Railway with built-in database hosting',
      icon: '🚂',
      color: 'bg-purple-600 text-white'
    },
    {
      id: 'render',
      name: 'Render',
      description: 'Deploy to Render with automatic SSL and global CDN',
      icon: '🎨',
      color: 'bg-green-600 text-white'
    },
    {
      id: 'heroku',
      name: 'Heroku',
      description: 'Deploy to Heroku with add-on ecosystem',
      icon: '⚡',
      color: 'bg-purple-700 text-white'
    }
  ]

  const handleDeploy = async () => {
    if (!currentProject) return

    setIsDeploying(true)
    setCurrentLog([])
    setDeploymentResult(null)

    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: currentProject,
          platform,
          environment,
          envVariables,
        }),
      })

      const data = await response.json()
      
      if (data.logs) {
        // Simulate streaming logs
        for (let i = 0; i < data.logs.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))
          setCurrentLog(prev => [...prev, data.logs[i]])
        }
      }
      
      setDeploymentResult(data)
    } catch (error) {
      console.error('Deployment failed:', error)
      setDeploymentResult({
        success: false,
        status: 'failed',
        error: 'Failed to start deployment'
      })
    } finally {
      setIsDeploying(false)
    }
  }

  const handleCopyUrl = async () => {
    if (deploymentResult?.deploymentUrl) {
      try {
        await navigator.clipboard.writeText(deploymentResult.deploymentUrl)
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
      } catch (error) {
        console.error('Failed to copy URL:', error)
      }
    }
  }

  const addEnvVariable = () => {
    const key = `NEW_VAR_${Object.keys(envVariables).length + 1}`
    setEnvVariables(prev => ({ ...prev, [key]: '' }))
  }

  const updateEnvVariable = (oldKey: string, newKey: string, value: string) => {
    setEnvVariables(prev => {
      const updated = { ...prev }
      delete updated[oldKey]
      updated[newKey] = value
      return updated
    })
  }

  const removeEnvVariable = (key: string) => {
    setEnvVariables(prev => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })
  }

  const resetModal = () => {
    setDeploymentResult(null)
    setCurrentLog([])
    setCopiedUrl(false)
  }

  const selectedPlatform = platforms.find(p => p.id === platform)

  if (!currentProject) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Project Selected</DialogTitle>
            <DialogDescription>
              Please create or select a project first to deploy.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) resetModal()
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Deploy to Cloud
          </DialogTitle>
          <DialogDescription>
            Deploy your backend to the cloud with one click. Choose your platform and configure deployment settings.
          </DialogDescription>
        </DialogHeader>

        {!deploymentResult && !isDeploying ? (
          // Configuration Form
          <div className="space-y-6 py-4">
            <Tabs defaultValue="platform" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="platform">Platform</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="environment">Environment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="platform" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {platforms.map((p) => (
                    <div
                      key={p.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        platform === p.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPlatform(p.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${p.color}`}>
                          {p.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{p.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{p.description}</p>
                        </div>
                        {platform === p.id && (
                          <CheckCircle2 className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="config" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Environment</Label>
                    <Select value={environment} onValueChange={setEnvironment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Selected Platform</Label>
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                      <span className="text-lg">{selectedPlatform?.icon}</span>
                      <span className="font-medium text-sm">{selectedPlatform?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">Deployment Summary</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Project:</strong> {currentProject.name}</p>
                    <p><strong>Tables:</strong> {currentProject.schema.length}</p>
                    <p><strong>Database:</strong> {currentProject.database.type}</p>
                    <p><strong>Platform:</strong> {selectedPlatform?.name}</p>
                    <p><strong>Environment:</strong> {environment}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="environment" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">Environment Variables</h4>
                  <Button variant="outline" size="sm" onClick={addEnvVariable}>
                    <Settings className="w-4 h-4 mr-2" />
                    Add Variable
                  </Button>
                </div>
                
                <ScrollArea className="h-48 w-full border rounded-md p-4">
                  <div className="space-y-3">
                    {Object.entries(envVariables).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Input
                          placeholder="Variable name"
                          value={key}
                          onChange={(e) => updateEnvVariable(key, e.target.value, value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={value}
                          onChange={(e) => updateEnvVariable(key, key, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEnvVariable(key)}
                          className="text-red-600 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          // Deployment Progress/Results
          <div className="space-y-4 py-4">
            {isDeploying && (
              <div className="flex items-center justify-center gap-3 p-6">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <div className="text-center">
                  <h3 className="font-semibold">Deploying to {selectedPlatform?.name}</h3>
                  <p className="text-sm text-gray-600">This may take a few minutes...</p>
                </div>
              </div>
            )}

            {/* Live Logs */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <h4 className="font-semibold text-sm">Deployment Logs</h4>
              </div>
              <ScrollArea className="h-64 w-full border rounded-md bg-black text-green-400">
                <div className="p-4 font-mono text-xs">
                  {currentLog.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))}
                  {isDeploying && (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Results */}
            {deploymentResult && (
              <div className="space-y-4">
                {deploymentResult.success ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Deployment Successful!</h4>
                    </div>
                    <p className="text-sm text-green-800 mb-3">
                      Your backend is now live and accessible at:
                    </p>
                    <div className="flex items-center gap-2 p-2 bg-white border border-green-300 rounded-md">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span className="flex-1 font-mono text-sm">{deploymentResult.deploymentUrl}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyUrl}
                      >
                        {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(deploymentResult.deploymentUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h4 className="font-semibold text-red-900">Deployment Failed</h4>
                    </div>
                    <p className="text-sm text-red-800">
                      {deploymentResult.error || 'An error occurred during deployment'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!deploymentResult && !isDeploying ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDeploy} 
                disabled={currentProject.schema.length === 0}
                className="flex items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Deploy to {selectedPlatform?.name}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {deploymentResult && (
                <Button variant="outline" onClick={resetModal}>
                  Deploy Again
                </Button>
              )}
              <Button onClick={() => setIsOpen(false)}>
                {deploymentResult ? 'Done' : 'Close'}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}