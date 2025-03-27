interface SentimentChartProps {
  positive: number
  negative: number
  neutral: number
}

export function SentimentChart({ positive, negative, neutral }: SentimentChartProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Sentiment Distribution</h3>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400"
              style={{ width: `${positive}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-green-400">Positive</span>
            <span className="text-green-400 font-medium">{positive}%</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-400"
              style={{ width: `${negative}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-red-400">Negative</span>
            <span className="text-red-400 font-medium">{negative}%</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gray-500 to-gray-400"
              style={{ width: `${neutral}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-400">Neutral</span>
            <span className="text-gray-400 font-medium">{neutral}%</span>
          </div>
        </div>
      </div>
    </div>
  )
} 