"use client"

import { useState, useEffect, useRef } from "react"
import { NewsForm } from "@/components/news-form"
import { ResultCard } from "@/components/result-card"
import { HistoryItem } from "@/components/history-item"
import { StatsChart } from "@/components/stats-chart"
import { ThemeToggle } from "@/components/theme-toggle"
import { TextMetrics } from "@/components/text-metrics"
import { SentimentAnalysis } from "@/components/sentiment-analysis"
import { KeyPhrasesCard } from "@/components/key-phrases-card"
import { LanguageAnalysis } from "@/components/language-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, BarChart, Clock, FileText, Heart, KeyRound, Languages } from 'lucide-react'
import { gsap } from "gsap"
import { AnalysisResult, HistoryItem as HistoryItemType } from "@/types/analysis"

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [history, setHistory] = useState<HistoryItemType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("result")
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Count fake and real news for stats
  const fakeCount = history.filter((item) => item.prediction === "Fake").length
  const realCount = history.filter((item) => item.prediction === "Real").length

  // GSAP animations
  useEffect(() => {
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
    }

    if (contentRef.current) {
      gsap.from(contentRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      })
    }
  }, [])

  // Animate when result changes
  useEffect(() => {
    if (result) {
      gsap.fromTo(
        ".result-card",
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
      )
      setActiveTab("result")
    }
  }, [result])

  const analyzeHeadline = async (headline: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ headline }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze headline")
      }

      const data = await response.json()
      setResult(data)

      // Add to history
      const historyItem: HistoryItemType = {
        ...data,
        timestamp: new Date(),
      }

      setHistory((prev) => [historyItem, ...prev])

      // Animate the history list
      gsap.fromTo(
        ".history-item:first-child",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
      )
    } catch (error) {
      console.error("Error analyzing headline:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div ref={headerRef} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Fake News Detector
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Analyze headlines to detect fake news using advanced AI
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden border-t-4 border-t-purple-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
                <CardTitle>Analyze News Headline</CardTitle>
                <CardDescription>Enter a news headline to check if it's likely to be fake or real</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <NewsForm onSubmit={analyzeHeadline} isLoading={isLoading} />
              </CardContent>
            </Card>

            {result && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                  <TabsTrigger value="result" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Result
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="sentiment" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Sentiment
                  </TabsTrigger>
                  <TabsTrigger value="phrases" className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    Phrases
                  </TabsTrigger>
                  <TabsTrigger value="language" className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Language
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="result" className="result-card">
                  <ResultCard result={result} />
                </TabsContent>

                <TabsContent value="text">
                  <TextMetrics features={result.features} />
                </TabsContent>

                <TabsContent value="sentiment">
                  <SentimentAnalysis sentiment={result.features.sentiment} />
                </TabsContent>

                <TabsContent value="phrases">
                  <KeyPhrasesCard 
                    keyPhrases={result.key_phrases} 
                    fakePhraseCategories={result.features.fake_phrase_categories}
                    realPhraseCategories={result.features.real_phrase_categories}
                  />
                </TabsContent>

                <TabsContent value="language">
                  <LanguageAnalysis 
                    posAnalysis={result.features.pos_analysis}
                    credibilityIndicators={result.features.credibility_indicators}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>

          <div className="space-y-8">
            <Card className="border-t-4 border-t-blue-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                  Statistics
                </CardTitle>
                <CardDescription>Analysis of headlines checked so far</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <StatsChart fakeCount={fakeCount} realCount={realCount} />
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-indigo-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30">
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-indigo-500" />
                  Recent History
                </CardTitle>
                <CardDescription>Previously analyzed headlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <div key={index} className="history-item">
                        <HistoryItem item={item} />
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No headlines analyzed yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
