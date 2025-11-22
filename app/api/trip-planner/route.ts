import { generateText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, city, teamSize } = await req.json()

  const systemPrompt = `You are a helpful AI travel assistant specializing in planning hacker house trips and accommodations. 
You're currently helping plan a trip to ${city} for a team of ${teamSize} people.

Your expertise includes:
- Finding affordable accommodations (Airbnbs, co-living spaces, hacker houses)
- Suggesting coworking spaces and tech hubs
- Recommending local tech events and meetups
- Providing budget estimates for accommodations and living costs
- Suggesting team bonding activities and local attractions
- Transportation and logistics advice
- Visa and documentation requirements if needed

Be specific, practical, and provide actionable recommendations. Include price estimates when relevant.
Keep responses concise but informative. Use a friendly, tech-savvy tone.`

  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    maxOutputTokens: 2000,
    temperature: 0.7,
  })

  return Response.json({ text })
}
