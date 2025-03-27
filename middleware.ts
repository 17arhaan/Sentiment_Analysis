import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Add the app URL to the request for API calls
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-url", request.nextUrl.origin)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

