interface Analysis {
  id: string
  topic: string
  timestamp: string
  sentiment: "positive" | "negative" | "neutral"
  positive: number
  negative: number
  neutral: number
}

interface RecentAnalysesProps {
  analyses?: Analysis[]
}

export function RecentAnalyses({ analyses = [] }: RecentAnalysesProps) {
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
      hour: "numeric",
      minute: "numeric",
    })
  }

  if (analyses.length === 0) {
    return (
      <div className="p-6 text-center text-zinc-500">
        No recent analyses yet
      </div>
    )
  }

  return (
    <div className="divide-y divide-zinc-800">
      {analyses.map((analysis) => (
        <div key={analysis.id} className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-white">{analysis.topic}</h4>
            <span className={`px-2 py-0.5 rounded-full text-sm ${getSentimentColor(analysis.sentiment)} border border-current`}>
              {analysis.sentiment}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <div className="flex items-center gap-1">
              <span className="text-green-400">{analysis.positive}%</span>
              <span>positive</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-400">{analysis.negative}%</span>
              <span>negative</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">{analysis.neutral}%</span>
              <span>neutral</span>
            </div>
          </div>
          <div className="mt-2 text-sm text-zinc-500">
            {formatDate(analysis.timestamp)}
          </div>
        </div>
      ))}
    </div>
  )
} 