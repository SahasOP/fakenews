"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gsap } from "gsap"
import { AnalysisResult } from "@/types/analysis"

interface LanguageAnalysisProps {
  posAnalysis: AnalysisResult["features"]["pos_analysis"]
  credibilityIndicators: AnalysisResult["features"]["credibility_indicators"]
}

export function LanguageAnalysis({ posAnalysis, credibilityIndicators }: LanguageAnalysisProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      // Animate the POS bars
      gsap.fromTo(
        ".pos-bar",
        { height: 0 },
        {
          height: (i, target) => {
            return target.getAttribute("data-height") + "px"
          },
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
        },
      )

      // Animate the credibility indicators
      gsap.fromTo(
        ".indicator-value",
        { textContent: "0" },
        {
          textContent: (i, target) => {
            return target.getAttribute("data-value")
          },
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          snap: { textContent: 1 },
        },
      )
    }
  }, [posAnalysis, credibilityIndicators])

  // Calculate percentages for display
  const nounPercent = Math.round(posAnalysis.noun_ratio * 100)
  const verbPercent = Math.round(posAnalysis.verb_ratio * 100)
  const adjPercent = Math.round(posAnalysis.adj_ratio * 100)
  const advPercent = Math.round(posAnalysis.adv_ratio * 100)

  // Calculate max height for bars (100px max)
  const maxHeight = 100
  const nounHeight = Math.round(posAnalysis.noun_ratio * maxHeight)
  const verbHeight = Math.round(posAnalysis.verb_ratio * maxHeight)
  const adjHeight = Math.round(posAnalysis.adj_ratio * maxHeight)
  const advHeight = Math.round(posAnalysis.adv_ratio * maxHeight)

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="h-2 bg-pink-500"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
        <CardTitle>Language Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-4" ref={chartRef}>
        {/* Parts of Speech Analysis */}
        <div>
          <h3 className="text-sm font-medium mb-4">Parts of Speech Distribution</h3>
          <div className="flex justify-around items-end h-32 mb-2">
            <div className="flex flex-col items-center">
              <div 
                className="pos-bar w-12 bg-blue-500 rounded-t" 
                data-height={nounHeight}
                style={{ height: `${nounHeight}px` }}
              ></div>
              <span className="text-xs mt-1">Nouns</span>
              <span className="text-xs font-medium">{nounPercent}%</span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className="pos-bar w-12 bg-green-500 rounded-t" 
                data-height={verbHeight}
                style={{ height: `${verbHeight}px` }}
              ></div>
              <span className="text-xs mt-1">Verbs</span>
              <span className="text-xs font-medium">{verbPercent}%</span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className="pos-bar w-12 bg-purple-500 rounded-t" 
                data-height={adjHeight}
                style={{ height: `${adjHeight}px` }}
              ></div>
              <span className="text-xs mt-1">Adjectives</span>
              <span className="text-xs font-medium">{adjPercent}%</span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className="pos-bar w-12 bg-orange-500 rounded-t" 
                data-height={advHeight}
                style={{ height: `${advHeight}px` }}
              ></div>
              <span className="text-xs mt-1">Adverbs</span>
              <span className="text-xs font-medium">{advPercent}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Fake news often uses more adjectives and adverbs for emotional impact, while credible news focuses on nouns and verbs.
          </p>
        </div>

        {/* Credibility Indicators */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Credibility Indicators</h3>
          <div className="grid grid-cols-2 gap-4">
            <CredibilityIndicator 
              label="Claims" 
              value={credibilityIndicators.claim_count} 
              description="Direct assertions made in the text"
              colorClass="bg-amber-100 dark:bg-amber-900/20"
              textClass="text-amber-800 dark:text-amber-300"
            />
            <CredibilityIndicator 
              label="Hedges" 
              value={credibilityIndicators.hedge_count} 
              description="Words expressing uncertainty (may, might, possibly)"
              colorClass="bg-blue-100 dark:bg-blue-900/20"
              textClass="text-blue-800 dark:text-blue-300"
            />
            <CredibilityIndicator 
              label="Quotes" 
              value={credibilityIndicators.quoted_text_count} 
              description="Text attributed to sources"
              colorClass="bg-green-100 dark:bg-green-900/20"
              textClass="text-green-800 dark:text-green-300"
            />
            <CredibilityIndicator 
              label="URLs" 
              value={credibilityIndicators.url_count} 
              description="Links to external sources"
              colorClass="bg-purple-100 dark:bg-purple-900/20"
              textClass="text-purple-800 dark:text-purple-300"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CredibilityIndicatorProps {
  label: string
  value: number
  description: string
  colorClass: string
  textClass: string
}

function CredibilityIndicator({ label, value, description, colorClass, textClass }: CredibilityIndicatorProps) {
  return (
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-xl font-bold indicator-value ${textClass}`} data-value={value}>
          {value}
        </span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}
