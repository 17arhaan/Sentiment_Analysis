import { type NextRequest, NextResponse } from "next/server"
import { getRecentAnalyses } from "@/lib/analyze-sentiment"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    let limit = 10

    try {
      const limitParam = searchParams.get("limit")
      if (limitParam) {
        limit = Math.min(Math.max(1, Number.parseInt(limitParam, 10)), 20)
      }
    } catch (e) {
      console.error("Error parsing limit parameter:", e)
      // Default to 10 if parsing fails
    }

    const analyses = await getRecentAnalyses(limit)

    return NextResponse.json(analyses || [])
  } catch (error) {
    console.error("Error fetching analyses:", error)
    // Return empty array instead of error to prevent rendering issues
    return NextResponse.json([])
  }
}

