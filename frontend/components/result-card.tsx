"use client"

import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface ResultCardProps {
  headline: string
  prediction: string
  confidence: number
}

export function ResultCard({ headline, prediction, confidence }: ResultCardProps) {
  const isFake = prediction === "Fake"
  const confidencePercent = Math.round(confidence * 100)
  const cardRef = useRef<HTMLDivElement>(null)

  // GSAP animation for the confidence meter
  useEffect(() => {
    if (cardRef.current) {
      // Animate the progress bar
      gsap.fromTo(
        ".confidence-bar",
        { width: "0%" },
        {
          width: `${confidencePercent}%`,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.3,
        },
      )

      // Animate the confidence number
      gsap.fromTo(
        ".confidence-number",
        { textContent: "0" },
        {
          textContent: confidencePercent.toString(),
          duration: 1.5,
          ease: "power2.out",
          delay: 0.3,
          snap: { textContent: 1 },
        },
      )
    }
  }, [confidencePercent])

  return (
    <Card
      ref={cardRef}
      className={`border-0 shadow-lg overflow-hidden ${
        isFake
          ? "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30"
          : "bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30"
      }`}
    >
      <div className={`h-2 ${isFake ? "bg-red-500" : "bg-green-500"}`}></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-2xl">
          {isFake ? (
            <AlertTriangle className="h-6 w-6 mr-2 text-red-500" />
          ) : (
            <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
          )}
          <span className={isFake ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}>
            {prediction} News Detected
          </span>
          <Badge
            variant="outline"
            className={`ml-auto ${
              isFake
                ? "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                : "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            {confidencePercent}% Confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg mb-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-800 dark:text-gray-200 font-medium">"{headline}"</p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Confidence Level
              </span>
              <span className="font-bold confidence-number">{confidencePercent}</span>
              <span>%</span>
            </div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full confidence-bar ${
                  isFake ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-green-500 to-teal-500"
                }`}
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
          </div>

          <p
            className={`text-sm mt-2 ${
              isFake ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"
            }`}
          >
            {isFake
              ? `This headline has characteristics commonly found in fake news (${confidencePercent}% confidence)`
              : `This headline has characteristics commonly found in legitimate news (${confidencePercent}% confidence)`}
          </p>

          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700">
            <p className="font-medium mb-1">Note:</p>
            <p>
              This analysis is based on patterns found in known fake and real news. Always verify information from
              multiple reliable sources.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
