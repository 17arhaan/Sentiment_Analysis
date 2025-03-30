"use client"

import { useState } from "react"
import { analyzeSentiment } from "@/lib/analyze-sentiment"
import { SearchBar } from "@/components/SearchBar"
import { SentimentChart } from "@/components/SentimentChart"
import { TweetList } from "@/components/TweetList"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { BarChart2, TrendingUp, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"

interface Tweet {
  text: string
  sentiment: "positive" | "negative" | "neutral"
  score: number
  metrics: {
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
  }
  createdAt: string
  authorId: string
  authorName: string
  authorUsername: string
}

interface AnalysisResult {
  positive: number
  negative: number
  neutral: number
  tweets: Tweet[]
  cached?: boolean
  cacheAge?: number
  error?: string
}

export default function Home() {
  const [topic, setTopic] = useState("")
  const [analyzedTopic, setAnalyzedTopic] = useState<string | null>(null)
  const [count, setCount] = useState(20)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)

  // Function to extract wait time from error message
  const extractWaitTime = (errorMessage: string) => {
    const match = errorMessage.match(/wait (\d+) minutes/)
    return match ? parseInt(match[1]) * 60 : null
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
      
      if (data.error) {
        setError(data.error)
        const waitTime = extractWaitTime(data.error)
        if (waitTime) {
          startCountdown(waitTime)
        }
        return
      }

      setResult(data)
      setAnalyzedTopic(topic)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-61px)] bg-gradient-to-br from-zinc-950 to-black py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          <div className="inline-block p-3 bg-blue-600/10 rounded-2xl mb-4">
            <BarChart2 className="h-10 w-10 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            {analyzedTopic ? `Analysis: "${analyzedTopic}"` : 'Sentiment Analysis'}
          </h1>
          <p className="text-zinc-400 text-lg mb-1">
            Analyze the sentiment of tweets on any topic and gain valuable insights into public opinion
          </p>
          <p className="text-zinc-500 text-sm">by Arhaan Girdhar</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">Analyze Tweets</h2>
              </div>
              <div className="p-6">
                <SearchBar
                  topic={topic}
                  setTopic={setTopic}
                  count={count}
                  setCount={setCount}
                  onSearch={handleSearch}
                  loading={loading}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                <div className="p-2 bg-blue-600/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-white">Recent Analysis</h2>
              </div>
              {result && (
                <div className="p-6">
                  <SentimentChart
                    positive={result.positive}
                    negative={result.negative}
                    neutral={result.neutral}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>

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
            <TweetList tweets={result.tweets} />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="p-3 bg-blue-600/10 rounded-lg inline-block mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

const features = [
  {
    icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
    title: "Real-time Analysis",
    description: "Get instant sentiment analysis of tweets about any topic, updated in real-time."
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    title: "Trend Insights",
    description: "Understand public sentiment trends and patterns through intuitive visualizations."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-blue-500" />,
    title: "Tweet Details",
    description: "View detailed tweet information and engagement metrics alongside sentiment scores."
  }
]

