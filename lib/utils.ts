import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get the app URL from environment or request headers
export function getAppUrl(headers?: Headers): string {
  // First try to get from environment variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  // Then try to get from request headers
  if (headers && headers.get("x-url")) {
    return headers.get("x-url") as string
  }

  // Fallback to localhost in development
  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : ""
}

