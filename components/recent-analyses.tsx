"use client"

import { useEffect, useState } from "react"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react"
import { motion } from "framer-motion"

type Analysis = {
  id: string
  topic: string
  timestamp: string
  sentiment: "positive" | "negative" | "neutral"
  positive: number
  negative: number
  neutral: number
}

export function RecentAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchRecentAnalyses = async () => {
      setLoading(true)
      setError(false)

      try {
        const response = await fetch("/api/analyses?limit=5", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setAnalyses(Array.isArray(data) ? data : [])
        } else {
          console.error("Failed to fetch analyses:", await response.text())
          setError(true)
        }
      } catch (error) {
        console.error("Failed to fetch recent analyses:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentAnalyses()
  }, [])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Invalid date"
    }
  }

  if (error) {
    return (
      <CardContent className="p-6">
        <div className="text-center">
          <p className="text-zinc-400">Failed to load recent analyses</p>
        </div>
      </CardContent>
    )
  }

  return (
    <CardContent className="p-0">
      {loading ? (
        <div className="p-6">
          <div className="animate-pulse space-y-3 w-full">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-zinc-800/50 rounded-md"></div>
            ))}
          </div>
        </div>
      ) : analyses.length > 0 ? (
        <div className="divide-y divide-zinc-800/50">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="p-4 hover:bg-zinc-800/10 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-zinc-200 flex items-center gap-2">
                    <span>#{analysis.topic || "Unknown"}</span>
                    <Badge className={`${getSentimentColor(analysis.sentiment || "neutral")}`} variant="outline">
                      {getSentimentIcon(analysis.sentiment || "neutral")}
                    </Badge>
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(analysis.timestamp || new Date().toISOString())}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-zinc-900/50 px-2 py-1 rounded-md">
                  <span className="text-xs text-green-400">{analysis.positive || 0}%</span>
                  <span className="text-xs text-zinc-600">|</span>
                  <span className="text-xs text-zinc-400">{analysis.neutral || 0}%</span>
                  <span className="text-xs text-zinc-600">|</span>
                  <span className="text-xs text-red-400">{analysis.negative || 0}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6">
          <div className="bg-blue-600/10 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-zinc-300 mb-1">No analyses yet</h3>
          <p className="text-sm text-zinc-500">Analyses will appear here after you run them</p>
        </div>
      )}
    </CardContent>
  )
}

