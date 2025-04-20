"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gsap } from "gsap"

interface AnalysisResult {
  headline: string
  prediction: string
  confidence: number
  keyPhrases?: string[]
  featureImportance?: Array<{ feature: string; importance: number }>
  modelAccuracy?: number
  algorithmUsed?: string
}

interface DetailedAnalysisProps {
  result: AnalysisResult
}

export function DetailedAnalysis({ result }: DetailedAnalysisProps) {
  const isFake = result.prediction === "Fake"
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current && result.featureImportance) {
      // Clear previous animations
      gsap.killTweensOf(".feature-bar")

      // Animate the feature bars
      gsap.fromTo(
        ".feature-bar",
        { width: 0 },
        {
          width: (i) => `${(result.featureImportance?.[i]?.importance || 0) * 100}%`,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
        },
      )
    }
  }, [result.featureImportance])

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className={`h-2 ${isFake ? "bg-red-500" : "bg-green-500"}`}></div>
      <CardHeader className="pb-2 bg-gray-50 dark:bg-gray-800/50">
        <CardTitle>Detailed Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {/* Key Phrases Section */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Key Phrases Detected</h3>
            <div className="flex flex-wrap gap-2">
              {result.keyPhrases?.map((phrase, index) => (
                <span
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full ${
                    isFake
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {phrase}
                </span>
              ))}
            </div>
          </div>

          {/* Feature Importance Chart */}
          <div ref={chartRef}>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Feature Importance</h3>
            <div className="space-y-2">
              {result.featureImportance?.map((feature, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{feature.feature}</span>
                    <span>{Math.round(feature.importance * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full feature-bar ${
                        isFake
                          ? "bg-gradient-to-r from-red-500 to-orange-500"
                          : "bg-gradient-to-r from-green-500 to-teal-500"
                      }`}
                      style={{ width: `${feature.importance * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Algorithm Information */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Detection Method</h3>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded text-sm">
              <p className="mb-2">
                <span className="font-medium">Algorithm: </span>
                {result.algorithmUsed || "Ensemble (Random Forest + BERT)"}
              </p>
              <p className="mb-2">
                <span className="font-medium">Model Accuracy: </span>
                {((result.modelAccuracy || 0.95) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This model uses a combination of traditional machine learning and deep learning techniques to analyze
                text patterns commonly found in fake vs. real news.
              </p>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-100 dark:border-blue-800/50">
            <h3 className="text-sm font-medium mb-1 text-blue-700 dark:text-blue-400">How This Works</h3>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Our advanced model analyzes the headline for linguistic patterns, emotional language, sensationalism, and
              other features commonly found in fake news. The analysis is based on thousands of verified examples of
              both fake and legitimate news sources.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
