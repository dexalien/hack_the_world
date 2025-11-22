import { type NextRequest, NextResponse } from "next/server"

const TALENT_API_BASE_URL = "https://api.talentprotocol.com"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const identifier = searchParams.get("identifier")
    const action = searchParams.get("action") || "profile"

    const apiKey = process.env.TALENT_PROTOCOL_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Talent Protocol API key not configured" }, { status: 500 })
    }

    if (!identifier) {
      return NextResponse.json({ error: "Identifier parameter is required" }, { status: 400 })
    }

    // The /profile endpoint requires a profile UUID, not an identifier like ENS or wallet
    const query = {
      identity: identifier,
      exactMatch: true,
    }

    const sort = {
      score: { order: "desc" },
      id: { order: "desc" },
    }

    // Build URL with encoded query parameters
    const queryString = `query=${encodeURIComponent(JSON.stringify(query))}&sort=${encodeURIComponent(JSON.stringify(sort))}&page=1&per_page=1`
    const url = `${TALENT_API_BASE_URL}/search/advanced/profiles?${queryString}`

    console.log("[v0] Fetching from Talent Protocol:", url)

    const response = await fetch(url, {
      headers: {
        "X-API-KEY": apiKey,
        Accept: "application/json",
      },
    })

    console.log("[v0] API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API Error:", errorText)
      return NextResponse.json(
        { error: `Talent Protocol API error: ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("[v0] Data received from Talent Protocol")

    // Extract the first profile from the search results
    if (data.profiles && data.profiles.length > 0) {
      const profile = data.profiles[0]

      // Based on action, fetch additional data if needed
      if (action === "score" && profile.profile_id) {
        const scoreUrl = `${TALENT_API_BASE_URL}/score?profile_id=${profile.profile_id}&scorer_slug=builder_score`
        const scoreResponse = await fetch(scoreUrl, {
          headers: {
            "X-API-KEY": apiKey,
            Accept: "application/json",
          },
        })

        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json()
          return NextResponse.json(scoreData)
        }
      }

      if (action === "credentials" && profile.profile_id) {
        const credentialsUrl = `${TALENT_API_BASE_URL}/credentials?profile_id=${profile.profile_id}`
        const credentialsResponse = await fetch(credentialsUrl, {
          headers: {
            "X-API-KEY": apiKey,
            Accept: "application/json",
          },
        })

        if (credentialsResponse.ok) {
          const credentialsData = await credentialsResponse.json()
          return NextResponse.json(credentialsData)
        }
      }

      // Return the profile data
      return NextResponse.json(profile)
    } else {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("[v0] Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
