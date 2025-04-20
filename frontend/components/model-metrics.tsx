"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gsap } from "gsap"

interface ModelMetricsProps {
  metrics: {
    accuracy: number
    precision: number
    recall: number
    f1Score: number
    confusionMatrix?: {
      truePositives: number
      falsePositives: number
      trueNegatives: number
      falseNegatives: number
    }
  }
}

export function ModelMetrics({ metrics }: ModelMetricsProps) {
  const metricsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (metricsRef.current) {
      gsap.fromTo(
        ".metric-bar",
        { width: 0 },
        {
          width: (i, target) => {
            return target.getAttribute("data-value") + "%"
          },
          duration: 1.5,
          stagger: 0.2,
          ease: "power2.out",
        },
      )

      gsap.fromTo(
        ".metric-value",
        { textContent: "0" },
        {
          textContent: (i, target) => {
            return target.getAttribute("data-value")
          },
          duration: 1.5,
          stagger: 0.2,
          ease: "power2.out",
          snap: { textContent: 1 },
        },
      )
    }
  }, [metrics])

  // Format percentage
  const formatPercent = (value: number) => {
    return (value * 100).toFixed(1)
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="h-2 bg-blue-500"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
        <CardTitle>Model Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-4" ref={metricsRef}>
        <div className="space-y-4">
          {/* Accuracy */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Accuracy</span>
              <span className="metric-value" data-value={formatPercent(metrics.accuracy)}>
                {formatPercent(metrics.accuracy)}
              </span>
              <span>%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full metric-bar bg-gradient-to-r from-blue-500 to-purple-500"
                data-value={formatPercent(metrics.accuracy)}
                style={{ width: `${formatPercent(metrics.accuracy)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Percentage of all predictions that were correct</p>
          </div>

          {/* Precision */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Precision</span>
              <span className="metric-value" data-value={formatPercent(metrics.precision)}>
                {formatPercent(metrics.precision)}
              </span>
              <span>%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full metric-bar bg-gradient-to-r from-blue-500 to-purple-500"
                data-value={formatPercent(metrics.precision)}
                style={{ width: `${formatPercent(metrics.precision)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              When model predicts "Fake", how often it is correct
            </p>
          </div>

          {/* Recall */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Recall</span>
              <span className="metric-value" data-value={formatPercent(metrics.recall)}>
                {formatPercent(metrics.recall)}
              </span>
              <span>%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full metric-bar bg-gradient-to-r from-blue-500 to-purple-500"
                data-value={formatPercent(metrics.recall)}
                style={{ width: `${formatPercent(metrics.recall)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Of all actual fake news, how many were correctly identified
            </p>
          </div>

          {/* F1 Score */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">F1 Score</span>
              <span className="metric-value" data-value={formatPercent(metrics.f1Score)}>
                {formatPercent(metrics.f1Score)}
              </span>
              <span>%</span>
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full metric-bar bg-gradient-to-r from-blue-500 to-purple-500"
                data-value={formatPercent(metrics.f1Score)}
                style={{ width: `${formatPercent(metrics.f1Score)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Harmonic mean of precision and recall</p>
          </div>

          {/* Confusion Matrix */}
          {metrics.confusionMatrix && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Confusion Matrix</h3>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-300">True Positives</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">
                    {metrics.confusionMatrix.truePositives}
                  </p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-300">False Positives</p>
                  <p className="text-lg font-bold text-red-700 dark:text-red-400">
                    {metrics.confusionMatrix.falsePositives}
                  </p>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-300">False Negatives</p>
                  <p className="text-lg font-bold text-red-700 dark:text-red-400">
                    {metrics.confusionMatrix.falseNegatives}
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-300">True Negatives</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400">
                    {metrics.confusionMatrix.trueNegatives}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
