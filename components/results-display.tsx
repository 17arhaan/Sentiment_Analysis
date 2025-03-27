"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, BarChart2, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

type SentimentResult = {
  positive: number
  negative: number
  neutral: number
  tweets: {
    text: string
    sentiment: "positive" | "negative" | "neutral"
    score: number
  }[]
}

type ResultsDisplayProps = {
  results: SentimentResult
  topic: string
}

export function ResultsDisplay({ results, topic }: ResultsDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !results) return

    try {
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      // Data for pie chart
      const data = [
        { label: "Positive", value: results.positive || 0, color: "#10b981" },
        { label: "Neutral", value: results.neutral || 0, color: "#6b7280" },
        { label: "Negative", value: results.negative || 0, color: "#ef4444" },
      ]

      // Calculate total
      const total = data.reduce((sum, item) => sum + item.value, 0) || 1 // Avoid division by zero

      // Draw pie chart
      let startAngle = 0
      const centerX = canvasRef.current.width / 2
      const centerY = canvasRef.current.height / 2 - 15 // Move up to make room for legend
      const radius = Math.min(centerX, centerY) - 20

      // Add glow effect
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.2)
      gradient.addColorStop(0, "rgba(59, 130, 246, 0.1)")
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 1.1, 0, Math.PI * 2)
      ctx.fill()

      data.forEach((item) => {
        const sliceAngle = (2 * Math.PI * item.value) / total

        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
        ctx.closePath()

        ctx.fillStyle = item.color
        ctx.fill()

        // Add subtle shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
        ctx.shadowBlur = 5
        ctx.shadowOffsetX = 2
        ctx.shadowOffsetY = 2

        // Draw label
        const labelAngle = startAngle + sliceAngle / 2
        const labelX = centerX + (radius / 1.5) * Math.cos(labelAngle)
        const labelY = centerY + (radius / 1.5) * Math.sin(labelAngle)

        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 14px Inter, sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${Math.round(item.value)}%`, labelX, labelY)

        // Reset shadow
        ctx.shadowColor = "transparent"
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0

        startAngle += sliceAngle
      })

      // Draw legend at the bottom center
      const legendY = canvasRef.current.height - 20
      const legendWidth = 250 // Total width of legend
      let legendX = centerX - legendWidth / 2 // Center the legend

      data.forEach((item) => {
        // Draw color box
        ctx.fillStyle = item.color
        ctx.fillRect(legendX, legendY, 12, 12)

        // Draw label
        ctx.fillStyle = "#ffffff"
        ctx.font = "12px Inter, sans-serif"
        ctx.textAlign = "left"
        ctx.textBaseline = "middle"
        ctx.fillText(item.label, legendX + 16, legendY + 6)

        legendX += 85 // Space between legend items
      })
    } catch (error) {
      console.error("Error rendering chart:", error)
    }
  }, [results])

  if (!results) return null

  // Ensure results has all required properties
  const safeResults = {
    positive: results.positive || 0,
    negative: results.negative || 0,
    neutral: results.neutral || 0,
    tweets: Array.isArray(results.tweets) ? results.tweets : [],
  }

  const overallSentiment =
    safeResults.positive > safeResults.negative && safeResults.positive > safeResults.neutral
      ? "positive"
      : safeResults.negative > safeResults.positive && safeResults.negative > safeResults.neutral
        ? "negative"
        : "neutral"

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "negative":
        return <TrendingDown className="h-5 w-5 text-red-500" />
      default:
        return <Minus className="h-5 w-5 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-900/30 text-green-400 border-green-800"
      case "negative":
        return "bg-red-900/30 text-red-400 border-red-800"
      default:
        return "bg-gray-800/50 text-gray-400 border-gray-700"
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 text-zinc-100 overflow-hidden">
          <CardHeader className="border-b border-zinc-800/50">
            <CardTitle className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/10 rounded-md">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-zinc-100">Analysis: "{topic}"</span>
              </div>
              <Badge className={`${getSentimentColor(overallSentiment)} px-3 py-1`} variant="outline">
                {getSentimentIcon(overallSentiment)}
                <span className="ml-1 capitalize">{overallSentiment}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex justify-center mb-6">
              <canvas ref={canvasRef} width={300} height={220} className="max-w-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-green-900/20 to-green-900/5 border border-green-800/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-400">{safeResults.positive}%</div>
                <div className="text-sm text-green-500">Positive</div>
              </div>
              <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-800/10 border border-zinc-700/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-zinc-300">{safeResults.neutral}%</div>
                <div className="text-sm text-zinc-400">Neutral</div>
              </div>
              <div className="bg-gradient-to-br from-red-900/20 to-red-900/5 border border-red-800/30 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-400">{safeResults.negative}%</div>
                <div className="text-sm text-red-500">Negative</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {safeResults.tweets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 text-zinc-100 overflow-hidden">
            <CardHeader className="border-b border-zinc-800/50">
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-600/10 rounded-md">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-zinc-100">Sample Tweets</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {safeResults.tweets.slice(0, 5).map((tweet, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="border-b border-zinc-800/50 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <Badge
                        className={`${getSentimentColor(tweet.sentiment || "neutral")} shrink-0 mt-0.5`}
                        variant="outline"
                      >
                        {getSentimentIcon(tweet.sentiment || "neutral")}
                      </Badge>
                      <div>
                        <p className="text-sm text-zinc-300 break-words">{tweet.text}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 w-16 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                tweet.sentiment === "positive"
                                  ? "bg-green-500"
                                  : tweet.sentiment === "negative"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                              }`}
                              style={{ width: `${(tweet.score || 0.5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-zinc-500">Score: {(tweet.score || 0.5).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

