"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gsap } from "gsap"
import { AnalysisResult } from "@/types/analysis"
import { SmilePlus, Frown, Meh } from 'lucide-react'

interface SentimentAnalysisProps {
  sentiment: AnalysisResult["features"]["sentiment"]
}

export function SentimentAnalysis({ sentiment }: SentimentAnalysisProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      // Animate the sentiment bars
      gsap.fromTo(
        ".sentiment-bar",
        { width: 0 },
        {
          width: (i, target) => {
            return target.getAttribute("data-width") + "%"
          },
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
        },
      )

      // Animate the compound score
      gsap.fromTo(
        ".compound-needle",
        { rotation: -90 },
        {
          rotation: -90 + (sentiment.compound + 1) * 90, // Map from [-1,1] to [-90,90]
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
        },
      )
    }
  }, [sentiment])

  // Calculate percentages for display
  const positivePercent = Math.round(sentiment.positive * 100)
  const negativePercent = Math.round(sentiment.negative * 100)
  const neutralPercent = Math.round(sentiment.neutral * 100)

  // Determine the dominant sentiment
  let dominantSentiment = "Neutral"
  let dominantColor = "text-gray-500"
  let dominantIcon = <Meh className="h-5 w-5 text-gray-500" />

  if (sentiment.compound > 0.05) {
    dominantSentiment = "Positive"
    dominantColor = "text-green-500"
    dominantIcon = <SmilePlus className="h-5 w-5 text-green-500" />
  } else if (sentiment.compound < -0.05) {
    dominantSentiment = "Negative"
    dominantColor = "text-red-500"
    dominantIcon = <Frown className="h-5 w-5 text-red-500" />
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="h-2 bg-violet-500"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
        <CardTitle className="flex items-center">
          {dominantIcon}
          <span className="ml-2">Sentiment Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4" ref={chartRef}>
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Sentiment</p>
            <p className={`text-xl font-bold ${dominantColor}`}>{dominantSentiment}</p>
          </div>
        </div>

        {/* Compound Score Meter */}
        <div className="mb-6">
          <div className="text-sm text-center mb-2">Compound Score: {sentiment.compound.toFixed(2)}</div>
          <div className="relative h-12">
            {/* Meter background */}
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-300 dark:bg-gray-600"></div>
            
            {/* Negative zone */}
            <div className="absolute top-6 left-0 w-1/4 h-1 bg-gradient-to-r from-red-500 to-red-300"></div>
            
            {/* Neutral zone */}
            <div className="absolute top-6 left-1/4 w-1/2 h-1 bg-gradient-to-r from-gray-400 to-gray-300"></div>
            
            {/* Positive zone */}
            <div className="absolute top-6 right-0 w-1/4 h-1 bg-gradient-to-r from-green-300 to-green-500"></div>
            
            {/* Center marker */}
            <div className="absolute top-5 left-1/2 h-3 w-1 bg-gray-500 -ml-0.5"></div>
            
            {/* Needle */}
            <div 
              className="compound-needle absolute top-0 left-1/2 origin-bottom"
              style={{ 
                height: '24px', 
                width: '2px', 
                backgroundColor: getCompoundColor(sentiment.compound),
                transform: `rotate(${-90 + (sentiment.compound + 1) * 90}deg)`
              }}
            >
              <div 
                className="absolute -top-1 -left-1"
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: getCompoundColor(sentiment.compound)
                }}
              ></div>
            </div>
            
            {/* Labels */}
            <div className="absolute top-8 left-0 text-xs text-red-500">Negative</div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs text-gray-500">Neutral</div>
            <div className="absolute top-8 right-0 text-xs text-green-500">Positive</div>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Sentiment Breakdown</h3>
          
          {/* Positive */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="flex items-center">
                <SmilePlus className="h-3 w-3 mr-1 text-green-500" />
                <span>Positive</span>
              </span>
              <span>{positivePercent}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full sentiment-bar bg-green-500" 
                data-width={positivePercent}
                style={{ width: `${positivePercent}%` }}
              ></div>
            </div>
          </div>
          
          {/* Neutral */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="flex items-center">
                <Meh className="h-3 w-3 mr-1 text-gray-500" />
                <span>Neutral</span>
              </span>
              <span>{neutralPercent}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full sentiment-bar bg-gray-500" 
                data-width={neutralPercent}
                style={{ width: `${neutralPercent}%` }}
              ></div>
            </div>
          </div>
          
          {/* Negative */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="flex items-center">
                <Frown className="h-3 w-3 mr-1 text-red-500" />
                <span>Negative</span>
              </span>
              <span>{negativePercent}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full sentiment-bar bg-red-500" 
                data-width={negativePercent}
                style={{ width: `${negativePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700">
          <p>
            Sentiment analysis measures the emotional tone of the content. Fake news often uses emotional language to
            manipulate readers.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function getCompoundColor(score: number): string {
  if (score > 0.05) return "#22c55e"; // green-500
  if (score < -0.05) return "#ef4444"; // red-500
  return "#6b7280"; // gray-500
}
