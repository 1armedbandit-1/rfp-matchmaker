import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function findMatches(
  requester: any,
  candidates: any[],
  additionalContext?: string
): Promise<{ user_id: string; score: number; reasoning: string }[]> {
  const prompt = `You are a combat sports matchmaker helping people in the Real Fight Matchmaker community find relevant connections.

Given the profile of a person seeking connections and a list of candidate profiles, return the top matches ranked by fit.

Consider:
- Are their "looking for" needs complementary? (e.g., fighter wants manager + manager wants fighters)
- Geographic proximity (same state/region preferred, then within 500 miles)
- Discipline alignment (a boxing manager isn't ideal for an MMA fighter unless they handle both)
- Weight class compatibility (for fighter-to-fighter sparring/fight matchups)
- Experience level alignment (don't pair a 0-0 amateur with a high-level manager)
- Overall profile compatibility

${additionalContext ? `Additional context from the requester: "${additionalContext}"` : ''}

Return ONLY valid JSON in this exact format:
{
  "matches": [
    {
      "user_id": "uuid-here",
      "score": 85,
      "reasoning": "2-3 sentence explanation of why this is a strong fit for the requester"
    }
  ]
}

Return between 5-10 matches maximum, only those with score >= 40.

Requester profile:
${JSON.stringify(requester, null, 2)}

Candidate profiles:
${JSON.stringify(candidates, null, 2)}`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Unexpected response type')

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in response')

  const parsed = JSON.parse(jsonMatch[0])
  return parsed.matches || []
}
