import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // We no longer store recent analyses, so return an empty array
  return NextResponse.json([])
}

