"use server"

import { TwitterApi } from "twitter-api-v2"
import natural from "natural"

// Define types
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
  error?: string
}

// Initialize sentiment analyzer
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn")

// Simple in-memory cache
const cache = new Map<string, {
  data: AnalysisResult,
  timestamp: number
}>()

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Rate limit tracking
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds between requests to stay well within limits

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Validate environment variables
function validateEnvVariables() {
  const requiredVars = [
    'TWITTER_API_KEY',
    'TWITTER_API_SECRET',
    'TWITTER_ACCESS_TOKEN',
    'TWITTER_ACCESS_SECRET'
  ]

  // Debug log for environment variables
  console.log('Checking environment variables...')
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    console.log(`${varName}: ${value ? 'Present' : 'Missing'} (${value?.length || 0} chars)`)
  })

  const missingVars = requiredVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.error('Missing environment variables:', missingVars)
    return {
      error: `Missing required environment variables: ${missingVars.join(', ')}`
    }
  }

  // Check if any of the credentials are empty strings
  const emptyVars = requiredVars.filter(varName => process.env[varName]?.trim() === '')
  if (emptyVars.length > 0) {
    console.error('Empty environment variables:', emptyVars)
    return {
      error: `Empty credentials found for: ${emptyVars.join(', ')}`
    }
  }

  return {
    apiKey: process.env.TWITTER_API_KEY!,
    apiSecret: process.env.TWITTER_API_SECRET!,
    accessToken: process.env.TWITTER_ACCESS_TOKEN!,
    accessSecret: process.env.TWITTER_ACCESS_SECRET!
  }
}

// Server action for sentiment analysis
export async function analyzeSentiment(topic: string, count: number): Promise<AnalysisResult> {
  try {
    // Input validation
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return {
        positive: 0,
        negative: 0,
        neutral: 0,
        tweets: [],
        error: 'Please enter a valid topic'
      }
    }

    if (!count || typeof count !== 'number' || count < 10 || count > 100) {
      return {
        positive: 0,
        negative: 0,
        neutral: 0,
        tweets: [],
        error: 'Tweet count must be between 10 and 100'
      }
    }

    // Check cache first
    const cacheKey = `${topic.toLowerCase()}-${count}`
    const cachedResult = cache.get(cacheKey)
    
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
      return cachedResult.data
    }

    // Validate environment variables
    const credentials = validateEnvVariables()
    if ('error' in credentials) {
      console.error('Environment validation error:', credentials.error)
      return {
        positive: 0,
        negative: 0,
        neutral: 0,
        tweets: [],
        error: 'Twitter API credentials are not properly configured. Please check your environment variables.'
      }
    }

    // Initialize Twitter client with OAuth 2.0
    console.log('Initializing Twitter client...')
    const twitterClient = new TwitterApi({
      appKey: credentials.apiKey,
      appSecret: credentials.apiSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessSecret,
    })

    try {
      // Ensure minimum time between requests
      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTime
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest)
      }

      // Verify credentials
      console.log('Verifying Twitter credentials...')
      const me = await twitterClient.v2.me()
      console.log('Credentials verified successfully for user:', me.data.username)
      lastRequestTime = Date.now()

      // Ensure minimum time between requests
      await delay(MIN_REQUEST_INTERVAL)

      // Search for tweets with pagination
      const query = topic.startsWith("#") 
        ? `${topic} -is:retweet -is:reply lang:en` 
        : `(${topic}) -is:retweet -is:reply lang:en`
      
      console.log('Searching tweets with query:', query)
      const tweets = await twitterClient.v2.search({
        query,
        max_results: Math.min(count, 100), // Ensure we don't exceed 100
        "tweet.fields": ["created_at", "public_metrics", "lang", "entities", "author_id", "text"],
        "user.fields": ["username", "name"],
        "expansions": ["author_id"],
        "place.fields": [],
        "poll.fields": [],
        "media.fields": [],
      })

      lastRequestTime = Date.now()

      // Type assertion for tweets.data
      const tweetData = tweets.data as any[]
      console.log('Search response:', {
        data: tweetData?.length || 0,
        includes: tweets.includes?.users?.length || 0,
        meta: tweets.meta
      })

      if (!tweetData || tweetData.length === 0) {
        return {
          positive: 0,
          negative: 0,
          neutral: 0,
          tweets: [],
          error: `No tweets found for "${topic}". Try a different search term.`
        }
      }

      // Process tweets and analyze sentiment
      const analyzedTweets: Tweet[] = []
      let positiveCount = 0
      let negativeCount = 0
      let neutralCount = 0

      // Create a map of user data
      const userMap = new Map(
        tweets.includes?.users?.map(user => [user.id, user]) || []
      )

      for (const tweet of tweetData) {
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
        return {
          positive: 0,
          negative: 0,
          neutral: 0,
          tweets: [],
          error: `Could not analyze any tweets for "${topic}". Try a different search term.`
        }
      }

      // Calculate percentages
      const total = analyzedTweets.length
      const positive = Math.round((positiveCount / total) * 100)
      const negative = Math.round((negativeCount / total) * 100)
      const neutral = 100 - positive - negative

      const result: AnalysisResult = {
        positive,
        negative,
        neutral,
        tweets: analyzedTweets,
      }

      // Cache the result
      cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      })

      return result

    } catch (error: any) {
      console.error('Twitter API error:', {
        code: error.code,
        message: error.message,
        data: error.data,
        rateLimit: error.rateLimit
      })

      if (error.code === 429) {
        const rateLimit = error.rateLimit
        if (rateLimit?.reset) {
          const waitTime = Math.ceil((rateLimit.reset * 1000 - Date.now()) / 1000)
          return {
            positive: 0,
            negative: 0,
            neutral: 0,
            tweets: [],
            error: `Twitter API rate limit reached. Please try again in ${Math.ceil(waitTime / 60)} minutes.`
          }
        }
      }
      throw error
    }

  } catch (error: any) {
    console.error("Error in sentiment analysis:", error)
    return {
      positive: 0,
      negative: 0,
      neutral: 0,
      tweets: [],
      error: error.message || "Failed to analyze tweets. Please try again."
    }
  }
}

