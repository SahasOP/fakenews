"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gsap } from "gsap"

interface FeatureImportanceProps {
  features: Array<{
    feature: string
    importance: number
  }>
}

export function FeatureImportance({ features }: FeatureImportanceProps) {
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (featuresRef.current) {
      gsap.fromTo(
        ".feature-bar",
        { width: 0 },
        {
          width: (i) => `${(features[i]?.importance || 0) * 100}%`,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
        },
      )
    }
  }, [features])

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="h-2 bg-indigo-500"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
        <CardTitle>Top Features for Detection</CardTitle>
      </CardHeader>
      <CardContent className="p-4" ref={featuresRef}>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{feature.feature}</span>
                <span>{Math.round(feature.importance * 100)}%</span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full feature-bar bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${feature.importance * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700">
          <p className="font-medium mb-1">About Feature Importance:</p>
          <p>
            These are the most influential words and phrases that the model uses to determine if a headline is fake or
            real. Higher percentages indicate stronger influence on the model's decision.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
