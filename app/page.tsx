"use client"

import { useState, useEffect } from "react"
import { analyzeSentiment, getRecentAnalyses } from "@/lib/analyze-sentiment"
import { SearchBar } from "@/components/SearchBar"
import { SentimentChart } from "@/components/SentimentChart"
import { TweetList } from "@/components/TweetList"
import { RecentAnalyses } from "@/components/RecentAnalyses"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { BarChart2, TrendingUp, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const [topic, setTopic] = useState("")
  const [analyzedTopic, setAnalyzedTopic] = useState<string | null>(null)
  const [count, setCount] = useState(20)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)

  // Function to extract wait time from error message
  const extractWaitTime = (errorMessage: string) => {
    const match = errorMessage.match(/wait (\d+) seconds/)
    return match ? parseInt(match[1]) : null
  }

  // Function to start countdown
  const startCountdown = (seconds: number) => {
    setCountdown(seconds)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer)
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSearch = async () => {
    if (!topic.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)
    setCountdown(null)
    setAnalyzedTopic(null)

    try {
      const data = await analyzeSentiment(topic, count)
      setResult(data)
      setAnalyzedTopic(topic) // Only set the analyzed topic after successful analysis
      // Refresh recent analyses after successful search
      const recent = await getRecentAnalyses()
      setRecentAnalyses(recent)
    } catch (err: any) {
      setError(err.message)
      const waitTime = extractWaitTime(err.message)
      if (waitTime) {
        startCountdown(waitTime)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadRecentAnalyses = async () => {
      const recent = await getRecentAnalyses()
      setRecentAnalyses(recent)
    }
    loadRecentAnalyses()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 to-black overflow-hidden">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <div className="inline-block p-3 bg-blue-600/10 rounded-2xl mb-4">
            <BarChart2 className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            {analyzedTopic ? `Analysis: "${analyzedTopic}"` : 'Sentiment Analysis'}
          </h1>
          <p className="text-zinc-400 text-lg">
            Analyze the sentiment of tweets on any topic
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <SearchBar
            topic={topic}
            setTopic={setTopic}
            count={count}
            setCount={setCount}
            onSearch={handleSearch}
            loading={loading}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
              {countdown !== null && (
                <p className="text-yellow-400 mt-2">
                  Next analysis available in: {countdown} seconds
                </p>
              )}
            </div>
          )}

          {loading && (
            <div className="mt-8 flex justify-center">
              <LoadingSpinner />
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-8">
              <SentimentChart
                positive={result.positive}
                negative={result.negative}
                neutral={result.neutral}
              />
              <TweetList tweets={result.tweets} />
            </div>
          )}

          {recentAnalyses.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-center text-white">Recent Analyses</h2>
              <RecentAnalyses analyses={recentAnalyses} />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

const features = [
  {
    icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
    title: "Real-time Analysis",
    description: "Get instant sentiment analysis on any topic with customizable tweet counts.",
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    title: "Visual Insights",
    description: "View sentiment distribution through interactive charts and visualizations.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
    title: "Real Tweets",
    description: "See real life tweets with their sentiment classification and scores.",
  },
]

