"use client"

import { AlertTriangle, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { AnalysisResult } from "@/types/analysis"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ResultCardProps {
  result: AnalysisResult
}

export function ResultCard({ result }: ResultCardProps) {
  const isFake = result.prediction === "Fake"
  const confidencePercent = result.confidence_percentage
  const reliabilityScore = result.reliability_score
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
          textContent: Math.round(confidencePercent).toString(),
          duration: 1.5,
          ease: "power2.out",
          delay: 0.3,
          snap: { textContent: 1 },
        },
      )

      // Animate the reliability score
      gsap.fromTo(
        ".reliability-score",
        { textContent: "0" },
        {
          textContent: reliabilityScore.toString(),
          duration: 1.5,
          ease: "power2.out",
          delay: 0.5,
          snap: { textContent: 1 },
        },
      )

      // Animate the reliability meter
      gsap.fromTo(
        ".reliability-meter",
        { height: "0%" },
        {
          height: `${reliabilityScore}%`,
          duration: 1.5,
          ease: "power2.out",
          delay: 0.5,
        },
      )
    }
  }, [confidencePercent, reliabilityScore])

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
            {result.prediction} News Detected
          </span>
          <Badge
            variant="outline"
            className={`ml-auto ${
              isFake
                ? "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                : "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            {Math.round(confidencePercent)}% Confidence
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white/80 dark:bg-gray-800/50 p-4 rounded-lg mb-4 border border-gray-100 dark:border-gray-700">
          <p className="text-gray-800 dark:text-gray-200 font-medium">"{result.text}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Confidence Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Confidence
              </span>
              <span className="font-bold confidence-number">{Math.round(confidencePercent)}</span>
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
            <p className="text-xs text-gray-600 dark:text-gray-400">
              How confident the model is in its prediction
            </p>
          </div>

          {/* Reliability Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Reliability Score
              </span>
              <span className="font-bold reliability-score">{reliabilityScore}</span>
              <span>/100</span>
            </div>
            <div className="relative h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`absolute bottom-0 left-0 w-full reliability-meter ${getReliabilityColor(reliabilityScore)}`}
                style={{ height: `${reliabilityScore}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Estimated reliability of the content (higher is more reliable)
            </p>
          </div>

          {/* Red Flags */}
          <div className="space-y-2">
            <div className="text-sm mb-1">
              <span className="font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Red Flags
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {result.red_flags && result.red_flags.length > 0 ? (
                result.red_flags.map((flag, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="destructive" className="text-xs">
                          {flag}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">This is a warning sign of potential misinformation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))
              ) : (
                <span className="text-xs text-gray-500 dark:text-gray-400">No red flags detected</span>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Specific warning signs detected in the content
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium">Analysis Explanation:</h3>
          <ul className="space-y-1 text-sm">
            {result.explanation.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 mt-1">•</span>
                <span className="text-gray-700 dark:text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function getReliabilityColor(score: number): string {
  if (score < 30) {
    return "bg-gradient-to-t from-red-600 to-red-400";
  } else if (score < 60) {
    return "bg-gradient-to-t from-yellow-600 to-yellow-400";
  } else {
    return "bg-gradient-to-t from-green-600 to-green-400";
  }
}
