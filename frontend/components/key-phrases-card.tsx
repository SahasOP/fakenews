"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gsap } from "gsap"
import { AnalysisResult, KeyPhrase } from "@/types/analysis"
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface KeyPhrasesCardProps {
  keyPhrases: KeyPhrase[]
  fakePhraseCategories: Record<string, number>
  realPhraseCategories: Record<string, number>
}

export function KeyPhrasesCard({ keyPhrases, fakePhraseCategories, realPhraseCategories }: KeyPhrasesCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        ".phrase-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
      )

      gsap.fromTo(
        ".category-item",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: "back.out(1.7)",
        },
      )
    }
  }, [keyPhrases, fakePhraseCategories, realPhraseCategories])

  // Format category name for display
  const formatCategoryName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800" ref={cardRef}>
      <div className="h-2 bg-amber-500"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30">
        <CardTitle>Key Phrases Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Key Phrases */}
        {keyPhrases.length > 0 ? (
          <div className="space-y-3">
            {keyPhrases.map((phrase, index) => (
              <div
                key={index}
                className="phrase-item p-3 rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50"
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center">
                    {phrase.category.includes("medical") || phrase.category.includes("conspiracy") ? (
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                    )}
                    <span className="font-medium text-sm">"{phrase.phrase}"</span>
                  </div>
                  <Badge
                    variant={
                      phrase.category.includes("medical") || phrase.category.includes("conspiracy")
                        ? "destructive"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {formatCategoryName(phrase.category)}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-medium">Context:</span> "{phrase.context}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No key phrases detected</p>
        )}

        {/* Categories */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fake News Categories */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
              Fake News Indicators
            </h3>
            <div className="space-y-2">
              {Object.keys(fakePhraseCategories).length > 0 ? (
                Object.entries(fakePhraseCategories).map(([category, count], index) => (
                  <div key={index} className="category-item flex justify-between items-center text-xs p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <span>{formatCategoryName(category)}</span>
                    <Badge variant="destructive" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">No fake news indicators detected</p>
              )}
            </div>
          </div>

          {/* Real News Categories */}
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              Credibility Indicators
            </h3>
            <div className="space-y-2">
              {Object.keys(realPhraseCategories).length > 0 ? (
                Object.entries(realPhraseCategories).map(([category, count], index) => (
                  <div key={index} className="category-item flex justify-between items-center text-xs p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span>{formatCategoryName(category)}</span>
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {count}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">No credibility indicators detected</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
