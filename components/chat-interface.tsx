"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Sparkles, Database, Code, Lightbulb } from "lucide-react"
import { useAppContext } from "@/lib/app-context"
import type { ChatMessage, Project, TableSchema, ApiEndpoint } from "@/lib/app-context"
import { analyzeEntities, generateTableSchema, generateDatabaseConfig } from "@/lib/schema-generator"

// Enhanced AI response with intelligent schema generation
function getContextualResponse(input: string, project: Project | null, messageCount: number) {
  // Analyze entities and relationships from user input
  const analysis = analyzeEntities(input)
  
  // Generate comprehensive database schema
  const generatedTables = analysis.entities.map(entity => 
    generateTableSchema(entity, analysis)
  )
  
  // Generate database configuration
  const databaseConfig = generateDatabaseConfig(analysis)
  
  // Create contextual response message
  const message = generateResponseMessage(analysis, input)
  
  return {
    message,
    metadata: { 
      tablesGenerated: generatedTables.length, 
      endpointsCreated: generatedTables.length * 4, // Rough estimate
      action: 'schema_update' as const 
    },
    schemaUpdate: generatedTables,
    databaseUpdate: databaseConfig
  }
}

function generateResponseMessage(analysis: any, input: string): string {
  const { entities, suggestedDatabase, reasoning, features } = analysis
  
  const dbEmojis = {
    postgresql: '🐘',
    mongodb: '🍃', 
    redis: '🚀',
    pinecone: '🌲',
    influxdb: '📊',
    elasticsearch: '🔍',
    mysql: '🐬',
    sqlite: '📁'
  }
  
  const emoji = dbEmojis[suggestedDatabase] || '💾'
  
  return `Perfect! I've analyzed your requirements and I'm building something amazing! ${emoji}

**Database Choice:** ${suggestedDatabase.toUpperCase()}
**Why?** ${reasoning}

**Generated Tables:** ${entities.join(', ')}
**Key Features:** ${features.join(', ')}

I've created a comprehensive schema with proper relationships, indexes, and field validations. Your backend is going to be rock solid! 🏗️`
}

// Enhanced AI schema generation is now handled by schema-generator.ts

