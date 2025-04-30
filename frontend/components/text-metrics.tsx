"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gsap } from "gsap"
import { AnalysisResult } from "@/types/analysis"
import { FileText, AlignLeft, MessageSquare } from 'lucide-react'

interface TextMetricsProps {
  features: AnalysisResult["features"]
}

export function TextMetrics({ features }: TextMetricsProps) {
  const metricsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (metricsRef.current) {
      gsap.fromTo(
        ".metric-item",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.7)",
        },
      )
    }
  }, [features])

  return (
    <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="h-2 bg-cyan-500"></div>
      <CardHeader className="pb-2 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30">
        <CardTitle>Text Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-4" ref={metricsRef}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Word Count */}
          <div className="metric-item bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center mb-2">
              <FileText className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Words</span>
            </div>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{features.word_count}</p>
          </div>

          {/* Character Count */}
          <div className="metric-item bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 p-3 rounded-lg border border-cyan-100 dark:border-cyan-800/30">
            <div className="flex items-center mb-2">
              <AlignLeft className="h-4 w-4 mr-2 text-cyan-500" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-400">Characters</span>
            </div>
            <p className="text-2xl font-bold text-cyan-800 dark:text-cyan-300">{features.char_count}</p>
          </div>

          {/* Sentence Count */}
          <div className="metric-item bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 p-3 rounded-lg border border-teal-100 dark:border-teal-800/30">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-4 w-4 mr-2 text-teal-500" />
              <span className="text-sm font-medium text-teal-700 dark:text-teal-400">Sentences</span>
            </div>
            <p className="text-2xl font-bold text-teal-800 dark:text-teal-300">{features.sentence_count}</p>
          </div>

          {/* Average Word Length */}
          <div className="metric-item bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg border border-green-100 dark:border-green-800/30">
            <div className="flex items-center mb-2">
              <span className="h-4 w-4 mr-2 text-green-500 font-bold">Aa</span>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Avg Word Length</span>
            </div>
            <p className="text-2xl font-bold text-green-800 dark:text-green-300">
              {features.avg_word_length.toFixed(1)}
            </p>
          </div>

          {/* Fake Phrase Count */}
          <div className="metric-item bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800/30">
            <div className="flex items-center mb-2">
              <span className="h-4 w-4 mr-2 text-red-500 font-bold">⚠️</span>
              <span className="text-sm font-medium text-red-700 dark:text-red-400">Fake Phrases</span>
            </div>
            <p className="text-2xl font-bold text-red-800 dark:text-red-300">{features.fake_phrase_count}</p>
          </div>

          {/* Real Phrase Count */}
          <div className="metric-item bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
            <div className="flex items-center mb-2">
              <span className="h-4 w-4 mr-2 text-emerald-500 font-bold">✓</span>
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Real Phrases</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">{features.real_phrase_count}</p>
          </div>
        </div>

        {/* Style Metrics */}
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-3">Style Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StyleMetric
              label="Exclamations"
              value={features.style_metrics.exclamation_count}
              maxValue={5}
              colorClass="bg-amber-500"
            />
            <StyleMetric
              label="Questions"
              value={features.style_metrics.question_count}
              maxValue={5}
              colorClass="bg-purple-500"
            />
            <StyleMetric
              label="ALL CAPS"
              value={features.style_metrics.all_caps_ratio * 100}
              maxValue={100}
              colorClass="bg-blue-500"
              suffix="%"
            />
            <StyleMetric
              label="Complex Words"
              value={features.style_metrics.complex_word_ratio * 100}
              maxValue={100}
              colorClass="bg-indigo-500"
              suffix="%"
            />
            <StyleMetric
              label="Readability"
              value={features.style_metrics.readability_score}
              maxValue={20}
              colorClass="bg-teal-500"
              tooltip="Lower scores indicate easier reading"
            />
            <StyleMetric
              label="Punctuation"
              value={features.style_metrics.punctuation_ratio * 100}
              maxValue={20}
              colorClass="bg-pink-500"
              suffix="%"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface StyleMetricProps {
  label: string
  value: number
  maxValue: number
  colorClass: string
  suffix?: string
  tooltip?: string
}

function StyleMetric({ label, value, maxValue, colorClass, suffix = "", tooltip }: StyleMetricProps) {
  const percentage = Math.min((value / maxValue) * 100, 100)
  const formattedValue = Number.isInteger(value) ? value.toString() : value.toFixed(1)

  return (
    <div className="metric-item">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium">
          {formattedValue}
          {suffix}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${percentage}%` }}></div>
      </div>
      {tooltip && <p className="text-xs text-gray-500 mt-1">{tooltip}</p>}
    </div>
  )
}
