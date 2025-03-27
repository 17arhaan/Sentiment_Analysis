import { MessageSquare, ThumbsUp, Repeat2, Share } from "lucide-react"

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
  authorName: string
  authorUsername: string
}

interface TweetListProps {
  tweets: Tweet[]
}

export function TweetList({ tweets }: TweetListProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-400"
      case "negative":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800">
        <h3 className="text-xl font-semibold text-white">Analyzed Tweets</h3>
      </div>
      <div className="divide-y divide-zinc-800">
        {tweets.map((tweet, index) => (
          <div key={index} className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-white">{tweet.authorName}</span>
                  <span className="text-zinc-500">@{tweet.authorUsername}</span>
                  <span className="text-zinc-500">·</span>
                  <span className="text-zinc-500">{formatDate(tweet.createdAt)}</span>
                </div>
                <p className="text-zinc-300 mb-4">{tweet.text}</p>
                <div className="flex items-center gap-6 text-zinc-500">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    <span>{tweet.metrics.reply_count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Repeat2 size={18} />
                    <span>{tweet.metrics.retweet_count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp size={18} />
                    <span>{tweet.metrics.like_count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share size={18} />
                    <span>{tweet.metrics.quote_count}</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full border ${getSentimentColor(tweet.sentiment)} border-current`}>
                <span className="text-sm font-medium capitalize">{tweet.sentiment}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 