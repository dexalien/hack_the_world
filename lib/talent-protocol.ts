// Talent Protocol API v3 client-side integration
// All API calls are proxied through our secure server-side endpoint

export interface TalentProfile {
  talent_id: string
  wallet_address: string
  display_name?: string
  bio?: string
  verified?: boolean
  human_checkmark?: boolean
  tags?: string[]
}

export interface BuilderScore {
  score: number
  percentile?: number
}

/**
 * Fetch a user's Talent Protocol profile
 * @param identifier - The wallet address, talent ID, or account identifier (e.g., farcaster:username)
 * @returns Talent Protocol profile data
 */
export async function fetchTalentProfile(identifier: string): Promise<TalentProfile | null> {
  try {
    console.log("[v0] Fetching Talent Protocol profile for:", identifier)

    const response = await fetch(`/api/talent-protocol?identifier=${encodeURIComponent(identifier)}&action=profile`)

    console.log("[v0] API Response status:", response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] API Error:", errorData)
      throw new Error(errorData.error || "Failed to fetch profile")
    }

    const data = await response.json()
    console.log("[v0] Profile data received:", data)
    return data.profile || data
  } catch (error) {
    console.error("Error fetching Talent Protocol profile:", error)
    return null
  }
}

/**
 * Get builder score for a profile
 * @param identifier - The wallet address, talent ID, or account identifier
 * @returns Builder score data
 */
export async function getBuilderScore(identifier: string): Promise<BuilderScore | null> {
  try {
    const response = await fetch(`/api/talent-protocol?identifier=${encodeURIComponent(identifier)}&action=score`)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Score API Error:", errorData)
      throw new Error(errorData.error || "Failed to fetch score")
    }

    const data = await response.json()
    return data.score || data
  } catch (error) {
    console.error("Error fetching builder score:", error)
    return null
  }
}

/**
 * Get Talent Protocol credentials for a profile
 * @param identifier - The wallet address, talent ID, or account identifier
 * @returns User credentials from Talent Protocol
 */
export async function getTalentCredentials(identifier: string) {
  try {
    const response = await fetch(`/api/talent-protocol?identifier=${encodeURIComponent(identifier)}&action=credentials`)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("[v0] Credentials API Error:", errorData)
      throw new Error(errorData.error || "Failed to fetch credentials")
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching Talent Protocol credentials:", error)
    return null
  }
}
