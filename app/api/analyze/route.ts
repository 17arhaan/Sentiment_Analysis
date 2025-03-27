import { type NextRequest, NextResponse } from "next/server"

// This API route is kept for future use with Python integration
// The main functionality now runs directly in the server action

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch((error) => {
      console.error("Error parsing request body:", error)
      return null
    })

    if (!body || !body.topic || !body.count) {
      return NextResponse.json({ error: "Topic and count are required" }, { status: 400 })
    }

    const { topic, count } = body

    // Generate random sentiment distribution
    const positive = Math.floor(Math.random() * 40) + 20 // 20-60%
    const negative = Math.floor(Math.random() * 30) + 10 // 10-40%
    const neutral = 100 - positive - negative

    // Generate tweets
    const tweets = []

    for (let i = 0; i < count; i++) {
      const random = Math.random() * 100
      let sentiment
      let score

      if (random < positive) {
        sentiment = "positive"
        score = 0.7 + Math.random() * 0.3 // 0.7-1.0
      } else if (random < positive + negative) {
        sentiment = "negative"
        score = Math.random() * 0.3 // 0.0-0.3
      } else {
        sentiment = "neutral"
        score = 0.3 + Math.random() * 0.4 // 0.3-0.7
      }

      tweets.push({
        text: generateTweet(topic, sentiment),
        sentiment,
        score,
      })
    }

    return NextResponse.json({
      positive,
      negative,
      neutral,
      tweets,
    })
  } catch (error) {
    console.error("Error in sentiment analysis API route:", error)
    return NextResponse.json(
      { error: "Failed to analyze sentiment", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

// Helper function to generate a tweet with the given sentiment
function generateTweet(topic: string, sentiment: string): string {
  const positiveTemplates = [
    `I'm really impressed with ${topic}! It's exceeded all my expectations.`,
    `${topic} is absolutely amazing! Can't recommend it enough.`,
    `Just had a great experience with ${topic}. So happy!`,
    `${topic} is a game-changer. Love what they're doing.`,
    `The latest developments in ${topic} are incredible. #excited`,
  ]

  const neutralTemplates = [
    `${topic} seems okay. Not great, not terrible.`,
    `I've been using ${topic} for a while. It's alright.`,
    `Not sure what to think about ${topic} yet. Need more time.`,
    `${topic} has some interesting features, but also some drawbacks.`,
    `Anyone else have thoughts on ${topic}? I'm on the fence.`,
  ]

  const negativeTemplates = [
    `${topic} is disappointing. Expected much better.`,
    `I'm frustrated with ${topic}. So many issues to fix.`,
    `Avoid ${topic} if you can. Not worth the trouble.`,
    `${topic} has really gone downhill lately. Sad to see.`,
    `Can't believe how bad my experience with ${topic} was. #avoid`,
  ]

  let templates
  switch (sentiment) {
    case "positive":
      templates = positiveTemplates
      break
    case "negative":
      templates = negativeTemplates
      break
    default:
      templates = neutralTemplates
  }

  return templates[Math.floor(Math.random() * templates.length)]
}

