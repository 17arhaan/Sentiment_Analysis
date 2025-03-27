"use server"

import { TwitterApi } from "twitter-api-v2"
import natural from "natural"

// Initialize sentiment analyzer
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn")

// Cache for storing recent analyses
const analysisCache = new Map<string, {
  data: any,
  timestamp: number
}>()

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const MAX_CACHE_SIZE = 100

// Validate environment variables
function validateEnvVariables() {
  const requiredVars = [
    'TWITTER_API_KEY',
    'TWITTER_API_SECRET',
    'TWITTER_ACCESS_TOKEN',
    'TWITTER_ACCESS_SECRET'
  ]

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }

  return {
    apiKey: process.env.TWITTER_API_KEY!,
    apiSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!
  }
}

// Server action for sentiment analysis
export async function analyzeSentiment(topic: string, count: number) {
  try {
    // Input validation
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      throw new Error('Please enter a valid topic')
    }

    if (!count || typeof count !== 'number' || count < 10 || count > 100) {
      throw new Error('Tweet count must be between 10 and 100')
    }

    // Check cache first
    const cacheKey = `${topic.toLowerCase()}-${count}`
    const cachedResult = analysisCache.get(cacheKey)
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
      return cachedResult.data
    }

    // Validate environment variables
    const credentials = validateEnvVariables()

    // Initialize Twitter client
    const twitterClient = new TwitterApi({
      appKey: credentials.apiKey,
      appSecret: credentials.apiSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessSecret,
    })

    // Verify credentials
    try {
      await twitterClient.v2.me()
    } catch (error) {
      console.error('Twitter API authentication error:', error)
      throw new Error('Failed to authenticate with Twitter API')
    }

    // Search for tweets
    const query = topic.startsWith("#") 
      ? `${topic} -is:retweet -is:reply lang:en` 
      : `(${topic}) -is:retweet -is:reply lang:en`
    
    const tweets = await twitterClient.v2.search({
      query,
      max_results: count,
      "tweet.fields": ["created_at", "public_metrics", "lang", "entities", "author_id", "text"],
      "user.fields": ["username", "name"],
      "expansions": ["author_id"],
    })

    if (!tweets.data || tweets.data.length === 0) {
      throw new Error(`No tweets found for "${topic}". Try a different search term.`)
    }

    // Process tweets and analyze sentiment
    const analyzedTweets = []
    let positiveCount = 0
    let negativeCount = 0
    let neutralCount = 0

    // Create a map of user data
    const userMap = new Map(
      tweets.includes?.users?.map(user => [user.id, user]) || []
    )

    for (const tweet of tweets.data) {
      if (!tweet.text || tweet.lang !== "en") continue

      // Clean tweet text
      const cleanText = tweet.text
        .replace(/https?:\/\/\S+/g, "")
        .replace(/@\w+/g, "")
        .replace(/#\w+/g, "")
        .trim()

      if (cleanText.length < 10) continue

      // Analyze sentiment
      const words = cleanText.toLowerCase().split(/\s+/)
      const score = analyzer.getSentiment(words)
      let sentiment: "positive" | "negative" | "neutral"

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

      const user = userMap.get(tweet.author_id!)

      analyzedTweets.push({
        text: tweet.text,
        sentiment,
        score: (score + 5) / 10, // Normalize score to 0-1 range
        metrics: tweet.public_metrics || {
          retweet_count: 0,
          reply_count: 0,
          like_count: 0,
          quote_count: 0
        },
        createdAt: tweet.created_at!,
        authorId: tweet.author_id!,
        authorName: user?.name || "Unknown User",
        authorUsername: user?.username || "unknown",
      })
    }

    if (analyzedTweets.length === 0) {
      throw new Error(`Could not analyze any tweets for "${topic}". Try a different search term.`)
    }

    // Calculate percentages
    const total = analyzedTweets.length
    const positive = Math.round((positiveCount / total) * 100)
    const negative = Math.round((negativeCount / total) * 100)
    const neutral = 100 - positive - negative

    const result = {
      positive,
      negative,
      neutral,
      tweets: analyzedTweets,
    }

    // Cache the result
    analysisCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    })

    // Trim cache if it gets too large
    if (analysisCache.size > MAX_CACHE_SIZE) {
      const oldestKey = Array.from(analysisCache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0]
      analysisCache.delete(oldestKey)
    }

    return result

  } catch (error: any) {
    console.error("Error in sentiment analysis:", error)

    if (error.code === 429) {
      const rateLimit = error.rateLimit
      if (rateLimit?.reset) {
        const waitTime = Math.ceil((rateLimit.reset * 1000 - Date.now()) / 1000)
        throw new Error(`Twitter API rate limit reached. Please try again in ${Math.ceil(waitTime / 60)} minutes.`)
      }
      throw new Error("Twitter API rate limit reached. Please try again in a few minutes.")
    }

    // Check cache for older results when there's an error
    const cacheKey = `${topic.toLowerCase()}-${count}`
    const cachedResult = analysisCache.get(cacheKey)
    if (cachedResult) {
      return {
        ...cachedResult.data,
        cached: true,
        cacheAge: Math.round((Date.now() - cachedResult.timestamp) / 1000 / 60) // minutes
      }
    }

    // Throw a user-friendly error message
    throw new Error(error.message || "Failed to analyze tweets. Please try again.")
  }
}

