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
  }>
}> = []

// Initialize sentiment analyzer with better configuration
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn")

// Server action for sentiment analysis
export async function analyzeSentiment(topic: string, count: number) {
  try {
    if (!topic || !topic.trim()) {
      throw new Error("Topic is required")
    }

    // Ensure count is within valid range
    const tweetCount = Math.min(Math.max(10, count), 100)

    // Initialize Twitter client with environment variables
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY || "",
      appSecret: process.env.TWITTER_API_SECRET || "",
      accessToken: process.env.TWITTER_ACCESS_TOKEN || "",
      accessSecret: process.env.TWITTER_ACCESS_SECRET || "",
    })

    // Check if Twitter credentials are available
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
      throw new Error("Twitter API credentials not found. Please check your environment variables.")
    }

    // Search for tweets with better query construction
    const query = topic.startsWith("#") 
      ? topic 
      : `${topic} -filter:retweets -filter:replies lang:en`
    
    const tweets = await twitterClient.v2.search({
      query,
      max_results: tweetCount,
      "tweet.fields": ["created_at", "public_metrics", "lang", "entities", "author_id"],
    })

    // Process tweets and analyze sentiment
    const analyzedTweets = []
    let positiveCount = 0
    let negativeCount = 0
    let neutralCount = 0

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

        analyzedTweets.push({
          text: tweet.text,
          sentiment,
          score: normalizeScore(score),
          metrics: tweet.public_metrics,
          createdAt: tweet.created_at,
          authorId: tweet.author_id,
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
    throw new Error(error instanceof Error ? error.message : "Failed to analyze sentiment. Please try again.")
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

// Generate mock data for fallback when Twitter API fails
function generateMockData(topic: string, count: number) {
  try {
    // Generate more realistic sentiment distribution
    const positive = Math.floor(Math.random() * 30) + 30 // 30-60%
    const negative = Math.floor(Math.random() * 20) + 10 // 10-30%
    const neutral = 100 - positive - negative

    // Generate sample tweets with more context-aware templates
    const tweets = []

    const generateTweet = (sentiment: string) => {
      const positiveTemplates = [
        `Just discovered ${topic} and I'm blown away! The innovation is incredible.`,
        `${topic} has completely transformed my workflow. Highly recommend!`,
        `The latest updates to ${topic} are game-changing. Love the new features!`,
        `Can't believe how much time ${topic} saves me. Worth every penny.`,
        `If you're not using ${topic}, you're missing out. It's that good!`,
        `The community around ${topic} is amazing. So much support and innovation.`,
        `${topic} is exactly what I've been looking for. Perfect solution!`,
        `After trying everything, ${topic} stands out as the best option.`,
        `The performance of ${topic} is outstanding. No regrets!`,
        `${topic} has exceeded all my expectations. A must-have tool.`,
      ]

      const neutralTemplates = [
        `Been using ${topic} for a while now. It's decent, but has room for improvement.`,
        `${topic} is alright. Some features are great, others need work.`,
        `Mixed feelings about ${topic}. It works, but could be better.`,
        `Not sure if ${topic} is worth the investment. Still testing it out.`,
        `${topic} has potential, but needs more development.`,
        `The basic features of ${topic} are solid, but advanced features are limited.`,
        `${topic} is functional, but the UI could use some polish.`,
        `Still exploring ${topic}. It's okay so far.`,
        `${topic} is a work in progress. Some good, some bad.`,
        `The learning curve for ${topic} is moderate. Getting there.`,
      ]

      const negativeTemplates = [
        `Disappointed with ${topic}. Expected much better performance.`,
        `${topic} is frustrating to use. Too many bugs and issues.`,
        `Waste of time with ${topic}. Not worth the effort.`,
        `The customer support for ${topic} is terrible. Avoid if possible.`,
        `${topic} keeps crashing. Very unreliable.`,
        `Regret purchasing ${topic}. Poor value for money.`,
        `The documentation for ${topic} is outdated and confusing.`,
        `${topic} is overhyped. Doesn't deliver on promises.`,
        `Constant issues with ${topic}. Looking for alternatives.`,
        `The updates to ${topic} have made it worse. Very disappointing.`,
      ]

      let templates
      let score
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random time in last week

      switch (sentiment) {
        case "positive":
          templates = positiveTemplates
          score = 0.7 + Math.random() * 0.3 // 0.7-1.0
          break
        case "negative":
          templates = negativeTemplates
          score = Math.random() * 0.3 // 0.0-0.3
          break
        default:
          templates = neutralTemplates
          score = 0.3 + Math.random() * 0.4 // 0.3-0.7
      }

      return {
        text: templates[Math.floor(Math.random() * templates.length)],
        sentiment,
        score,
        createdAt: timestamp,
        metrics: {
          retweet_count: Math.floor(Math.random() * 100),
          reply_count: Math.floor(Math.random() * 50),
          like_count: Math.floor(Math.random() * 200),
          quote_count: Math.floor(Math.random() * 30),
        },
      }
    }

    for (let i = 0; i < count; i++) {
      const random = Math.random() * 100
      let sentiment

      if (random < positive) {
        sentiment = "positive"
      } else if (random < positive + negative) {
        sentiment = "negative"
      } else {
        sentiment = "neutral"
      }

      tweets.push(generateTweet(sentiment))
    }

    // Create mock analysis object
    const newAnalysis = {
      id: Date.now().toString(),
      topic,
      timestamp: new Date().toISOString(),
      sentiment:
        positive > negative && positive > neutral
          ? "positive"
          : negative > positive && negative > neutral
            ? "negative"
            : "neutral",
      positive,
      negative,
      neutral,
      tweets,
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
      tweets,
    }
  } catch (error) {
    console.error("Error generating mock data:", error)
    // Return minimal fallback data
    return {
      positive: 33,
      negative: 33,
      neutral: 34,
      tweets: [
        {
          text: `Sample tweet about ${topic}`,
          sentiment: "neutral",
          score: 0.5,
          createdAt: new Date().toISOString(),
          metrics: {
            retweet_count: 0,
            reply_count: 0,
            like_count: 0,
            quote_count: 0,
          },
        },
      ],
    }
  }
}

