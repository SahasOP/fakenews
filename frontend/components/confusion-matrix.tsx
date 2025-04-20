"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gsap } from "gsap"

interface ConfusionMatrixProps {
  matrix: {
    truePositives: number
    falsePositives: number
    trueNegatives: number
    falseNegatives: number
  }
}

export function ConfusionMatrix({ matrix }: ConfusionMatrixProps) {
  const matrixRef = useRef<HTMLDivElement>(null)
  const total = matrix.truePositives + matrix.falsePositives + matrix.trueNegatives + matrix.falseNegatives

  useEffect(() => {
    if (matrixRef.current) {
      gsap.fromTo(
        ".matrix-cell",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
      )
    }
  }, [matrix])

  // Calculate percentages
  const tpPercent = ((matrix.truePositives / total) * 100).toFixed(1)
  const fpPercent = ((matrix.falsePositives / total) * 100).toFixed(1)
  const fnPercent = ((matrix.falseNegatives / total) * 100).toFixed(1)
  const tnPercent = ((matrix.trueNegatives / total) * 100).toFixed(1)

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="h-2 bg-purple-500"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
        <CardTitle>Confusion Matrix</CardTitle>
      </CardHeader>
      <CardContent className="p-4" ref={matrixRef}>
        <div className="grid grid-cols-[auto,1fr,1fr] gap-1">
          {/* Header row */}
          <div className="bg-transparent"></div>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 text-center font-medium text-sm">Predicted Fake</div>
          <div className="bg-gray-100 dark:bg-gray-700 p-2 text-center font-medium text-sm">Predicted Real</div>

          {/* Actual Fake row */}
          <div className="bg-gray-100 dark:bg-gray-700 p-2 text-center font-medium text-sm flex items-center justify-center">
            <span className="transform -rotate-90">Actual Fake</span>
          </div>
          <div className="matrix-cell bg-green-100 dark:bg-green-900/30 p-3 text-center">
            <div className="text-lg font-bold text-green-700 dark:text-green-400">{matrix.truePositives}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">True Positives</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">{tpPercent}%</div>
          </div>
          <div className="matrix-cell bg-red-100 dark:bg-red-900/30 p-3 text-center">
            <div className="text-lg font-bold text-red-700 dark:text-red-400">{matrix.falseNegatives}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">False Negatives</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">{fnPercent}%</div>
          </div>

          {/* Actual Real row */}
          <div className="bg-gray-100 dark:bg-gray-700 p-2 text-center font-medium text-sm flex items-center justify-center">
            <span className="transform -rotate-90">Actual Real</span>
          </div>
          <div className="matrix-cell bg-red-100 dark:bg-red-900/30 p-3 text-center">
            <div className="text-lg font-bold text-red-700 dark:text-red-400">{matrix.falsePositives}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">False Positives</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">{fpPercent}%</div>
          </div>
          <div className="matrix-cell bg-green-100 dark:bg-green-900/30 p-3 text-center">
            <div className="text-lg font-bold text-green-700 dark:text-green-400">{matrix.trueNegatives}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">True Negatives</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">{tnPercent}%</div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700">
          <p className="font-medium mb-1">Understanding the Confusion Matrix:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <span className="font-medium">True Positives:</span> Correctly identified fake news
            </li>
            <li>
              <span className="font-medium">False Positives:</span> Real news incorrectly labeled as fake
            </li>
            <li>
              <span className="font-medium">False Negatives:</span> Fake news incorrectly labeled as real
            </li>
            <li>
              <span className="font-medium">True Negatives:</span> Correctly identified real news
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
