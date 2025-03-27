"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { analyzeSentiment } from "@/lib/analyze-sentiment"
import { ResultsDisplay } from "@/components/results-display"
import { Loader2, Search, Hash, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export function SentimentForm() {
  const [topic, setTopic] = useState("")
  const [tweetCount, setTweetCount] = useState(50)
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Define minimum and maximum tweet counts
  const MIN_TWEET_COUNT = 10
  const MAX_TWEET_COUNT = 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate topic
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    // Validate tweet count
    if (tweetCount < MIN_TWEET_COUNT) {
      setError(`Please select at least ${MIN_TWEET_COUNT} tweets for analysis`)
      return
    }

    setLoading(true)
    setError("")
    setResults(null)

    try {
      // Call the server action for sentiment analysis
      const data = await analyzeSentiment(topic, tweetCount)

      if (data && data.tweets && data.tweets.length > 0) {
        setResults(data)
        setError("")

        // Show success toast
        toast({
          title: "Analysis complete",
          description: `Analyzed ${data.tweets.length} tweets about "${topic}"`,
        })
      } else {
        throw new Error("No tweets found for analysis")
      }
    } catch (err) {
      console.error("Error in form submission:", err)

      // Show error toast
      toast({
        title: "Analysis Error",
        description: err instanceof Error ? err.message : "Failed to analyze tweets",
        variant: "destructive",
      })

      setError(err instanceof Error ? err.message : "Failed to analyze tweets")
    } finally {
      setLoading(false)
    }
  }

  // Handle slider change with validation
  const handleSliderChange = (value: number[]) => {
    try {
      const newValue = value[0]
      // Ensure the value is within the valid range
      if (newValue >= MIN_TWEET_COUNT && newValue <= MAX_TWEET_COUNT) {
        setTweetCount(newValue)
      } else if (newValue < MIN_TWEET_COUNT) {
        setTweetCount(MIN_TWEET_COUNT)
      } else {
        setTweetCount(MAX_TWEET_COUNT)
      }
    } catch (e) {
      console.error("Error handling slider change:", e)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-zinc-300 flex items-center gap-2">
            <Hash className="h-4 w-4 text-blue-500" />
            <span>Topic or Hashtag</span>
          </Label>
          <div className="relative">
            <Input
              id="topic"
              placeholder="Enter a topic (e.g., climate change)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-zinc-900/50 border-zinc-800 text-zinc-100 pl-10 h-12 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
            <Search className="h-5 w-5 text-zinc-500 absolute left-3 top-3.5" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label htmlFor="tweet-count" className="text-zinc-300 flex items-center gap-2">
              <span>Number of Tweets</span>
            </Label>
            <span className="text-blue-500 font-medium bg-blue-500/10 px-2 py-1 rounded-md text-sm">{tweetCount}</span>
          </div>
          <Slider
            id="tweet-count"
            min={MIN_TWEET_COUNT}
            max={MAX_TWEET_COUNT}
            step={10}
            value={[tweetCount]}
            onValueChange={handleSliderChange}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{MIN_TWEET_COUNT}</span>
            <span>{MAX_TWEET_COUNT}</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 border-red-900 bg-red-950/50 text-red-300">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white h-12 rounded-lg font-medium shadow-lg shadow-blue-600/10 transition-all duration-200"
            disabled={loading || tweetCount < MIN_TWEET_COUNT}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Search className="mr-2 h-5 w-5" />
                <span>Analyze Sentiment</span>
              </div>
            )}
          </Button>
        </motion.div>
      </form>

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <ResultsDisplay results={results} topic={topic} />
        </motion.div>
      )}
    </div>
  )
}

