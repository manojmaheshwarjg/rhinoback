"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { StepOne } from "@/components/onboarding/step-one"
import { StepTwo } from "@/components/onboarding/step-two"
import { StepThree } from "@/components/onboarding/step-three"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, Database, Rocket } from "lucide-react"
import { GridPattern } from "@/components/ui/shadcn-io/grid-pattern"

interface GeneratedData {
  description: string
  schemas: any[]
  database: string
  endpoints: any[]
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  // Initialize state from URL and localStorage on component mount
  useEffect(() => {
    const stepFromUrl = searchParams.get('step')
    const stepNumber = stepFromUrl ? parseInt(stepFromUrl, 10) : 1
    
    // Validate step number
    const validStep = stepNumber >= 1 && stepNumber <= totalSteps ? stepNumber : 1
    setCurrentStep(validStep)
    
    // Load data from localStorage if available
    const savedData = localStorage.getItem('onboarding-data')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setGeneratedData(parsedData)
      } catch (error) {
        console.warn('Failed to parse saved onboarding data:', error)
        localStorage.removeItem('onboarding-data')
      }
    }
    
    // If we're on step 2 or 3 but don't have data, redirect to step 1
    if (validStep > 1 && !savedData) {
      updateStep(1)
    }
    
    setIsLoading(false)
  }, [searchParams])

  // Function to update step in both state and URL
  const updateStep = (step: number) => {
    setCurrentStep(step)
    const url = new URL(window.location.href)
    url.searchParams.set('step', step.toString())
    router.push(url.pathname + url.search, { scroll: false })
  }

  // Function to save data to localStorage
  const saveData = (data: GeneratedData) => {
    setGeneratedData(data)
    localStorage.setItem('onboarding-data', JSON.stringify(data))
  }

  const stepDetails = [
    {
      number: 1,
      title: "Describe Your Vision",
      description: "Tell us about your backend requirements in plain English",
      icon: Sparkles,
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "upcoming",
    },
    {
      number: 2,
      title: "Review & Customize",
      description: "Fine-tune your generated database schema and API endpoints",
      icon: Database,
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "upcoming",
    },
    {
      number: 3,
      title: "Deploy & Launch",
      description: "Configure your deployment settings and launch your backend",
      icon: Rocket,
      status: currentStep === 3 ? "active" : "upcoming",
    },
  ]

  const handleStepComplete = (data?: any) => {
    if (currentStep === 1 && data) {
      // AI generation happens here - save data to localStorage
      saveData(data)
    }

    if (currentStep < totalSteps) {
      updateStep(currentStep + 1)
    } else {
      // Clear saved data and navigate to main dashboard
      localStorage.removeItem('onboarding-data')
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      updateStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      {/* Dashed Grid Pattern Background */}
      <GridPattern 
        width={60} 
        height={60} 
        strokeDasharray="4 4" 
        className="opacity-30"
      />
      <div className="fixed left-0 top-12 bottom-0 w-80 bg-background border-r border-border flex flex-col z-20">
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Build Your Backend</h1>
              <p className="text-muted-foreground text-sm">Create a powerful backend in minutes with AI assistance</p>
            </div>
            {generatedData && (
              <button
                onClick={() => {
                  localStorage.removeItem('onboarding-data')
                  setGeneratedData(null)
                  updateStep(1)
                }}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded border border-border hover:border-destructive"
                title="Clear progress and start over"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-foreground">
              Step {currentStep} of {totalSteps}
            </div>
            <div className="text-xs text-muted-foreground">{Math.round(progress)}% Complete</div>
          </div>
          <Progress value={progress} className="h-3 bg-muted" />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-4">
              {stepDetails.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.number}
                    className={`flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 ${
                      step.status === "active"
                        ? "bg-primary/5 border-primary/20 shadow-sm"
                        : step.status === "completed"
                          ? "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800/30 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-950/30"
                          : "bg-muted/30 border-border/50"
                    }`}
                    onClick={() => {
                      // Allow navigation to completed steps or step 1
                      if (step.status === "completed" || step.number === 1) {
                        updateStep(step.number)
                      }
                    }}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        step.status === "active"
                          ? "bg-primary text-primary-foreground"
                          : step.status === "completed"
                            ? "bg-blue-600 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.status === "completed" ? "✓" : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium text-sm ${
                          step.status === "active"
                            ? "text-foreground"
                            : step.status === "completed"
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-xs mt-1 ${
                          step.status === "active"
                            ? "text-muted-foreground"
                            : step.status === "completed"
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-muted-foreground/70"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="ml-80 min-h-screen flex items-center justify-center p-6 pt-16 relative z-10">
        <div className="w-full">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {currentStep === 1 && <StepOne onComplete={handleStepComplete} />}
              {currentStep === 2 && generatedData && (
                <StepTwo data={generatedData} onComplete={handleStepComplete} onBack={handleBack} />
              )}
              {currentStep === 3 && generatedData && (
                <StepThree data={generatedData} onComplete={handleStepComplete} onBack={handleBack} />
              )}
              {(currentStep === 2 || currentStep === 3) && !generatedData && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No data found. Please start from step 1.</p>
                  <button 
                    onClick={() => updateStep(1)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Go to Step 1
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
