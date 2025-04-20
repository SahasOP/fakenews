"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface StatsChartProps {
  fakeCount: number
  realCount: number
}

export function StatsChart({ fakeCount, realCount }: StatsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const total = fakeCount + realCount
    if (total === 0) return

    const fakePercentage = (fakeCount / total) * 100
    const realPercentage = (realCount / total) * 100

    // Draw the chart with animation
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Create animation timeline
    const tl = gsap.timeline()

    // Animate fake news portion (red)
    if (fakeCount > 0) {
      tl.to(
        {},
        {
          duration: 1,
          onUpdate: function () {
            const progress = this.progress()
            const angle = (Math.PI * 2 * fakePercentage * progress) / 100

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, 0, angle)
            ctx.fillStyle = "#ef4444"
            ctx.fill()

            // Draw center circle (white)
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2)
            ctx.fillStyle = "#ffffff"
            ctx.fill()

            // Add text
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillStyle = "#000000"
            ctx.font = "bold 16px sans-serif"
            ctx.fillText(`${total}`, centerX, centerY - 10)
            ctx.font = "12px sans-serif"
            ctx.fillText("Headlines", centerX, centerY + 10)
          },
        },
      )
    }

    // Animate real news portion (green)
    if (realCount > 0) {
      tl.to(
        {},
        {
          duration: 1,
          onUpdate: function () {
            const progress = this.progress()
            const fakeAngle = (Math.PI * 2 * fakePercentage) / 100
            const realAngle = (Math.PI * 2 * realPercentage * progress) / 100

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Draw fake portion
            if (fakeCount > 0) {
              ctx.beginPath()
              ctx.moveTo(centerX, centerY)
              ctx.arc(centerX, centerY, radius, 0, fakeAngle)
              ctx.fillStyle = "#ef4444"
              ctx.fill()
            }

            // Draw real portion
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.arc(centerX, centerY, radius, fakeAngle, fakeAngle + realAngle)
            ctx.fillStyle = "#22c55e"
            ctx.fill()

            // Draw center circle (white)
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius * 0.6, 0, Math.PI * 2)
            ctx.fillStyle = "#ffffff"
            ctx.fill()

            // Add text
            ctx.textAlign = "center"
            ctx.textBaseline = "middle"
            ctx.fillStyle = "#000000"
            ctx.font = "bold 16px sans-serif"
            ctx.fillText(`${total}`, centerX, centerY - 10)
            ctx.font = "12px sans-serif"
            ctx.fillText("Headlines", centerX, centerY + 10)
          },
        },
        "-=0.5",
      )
    }

    // Animate the legend items
    if (chartRef.current) {
      gsap.from(".legend-item", {
        y: 20,
        opacity: 0,
        stagger: 0.2,
        duration: 0.5,
        delay: 0.5,
      })
    }
  }, [fakeCount, realCount])

  return (
    <div ref={chartRef} className="space-y-4">
      <canvas ref={canvasRef} width={200} height={200} className="mx-auto" />

      <div className="flex justify-center space-x-6">
        <div className="flex items-center legend-item">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm">
            Fake: {fakeCount} ({fakeCount + realCount > 0 ? Math.round((fakeCount / (fakeCount + realCount)) * 100) : 0}
            %)
          </span>
        </div>
        <div className="flex items-center legend-item">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm">
            Real: {realCount} ({fakeCount + realCount > 0 ? Math.round((realCount / (fakeCount + realCount)) * 100) : 0}
            %)
          </span>
        </div>
      </div>

      {/* Additional stats */}
      {(fakeCount > 0 || realCount > 0) && (
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded text-center">
            <p className="text-xs text-purple-700 dark:text-purple-400">Total Analyzed</p>
            <p className="text-lg font-bold text-purple-700 dark:text-purple-400">{fakeCount + realCount}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
            <p className="text-xs text-blue-700 dark:text-blue-400">Fake Ratio</p>
            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
              {fakeCount + realCount > 0 ? Math.round((fakeCount / (fakeCount + realCount)) * 100) : 0}%
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
