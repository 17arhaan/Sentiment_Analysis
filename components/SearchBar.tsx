import { Search } from "lucide-react"

interface SearchBarProps {
  topic: string
  setTopic: (topic: string) => void
  count: number
  setCount: (count: number) => void
  onSearch: () => void
  loading: boolean
}

export function SearchBar({ topic, setTopic, count, setCount, onSearch, loading }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loading && topic.trim()) {
      onSearch()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic or hashtag..."
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            disabled={loading}
            aria-label="Search topic"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <span>Number of tweets: {count}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            disabled={loading}
            aria-label="Number of tweets"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>10</span>
            <span>100</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>
    </form>
  )
} 