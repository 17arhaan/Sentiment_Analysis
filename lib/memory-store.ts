// Simple in-memory storage for analyses that persists until page refresh
// This is a server-side singleton that will be shared across requests

type Analysis = {
  id: string
  topic: string
  timestamp: string
  sentiment: "positive" | "negative" | "neutral"
  positive: number
  negative: number
  neutral: number
  tweets: any[]
}

class AnalysisStore {
  private analyses: Analysis[] = []

  addAnalysis(analysis: Omit<Analysis, "id">) {
    const newAnalysis = {
      ...analysis,
      id: Date.now().toString(),
    }

    this.analyses.unshift(newAnalysis) // Add to beginning of array

    // Keep only the most recent 10 analyses
    if (this.analyses.length > 10) {
      this.analyses = this.analyses.slice(0, 10)
    }

    return newAnalysis
  }

  getRecentAnalyses(limit = 10) {
    return this.analyses.slice(0, limit)
  }
}

// Create a singleton instance
export const analysisStore = new AnalysisStore()