export function ChatInterface() {
  const { state, dispatch } = useAppContext()
  const { chatMessages, isAiTyping, currentProject } = state
  const [input, setInput] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const isInitialized = useRef(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Initialize chat with welcome message and sample project if needed
  useEffect(() => {
    if (chatMessages.length === 0 && !isInitialized.current) {
      isInitialized.current = true
      
      // Create a sample project for demonstration if none exists
      if (!currentProject) {
        const sampleProject = {
          id: "sample-" + Date.now(),
          name: "Demo Project",
          description: "A sample project to showcase RhinoBack capabilities",
          status: "draft" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
          schema: [],
          endpoints: [],
          database: {
            type: "postgresql" as const,
          },
        }
        dispatch({ type: 'ADD_PROJECT', payload: sampleProject })
      }
      
      const welcomeMessage: ChatMessage = {
        id: "welcome-" + Date.now(),
        type: "ai",
        content: currentProject 
          ? `Welcome back! I'm ready to help you enhance "${currentProject.name}". What would you like to work on today?`
          : "Hey there! 👋 I'm RhinoAI, your backend building assistant. I can help you create database schemas and API endpoints just by chatting with me!\n\nTry something like:\n• \"Build a social media app with users and posts\"\n• \"Create an e-commerce backend\"\n• \"I need a blog CMS with authentication\"\n\nWhat would you like to build today?",
        timestamp: new Date(),
      }
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: welcomeMessage })
    }
  }, [chatMessages.length, currentProject, dispatch])
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [chatMessages, isAiTyping])

  const handleSend = async () => {
    if (!input.trim() || isAiTyping) return

    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    // Add user message
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage })
    setInput("")
    dispatch({ type: 'SET_AI_TYPING', payload: true })

    // TODO: Replace with actual AI API call
    // Simulate AI response with more intelligent responses
    setTimeout(() => {
      const responses = getContextualResponse(input.trim(), currentProject, chatMessages.length)
      
      const aiMessage: ChatMessage = {
        id: "ai-" + Date.now(),
        type: "ai",
        content: responses.message,
        timestamp: new Date(),
        metadata: responses.metadata,
      }
      
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage })
      dispatch({ type: 'SET_AI_TYPING', payload: false })
      
      // Update project schema/endpoints if AI generated them
      if (responses.schemaUpdate) {
        dispatch({ type: 'UPDATE_SCHEMA', payload: responses.schemaUpdate })
      }
      if (responses.endpointsUpdate) {
        dispatch({ type: 'UPDATE_ENDPOINTS', payload: responses.endpointsUpdate })
      }
      if (responses.databaseUpdate) {
        dispatch({ type: 'UPDATE_DATABASE', payload: responses.databaseUpdate })
      }
    }, Math.random() * 2000 + 1500) // Random delay between 1.5-3.5s
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  return (
    <div className="h-full flex flex-col w-full">
      <div className="flex-shrink-0 border-b border-border p-4 bg-background">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h2 className="font-semibold text-base">AI Chat Interface</h2>
              <p className="text-xs text-muted-foreground">Powered by RhinoAI</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
              Online
            </Badge>
            {currentProject && (
              <Badge variant="outline" className="text-xs">
                {currentProject.name}
              </Badge>
            )}
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <p className="text-sm text-gray-800 font-medium mb-1">Ready to build something amazing?</p>
          <p className="text-xs text-gray-600">Describe your backend requirements and I'll generate the perfect database schema and API endpoints for you.</p>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 min-h-0 w-full">
        <div className="px-4 py-4 w-full">
          <div className="space-y-4 w-full max-w-none">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex gap-4 w-full ${
                message.type === "ai" ? "" : ""
              }`}>
                <Avatar className="w-9 h-9 mt-1 flex-shrink-0">
                  <AvatarFallback
                    className={message.type === "ai" 
                      ? "bg-gray-100 text-gray-700 border border-gray-200" 
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                    }
                  >
                    {message.type === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 w-full space-y-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="font-semibold text-sm text-foreground">
                      {message.type === "ai" ? "RhinoAI" : "You"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div
                    className={`rounded-md border p-4 ${
                      message.type === "ai" 
                        ? "bg-gray-50 border-gray-200 text-gray-900" 
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <p className="text-sm leading-relaxed break-words m-0 whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                  {message.metadata && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {message.metadata.tablesGenerated && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                          <Database className="w-3 h-3 mr-1" />
                          {message.metadata.tablesGenerated} tables generated
                        </Badge>
                      )}
                      {message.metadata.endpointsCreated && (
                        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                          <Code className="w-3 h-3 mr-1" />
                          {message.metadata.endpointsCreated} endpoints created
                        </Badge>
                      )}
                      {message.metadata.action === 'schema_update' && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
                          <Lightbulb className="w-3 h-3 mr-1" />
                          Schema updated
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex gap-4 w-full">
                <Avatar className="w-9 h-9 mt-1 flex-shrink-0">
                  <AvatarFallback className="bg-gray-100 text-gray-700 border border-gray-200">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 w-full space-y-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="font-semibold text-sm text-foreground">RhinoAI</span>
                    <span className="text-xs text-muted-foreground">typing...</span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                      <span className="text-sm text-gray-700 animate-pulse">Building your backend magic...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="flex-shrink-0 border-t border-border p-4 bg-background">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Describe your backend idea... 'Build a social media app' or 'Create an e-commerce API'"
              className="min-h-[48px] max-h-[120px] resize-none pr-16 border-gray-300 rounded-lg shadow-sm focus:border-gray-500 focus:ring-gray-500 transition-all duration-200"
              maxLength={2000}
              disabled={isAiTyping}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1 rounded">
              {input.length}/2000
            </div>
          </div>
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isAiTyping} 
            className="self-end h-12 px-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 transition-colors duration-200"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">Press Enter to send, Shift+Enter for new line</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Powered by</span>
            <Sparkles className="w-3 h-3" />
            <span>RhinoAI</span>
          </div>
        </div>
      </div>
    </div>
  )
}
