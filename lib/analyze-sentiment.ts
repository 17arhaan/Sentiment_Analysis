"use server"

import { TwitterApi } from "twitter-api-v2"
import natural from "natural"

// Simple in-memory storage for analyses
const recentAnalyses: Array<{
  id: string
  topic: string
  timestamp: string
  sentiment: "positive" | "negative" | "neutral"
  positive: number
  negative: number
  neutral: number
  tweets: Array<{
    text: string
    sentiment: "positive" | "negative" | "neutral"
    score: number
    metrics: any
    createdAt: string
    authorId: string
    authorName: string
    authorUsername: string
  }>
}> = []

// Initialize sentiment analyzer with better configuration
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn")

// Server action for sentiment analysis
export async function analyzeSentiment(topic: string, count: number) {
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    throw new Error('Invalid topic provided')
  }

  if (!count || typeof count !== 'number' || count < 10 || count > 100) {
    throw new Error('Invalid count provided. Must be between 10 and 100.')
  }

  // Check if analysis was recently performed for this topic
  const recentAnalysis = recentAnalyses.find(a => a.topic.toLowerCase() === topic.toLowerCase())
  if (recentAnalysis) {
    const timeSinceLastAnalysis = Date.now() - new Date(recentAnalysis.timestamp).getTime()
    // If analysis is less than 30 seconds old, return the cached result
    if (timeSinceLastAnalysis < 30000) {
      return {
        positive: recentAnalysis.positive,
        negative: recentAnalysis.negative,
        neutral: recentAnalysis.neutral,
        tweets: recentAnalysis.tweets,
      }
    }
  }

  // Ensure count is within valid range
  const tweetCount = Math.min(Math.max(10, count), 100)

  try {
    // Check if Twitter credentials are available with detailed logging
    console.log("Checking Twitter credentials...")
    const apiKey = process.env.TWITTER_API_KEY
    const apiSecret = process.env.TWITTER_API_SECRET
    const accessToken = process.env.TWITTER_ACCESS_TOKEN
    const accessSecret = process.env.TWITTER_ACCESS_SECRET

    if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
      throw new Error("Twitter API credentials are not configured")
    }

    console.log("Initializing Twitter client...")
    // Initialize Twitter client
    const twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    })

    // Verify credentials
    try {
      const me = await twitterClient.v2.me()
      console.log("Twitter API authentication successful. User:", me.data.username)
    } catch (authError) {
      throw new Error("Twitter API authentication failed. Please check your credentials.")
    }

    // Search for tweets with better query construction
    const query = topic.startsWith("#") 
      ? `${topic} -is:retweet -is:reply lang:en` 
      : `(${topic}) -is:retweet -is:reply lang:en`
    
    console.log("Searching tweets with query:", query)
    const tweets = await twitterClient.v2.search({
      query,
      max_results: tweetCount,
      "tweet.fields": ["created_at", "public_metrics", "lang", "entities", "author_id", "text"],
      "user.fields": ["username", "name"],
      "expansions": ["author_id"],
    })

    console.log(`Found ${tweets.data.data?.length || 0} tweets`)

    // Process tweets and analyze sentiment
    const analyzedTweets = []
    let positiveCount = 0
    let negativeCount = 0
    let neutralCount = 0

    // Create a map of user data for quick lookup
    const userMap = new Map(
      tweets.includes?.users?.map(user => [user.id, user]) || []
    )

    for (const tweet of tweets.data.data || []) {
      if (tweet.text && tweet.lang === "en") {
        // Clean the tweet text
        const cleanText = tweet.text
          .replace(/https?:\/\/\S+/g, "") // Remove URLs
          .replace(/@\w+/g, "") // Remove mentions
          .replace(/#\w+/g, "") // Remove hashtags
          .trim()

        // Skip if text is too short after cleaning
        if (cleanText.length < 10) continue

        // Analyze sentiment using Natural.js with better word splitting
        const words = cleanText.toLowerCase().split(/\s+/)
        const score = analyzer.getSentiment(words)
        let sentiment

        // More nuanced sentiment classification
        if (score > 0.1) {
          sentiment = "positive"
          positiveCount++
        } else if (score < -0.1) {
          sentiment = "negative"
          negativeCount++
        } else {
          sentiment = "neutral"
          neutralCount++
        }

        // Get user data
        const user = userMap.get(tweet.author_id)

        analyzedTweets.push({
          text: tweet.text,
          sentiment,
          score: normalizeScore(score),
          metrics: tweet.public_metrics,
          createdAt: tweet.created_at,
          authorId: tweet.author_id,
          authorName: user?.name || "Unknown User",
          authorUsername: user?.username || "unknown",
        })
      }
    }

    // If no tweets were found, throw an error
    if (analyzedTweets.length === 0) {
      throw new Error(`No tweets found for topic "${topic}". Try a different search term.`)
    }

    // Calculate percentages with better rounding
    const total = analyzedTweets.length
    const positive = Math.round((positiveCount / total) * 100)
    const negative = Math.round((negativeCount / total) * 100)
    const neutral = 100 - positive - negative

    // Determine overall sentiment with more balanced thresholds
    const overallSentiment =
      positive > negative && positive > neutral
        ? "positive"
        : negative > positive && negative > neutral
          ? "negative"
          : "neutral"

    // Create analysis object
    const newAnalysis = {
      id: Date.now().toString(),
      topic,
      timestamp: new Date().toISOString(),
      sentiment: overallSentiment,
      positive,
      negative,
      neutral,
      tweets: analyzedTweets,
    }

    // Add to beginning of array
    recentAnalyses.unshift(newAnalysis)

    // Keep only the most recent 10 analyses
    if (recentAnalyses.length > 10) {
      recentAnalyses.length = 10
    }

    return {
      positive,
      negative,
      neutral,
      tweets: analyzedTweets,
    }
  } catch (error) {
    console.error("Error in sentiment analysis:", error)
    
    // Check for specific error types
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 401) {
        throw new Error("Twitter API authentication failed. Please check your credentials.")
      } else if (error.code === 429) {
        // Get rate limit info from error
        const rateLimit = error.rateLimit
        const resetTime = rateLimit?.reset ? new Date(rateLimit.reset * 1000) : null
        
        if (resetTime) {
          const waitTime = Math.ceil((resetTime.getTime() - Date.now()) / 1000)
          throw new Error(`Rate limit reached. Please wait ${waitTime} seconds before trying again.`)
        }
        
        throw new Error("Rate limit reached. Please try again later.")
      }
    }
    
    // For any other error, throw it
    throw error
  }
}

// Get recent analyses
export async function getRecentAnalyses(limit = 10) {
  try {
    return recentAnalyses.slice(0, Math.min(limit, recentAnalyses.length))
  } catch (error) {
    console.error("Error getting recent analyses:", error)
    return []
  }
}

// Helper function to normalize sentiment scores
function normalizeScore(score: number): number {
  // Normalize score to a range of 0-1
  const maxScore = 5 // Maximum possible score from AFINN
  const minScore = -5 // Minimum possible score from AFINN
  return (score - minScore) / (maxScore - minScore)
}

