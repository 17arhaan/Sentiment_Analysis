// Environment variable fallbacks to prevent errors
export const getEnvVariable = (key: string, defaultValue = ""): string => {
  // In a real app, you would use process.env[key]
  // Here we're providing fallbacks for removed variables

  if (key === "DATABASE_URL") {
    return "memory://local"
  }

  if (key === "JWT_SECRET") {
    return "dummy-secret-not-used"
  }

  return process.env[key] || defaultValue
}

