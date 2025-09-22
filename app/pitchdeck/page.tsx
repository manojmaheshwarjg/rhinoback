"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowRight, 
  ArrowLeft,
  Clock, 
  DollarSign, 
  Users, 
  Zap, 
  Database, 
  Rocket, 
  Target, 
  TrendingUp,
  Code,
  Globe,
  Shield,
  Gauge,
  CheckCircle,
  XCircle,
  Star,
  Mail,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useState, useEffect } from "react"
import { GridPattern } from "@/components/ui/shadcn-io/grid-pattern"

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    { id: 'hero', title: 'RHINOBACK' },
    { id: 'problem', title: 'The Problem' },
    { id: 'solution', title: 'How It Works' },
    { id: 'comparison', title: 'Why RhinoBack' },
    { id: 'demo', title: 'Product Demo' },
    { id: 'market', title: 'Market Opportunity' },
    { id: 'pricing', title: 'Pricing Strategy' },
    { id: 'competition', title: 'Competition' },
    { id: 'funding', title: 'Funding & Ask' }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === ' ') {
        nextSlide()
      } else if (event.key === 'ArrowLeft') {
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const renderSlide = () => {
    switch (slides[currentSlide].id) {
      case 'hero':
        return (
          <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-4">
            <Badge className="mb-4 sm:mb-6 bg-gray-100 text-gray-800 border-gray-300 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium">
              The Backend Platform of the Future
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 tighter-tracking">
              <em>RHINOBACK</em>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 text-gray-700 font-medium leading-tight px-2">
              Backends in <span className="text-gray-900 font-bold">Seconds</span>, Not <span className="text-gray-500 font-bold line-through">Sprints</span>
            </p>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              <em>Describe your app in natural language. Get a production-ready backend with AI-optimized database architecture in minutes.</em>
            </p>
            
            {/* Demo CTA */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-sm sm:text-base"
                onClick={() => window.open('https://rhinoback.manoj.ai/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
          </div>
        )
      
      case 'problem':
        return (
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col justify-center min-h-full">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight tighter-tracking">
                Backend Development is<br className="sm:hidden" /> <span className="text-gray-900 underline decoration-2">Painfully Broken</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
                Modern development teams waste months on infrastructure instead of building features that matter.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="text-center pb-3">
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-2 mx-auto" />
                  <CardTitle className="text-base sm:text-lg text-gray-900">Time Sink</CardTitle>
                  <CardDescription className="text-xs sm:text-sm px-2">Teams waste 40-60% of development time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Authentication:</span>
                      <span className="text-gray-900 font-semibold">2-3 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Database setup:</span>
                      <span className="text-gray-900 font-semibold">1-2 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">API endpoints:</span>
                      <span className="text-gray-900 font-semibold">3-4 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Deployment:</span>
                      <span className="text-gray-900 font-semibold">1-2 weeks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="text-center pb-3">
                  <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-2 mx-auto" />
                  <CardTitle className="text-base sm:text-lg text-gray-900">Cost Drain</CardTitle>
                  <CardDescription className="text-xs sm:text-sm px-2">$150K+ developers building CRUD</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-dm-serif">$150K+</div>
                  <p className="text-gray-700 text-xs sm:text-sm px-1">Average senior developer salary building repetitive infrastructure</p>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="text-center pb-3">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-700 mb-2 mx-auto" />
                  <CardTitle className="text-base sm:text-lg text-gray-900">Innovation Killer</CardTitle>
                  <CardDescription className="text-xs sm:text-sm px-2">Building auth instead of features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p><em>"I just want to store user data, why is this so hard?"</em></p>
                    <p><em>"Another day setting up authentication... again"</em></p>
                    <p><em>"Which database should I use?"</em></p>
                    <p><em>"My app needs to scale but I'm locked in"</em></p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'solution':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center min-h-full">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tight-tracking">
                <span className="text-gray-900">Describe Your App.</span>
                <br />
                <span className="text-gray-700">Get a Production Backend.</span>
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Natural language to complete backend infrastructure in minutes
              </p>
              <Badge className="mt-4 bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 text-sm">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Architecture Generation
              </Badge>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6 sm:space-y-8">
                {/* Step 1 */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tight-tracking">Describe Your App</h4>
                    <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
                      Simply tell us what you want to build in plain English
                    </p>
                    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-300">
                      <p className="text-xs sm:text-sm text-gray-600 italic">
                        "Build me an e-commerce platform with user accounts, product catalog, shopping cart, payments, and admin dashboard"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-100 rounded-2xl border border-gray-300">
                  <div className="bg-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tight-tracking">AI Analysis & Planning</h4>
                    <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
                      Our AI analyzes requirements and selects optimal technologies
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 bg-white p-2 rounded border">
                        <Database className="w-4 h-4 text-gray-700" />
                        <span>User management → PostgreSQL</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded border">
                        <Zap className="w-4 h-4 text-gray-700" />
                        <span>Real-time features → Redis</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded border">
                        <Target className="w-4 h-4 text-gray-700" />
                        <span>Search → Elasticsearch</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white p-2 rounded border">
                        <Shield className="w-4 h-4 text-gray-700" />
                        <span>Payments → Stripe</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="bg-gray-900 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 tight-tracking">Instant Generation</h4>
                    <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed">
                      Complete backend infrastructure generated in seconds
                    </p>
                    <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-300">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-gray-200 text-gray-800 text-xs px-2 py-1">Database Schemas</Badge>
                        <Badge className="bg-gray-200 text-gray-800 text-xs px-2 py-1">REST APIs</Badge>
                        <Badge className="bg-gray-200 text-gray-800 text-xs px-2 py-1">Authentication</Badge>
                        <Badge className="bg-gray-200 text-gray-800 text-xs px-2 py-1">Security</Badge>
                        <Badge className="bg-gray-200 text-gray-800 text-xs px-2 py-1">Deployment</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result */}
                <div className="text-center p-6 sm:p-8 bg-gray-100 rounded-2xl border border-gray-300">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <Rocket className="w-6 h-6 text-gray-700" />
                    <span className="text-lg sm:text-xl font-bold text-gray-900 tight-tracking">Production Ready in Minutes</span>
                    <Rocket className="w-6 h-6 text-gray-700" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">
                    Your backend is automatically deployed, documented, and ready to integrate with your frontend
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'comparison':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center min-h-full">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tight-tracking">
                Why <span className="text-gray-900 underline decoration-2">RhinoBack</span> Wins
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                See how RhinoBack revolutionizes backend development compared to traditional approaches
              </p>
              <Badge className="mt-4 bg-gray-100 text-gray-800 border border-gray-300 px-4 py-2 text-sm">
                <Clock className="w-4 h-4 mr-2" />
                100x Faster Development
              </Badge>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Traditional Development */}
              <Card className="bg-gray-50 border-2 border-gray-300 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl text-gray-800 font-dm-serif tight-tracking">Traditional Development</CardTitle>
                      <p className="text-sm text-gray-600 font-medium">2-6 months of pain</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-300">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-700 font-bold text-sm">1-2</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Requirements & Planning</div>
                        <div className="text-gray-600">Weeks of meetings and documentation</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-300">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-700 font-bold text-sm">3-4</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Database Design</div>
                        <div className="text-gray-600">Schema design, migrations, relationships</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-300">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-700 font-bold text-sm">5-8</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">API Development</div>
                        <div className="text-gray-600">REST endpoints, validation, testing</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-300">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-700 font-bold text-sm">9-12</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Auth & Security</div>
                        <div className="text-gray-600">JWT, RBAC, password policies</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-300">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-700 font-bold text-sm">13-16</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">Testing & Deployment</div>
                        <div className="text-gray-600">CI/CD, monitoring, scaling</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-200 rounded-lg p-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800 mb-2 font-dm-serif">16+ Weeks</div>
                      <div className="text-sm text-gray-600 font-medium">Just to get started</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* RhinoBack Development */}
              <Card className="bg-gray-100 border-2 border-gray-400 shadow-lg relative">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-1 text-sm">
                  The Future
                </Badge>
                <CardHeader className="pb-4 pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl text-gray-900 font-dm-serif tight-tracking">RhinoBack Development</CardTitle>
                      <p className="text-sm text-gray-700 font-medium">5-30 minutes total</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-300 shadow-sm">
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-bold text-gray-900 mb-1">Describe Your App</div>
                        <div className="text-gray-600">"Build me an e-commerce platform..."</div>
                        <Badge className="mt-2 bg-gray-200 text-gray-800 text-xs px-2 py-1">1-5 minutes</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-300 shadow-sm">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-bold text-gray-900 mb-1">AI Generates Everything</div>
                        <div className="text-gray-600">Database, APIs, auth, deployment</div>
                        <Badge className="mt-2 bg-gray-200 text-gray-800 text-xs px-2 py-1">5-15 minutes</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-300 shadow-sm">
                      <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <div className="text-sm">
                        <div className="font-bold text-gray-900 mb-1">Production Ready</div>
                        <div className="text-gray-600">Review, refine, and you're live!</div>
                        <Badge className="mt-2 bg-gray-200 text-gray-800 text-xs px-2 py-1">15-30 minutes</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-200 rounded-lg p-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-2 font-dm-serif">30 Minutes</div>
                      <div className="text-sm text-gray-700 font-medium">From idea to production</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Bottom comparison summary */}
            <div className="mt-8 sm:mt-12 bg-gray-100 rounded-2xl p-6 sm:p-8 border border-gray-300 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <Clock className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-2 font-dm-serif tight-tracking">100x Faster</div>
                  <div className="text-sm text-gray-600">Minutes instead of months</div>
                </div>
                <div className="text-center">
                  <DollarSign className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-2 font-dm-serif tight-tracking">90% Less Cost</div>
                  <div className="text-sm text-gray-600">Skip expensive development time</div>
                </div>
                <div className="text-center">
                  <Target className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-2 font-dm-serif tight-tracking">Zero Errors</div>
                  <div className="text-sm text-gray-600">AI-generated, battle-tested code</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'demo':
        return (
          <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col justify-center min-h-full">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tight-tracking">Product Demo</h2>
              <p className="text-sm sm:text-base text-gray-600 px-2">Watch as we build a complete e-commerce backend in under 5 minutes</p>
              <Badge className="mt-3 bg-gray-100 text-gray-800 border-gray-300 px-3 py-1 text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Live Demo
              </Badge>
            </div>
            
            <div className="bg-gray-100 rounded-xl p-4 sm:p-6 border border-gray-300 shadow-lg">
              <div className="flex items-center gap-2 sm:gap-3 mb-4">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-500 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 rounded-full"></div>
                </div>
                <span className="text-gray-600 font-mono text-xs sm:text-sm">rhinoback.ai/builder</span>
              </div>
              
              <div className="bg-black rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
                <div className="text-gray-400 mb-2 whitespace-nowrap">$ rhinoback create</div>
                <div className="text-gray-300 mb-2">
                  <span className="text-gray-100">RhinoBack:</span> What kind of application would you like to build?
                </div>
                <div className="text-white mb-3 leading-relaxed">
                  <span className="text-gray-400">You:</span> <em className="break-words">Build me an e-commerce platform with user accounts, product catalog, shopping cart, payments, and admin dashboard</em>
                </div>
                
                <div className="text-gray-300 mb-2">
                  <span className="text-gray-100">RhinoBack:</span> Analyzing requirements...
                </div>
                
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 break-words">User management → PostgreSQL tables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 break-words">Real-time cart features → Redis cache</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 break-words">Product search → Elasticsearch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 break-words">File storage → S3 integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-400 break-words">Payment processing → Stripe webhooks</span>
                  </div>
                </div>
                
                <div className="text-gray-400 text-xs leading-relaxed">
                  <div className="mb-1">✅ Backend generated successfully!</div>
                  <div className="mb-1 break-all">🚀 Deployed to: https://your-app.rhinoback.dev</div>
                  <div className="break-all">📚 API docs: https://your-app.rhinoback.dev/docs</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full text-xs sm:text-sm">
                  <Clock className="w-3 h-3 text-gray-700" />
                  <span className="text-gray-800 font-medium">Total time: 4 minutes 32 seconds</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'market':
        return (
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col justify-center min-h-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tight-tracking">$28B Market Opportunity</h2>
              <p className="text-sm md:text-base text-gray-600 mb-4">Backend-as-a-Service market growing 25% annually</p>
              <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-gray-700" />
                <span className="text-gray-800 font-medium text-sm">25% Annual Growth</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <Card className="bg-white border border-gray-300 shadow-sm text-center hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-dm-serif">4M+</div>
                  <CardTitle className="text-base md:text-lg text-gray-900">Indie Developers</CardTitle>
                  <CardDescription className="text-xs md:text-sm px-2">Building side projects and startups</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-white border border-gray-300 shadow-sm text-center hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-dm-serif">500K+</div>
                  <CardTitle className="text-base md:text-lg text-gray-900">Development Agencies</CardTitle>
                  <CardDescription className="text-xs md:text-sm px-2">Building client applications</CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="bg-white border border-gray-300 shadow-sm text-center hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="text-3xl md:text-4xl font-bold text-gray-700 mb-2 font-dm-serif">100K+</div>
                  <CardTitle className="text-base md:text-lg text-gray-900">Enterprise Teams</CardTitle>
                  <CardDescription className="text-xs md:text-sm px-2">Accelerating internal development</CardDescription>
                </CardHeader>
              </Card>
            </div>
            
            <div className="mt-8 bg-gray-100 rounded-xl p-6 border border-gray-300 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 font-dm-serif">
                <em>Total Addressable Market: $28B+</em>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-gray-700">
                  <span className="font-semibold text-gray-900">BaaS Market:</span> $7.2B (2024)
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold text-gray-900">No-Code/Low-Code:</span> $13.8B
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold text-gray-900">Dev Tools:</span> $7.1B
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'pricing':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center min-h-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tight-tracking">Pricing Strategy</h2>
              <p className="text-sm md:text-base text-gray-600 mb-4">Simple, transparent pricing that scales with your needs</p>
              <Badge className="bg-gray-100 text-gray-800 border-gray-300 px-4 py-1">
                <DollarSign className="w-3 h-3 mr-1" />
                Fair Usage Based Pricing
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Card className="bg-white border border-gray-200 shadow-sm text-center hover:shadow-lg transition-all transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-dm-serif">Free</div>
                  <div className="text-gray-600 mb-3 text-sm font-medium">Starter</div>
                  <div className="text-gray-700 text-xs leading-relaxed space-y-1">
                    <div>• Basic apps</div>
                    <div>• 10K requests/month</div>
                    <div>• Community support</div>
                    <div>• 1 project</div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="bg-white border-2 border-gray-400 shadow-lg text-center relative transform scale-105">
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 text-xs">
                  Most Popular
                </Badge>
                <CardHeader className="pb-4 pt-6">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-dm-serif">$25</div>
                  <div className="text-gray-600 mb-3 text-sm font-medium">Pro / month</div>
                  <div className="text-gray-700 text-xs leading-relaxed space-y-1">
                    <div>• Production apps</div>
                    <div>• 100K requests/month</div>
                    <div>• Custom domains</div>
                    <div>• Priority support</div>
                    <div>• 5 projects</div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm text-center hover:shadow-lg transition-all transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-dm-serif">$99</div>
                  <div className="text-gray-600 mb-3 text-sm font-medium">Team / month</div>
                  <div className="text-gray-700 text-xs leading-relaxed space-y-1">
                    <div>• Team collaboration</div>
                    <div>• 500K requests/month</div>
                    <div>• Advanced features</div>
                    <div>• Dedicated support</div>
                    <div>• 25 projects</div>
                  </div>
                </CardHeader>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm text-center hover:shadow-lg transition-all transform hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="text-2xl md:text-3xl font-bold text-gray-700 mb-2 font-dm-serif">Custom</div>
                  <div className="text-gray-600 mb-3 text-sm font-medium">Enterprise</div>
                  <div className="text-gray-700 text-xs leading-relaxed space-y-1">
                    <div>• On-premise deployment</div>
                    <div>• Unlimited requests</div>
                    <div>• SLA guarantees</div>
                    <div>• White-label options</div>
                    <div>• Unlimited projects</div>
                  </div>
                </CardHeader>
              </Card>
            </div>
            
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 font-dm-serif">
                <em>Why Our Pricing Works</em>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <Target className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 mb-1">Usage-Based</div>
                  <div className="text-gray-600">Pay only for what you use, scale as you grow</div>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 mb-1">No Lock-in</div>
                  <div className="text-gray-600">Export your data anytime, full ownership</div>
                </div>
                <div className="text-center">
                  <Gauge className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                  <div className="font-semibold text-gray-900 mb-1">Performance</div>
                  <div className="text-gray-600">Enterprise-grade infrastructure included</div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'competition':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col justify-center min-h-full">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tight-tracking">
                We're Building the <span className="text-gray-900">Next Generation</span>
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl border border-gray-200 shadow-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 text-gray-900 font-bold text-sm">Feature</th>
                    <th className="text-center p-3 text-gray-900 font-bold text-sm">RhinoBack</th>
                    <th className="text-center p-3 text-gray-600 font-bold text-sm">Firebase</th>
                    <th className="text-center p-3 text-gray-600 font-bold text-sm">Supabase</th>
                    <th className="text-center p-3 text-gray-600 font-bold text-sm">Xano</th>
                    <th className="text-center p-3 text-gray-600 font-bold text-sm">AWS Amplify</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-gray-900 font-medium text-sm">AI-Powered Architecture</td>
                    <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-gray-900 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-gray-900 font-medium text-sm">Multi-Database Support</td>
                    <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-gray-900 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-gray-700 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-gray-900 font-medium text-sm">Natural Language Input</td>
                    <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-gray-900 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-gray-900 font-medium text-sm">Fair Usage Pricing</td>
                    <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-gray-900 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><CheckCircle className="w-4 h-4 text-gray-700 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                    <td className="p-3 text-center"><XCircle className="w-4 h-4 text-gray-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-900 font-medium text-sm">Deployment Speed</td>
                    <td className="p-3 text-center text-gray-900 font-bold text-sm">5 min</td>
                    <td className="p-3 text-center text-gray-600 text-sm">30 min</td>
                    <td className="p-3 text-center text-gray-600 text-sm">45 min</td>
                    <td className="p-3 text-center text-gray-600 text-sm">2 hours</td>
                    <td className="p-3 text-center text-gray-600 text-sm">4 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      
      case 'funding':
        return (
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col justify-center min-h-full">
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tight-tracking">Raising $2M Seed Round</h2>
              <p className="text-base text-gray-600">To accelerate development and market entry</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-gray-900 font-dm-serif">Use of Funds</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-sm">Product Development</span>
                    <div className="flex items-center gap-3">
                      <Progress value={60} className="w-20" />
                      <span className="text-gray-900 font-bold text-sm">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-sm">AI Infrastructure</span>
                    <div className="flex items-center gap-3">
                      <Progress value={25} className="w-20" />
                      <span className="text-gray-900 font-bold text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-sm">Customer Acquisition</span>
                    <div className="flex items-center gap-3">
                      <Progress value={15} className="w-20" />
                      <span className="text-gray-900 font-bold text-sm">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl text-gray-900 font-dm-serif">Financial Projections</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-sm">Year 1:</span>
                    <span className="text-gray-900 font-bold text-sm">$360K ARR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-sm">Year 2:</span>
                    <span className="text-gray-800 font-bold text-sm">$2.1M ARR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-sm">Year 3:</span>
                    <span className="text-gray-700 font-bold text-sm">$12.5M ARR</span>
                  </div>
                  <Separator className="bg-gray-300 my-2" />
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-sm">Customer LTV:</span>
                    <span className="text-gray-900 font-bold text-sm">$2,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 text-sm">Gross Margin:</span>
                    <span className="text-gray-900 font-bold text-sm">85%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 font-dm-serif"><em>Join Us in Building the Future</em></h3>
              <p className="text-base text-gray-700 mb-4 italic">
                "Every startup should focus on their product, not their infrastructure"
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-700" />
                  <span className="text-gray-700">manojmaheshwarjg@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-700" />
                  <span className="text-gray-700">rhinoback.manoj.ai</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="text-lg sm:text-xl font-bold text-gray-900 font-dm-serif">
              <em>RHINOBACK</em>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs text-gray-600 hidden sm:inline">
                Slide {currentSlide + 1} of {slides.length}
              </span>
              <span className="text-xs text-gray-600 sm:hidden">
                {currentSlide + 1}/{slides.length}
              </span>
              <div className="text-xs sm:text-sm font-medium text-gray-900 max-w-32 sm:max-w-none truncate">
                {slides[currentSlide].title}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content Area - Scrollable */}
      <main className={`fixed left-0 right-0 w-full overflow-x-hidden relative ${slides[currentSlide].id === 'hero' ? 'top-0 bottom-0 h-screen overflow-y-hidden flex items-center justify-center' : 'top-14 bottom-16 overflow-y-auto'}`}>
        {/* Grid Pattern Background */}
        <GridPattern 
          width={60} 
          height={60} 
          className="absolute inset-0 h-full w-full fill-gray-200/20 stroke-gray-300/30" 
          strokeDasharray="2 2" 
        />
        <div className={`${slides[currentSlide].id === 'hero' ? 'relative z-10 w-full h-full flex items-center justify-center' : 'absolute inset-0 relative z-10 flex items-center justify-center min-h-full p-4 sm:p-6 lg:p-8'}`}>
          <div className={`w-full ${slides[currentSlide].id === 'hero' ? 'flex items-center justify-center' : ''}`}>
            {renderSlide()}
          </div>
        </div>
      </main>
      
      {/* Bottom Fixed Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Previous Button */}
            <Button 
              onClick={prevSlide}
              variant="outline" 
              size="sm"
              disabled={currentSlide === 0}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm min-w-[80px] touch-target"
            >
              <ChevronLeft className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            
            {/* Slide Indicator Dots */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 max-w-sm mx-auto overflow-x-auto">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex-shrink-0 rounded-full transition-all duration-200 min-w-[16px] min-h-[16px] sm:min-w-[20px] sm:min-h-[20px] flex items-center justify-center ${
                    index === currentSlide 
                      ? 'bg-gray-900 w-4 h-4 sm:w-5 sm:h-5' 
                      : 'bg-gray-300 hover:bg-gray-400 w-3 h-3 sm:w-4 sm:h-4'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === currentSlide && (
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Next Button */}
            <Button 
              onClick={nextSlide}
              variant="outline" 
              size="sm"
              disabled={currentSlide === slides.length - 1}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm min-w-[80px] touch-target"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="ml-1 w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </footer>
      
      {/* Keyboard Instructions - Hidden on Mobile */}
      <div className="fixed bottom-20 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs opacity-75 hidden sm:block">
        Use ← → keys or spacebar
      </div>
    </div>
  )
}