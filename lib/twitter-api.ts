import { TwitterApi } from "twitter-api-v2"
import natural from "natural"
import { analysisStore } from "./memory-store"
import { getEnvVariable } from "./env"

// Initialize Twitter client
const twitterClient = new TwitterApi({
  appKey: getEnvVariable("TWITTER_API_KEY", ""),
  appSecret: getEnvVariable("TWITTER_API_SECRET", ""),
  accessToken: getEnvVariable("TWITTER_ACCESS_TOKEN", ""),
  accessSecret: getEnvVariable("TWITTER_ACCESS_SECRET", ""),
})

// Initialize sentiment analyzer
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn")

export async function analyzeTweets(topic: string, count: number) {
  try {
    // Ensure count is within limits
    const tweetCount = Math.min(Math.max(10, count), 100)

    // Search for tweets
    const query = topic.startsWith("#") ? topic : `${topic} -filter:retweets`
    const tweets = await twitterClient.v2.search({
      query,
      max_results: tweetCount,
      "tweet.fields": ["created_at", "public_metrics", "lang"],
    })

    // Process tweets and analyze sentiment
    const analyzedTweets = []
    let positiveCount = 0
    let negativeCount = 0
    let neutralCount = 0

    for (const tweet of tweets.data.data || []) {
      if (tweet.text && tweet.lang === "en") {
        const score = analyzer.getSentiment(tweet.text.split(" "))
        let sentiment

        if (score > 0.2) {
          sentiment = "positive"
          positiveCount++
        } else if (score < -0.2) {
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
        })
      }
    }

    // Calculate percentages
    const total = analyzedTweets.length || 1 // Avoid division by zero
    const positive = Math.round((positiveCount / total) * 100)
    const negative = Math.round((negativeCount / total) * 100)
    const neutral = 100 - positive - negative

    // Determine overall sentiment
    let overallSentiment
    if (positive > negative && positive > neutral) {
      overallSentiment = "positive"
    } else if (negative > positive && negative > neutral) {
      overallSentiment = "negative"
    } else {
      overallSentiment = "neutral"
    }

    // Save analysis to in-memory store
    if (analyzedTweets.length > 0) {
      analysisStore.addAnalysis({
        topic,
        timestamp: new Date().toISOString(),
        sentiment: overallSentiment,
        positive,
        negative,
        neutral,
        tweets: analyzedTweets,
      })
    }

    return {
      positive,
      negative,
      neutral,
      tweets: analyzedTweets,
    }
  } catch (error) {
    console.error("Error analyzing tweets:", error)
    throw new Error("Failed to analyze tweets. Please try again.")
  }
}

// Helper function to normalize sentiment scores to 0-1 range
function normalizeScore(score: number): number {
  // AFINN scores typically range from -5 to 5
  // Normalize to 0-1 range
  return (score + 5) / 10
}

