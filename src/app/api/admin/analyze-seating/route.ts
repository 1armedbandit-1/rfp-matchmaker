import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mediaType = (file.type || 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            {
              type: 'text',
              text: `You are a seating chart analyzer for a combat sports ticketing platform.

Analyze this seating chart image and return a JSON object describing the layout.
The venue is typically a boxing/MMA event at a hotel ballroom, arena, or convention center.

Return ONLY valid JSON (no markdown, no explanation) in this exact format:

{
  "venue_name": "string or null",
  "estimated_capacity": number,
  "sections": [
    {
      "name": "string",
      "type": "general|ringside|vip|table|standing|other",
      "color": "#hex",
      "estimated_seats": number,
      "rows": number or null,
      "seats_per_row": number or null,
      "description": "brief description of location",
      "svg_x": number (0-1000 relative position),
      "svg_y": number (0-800 relative position),
      "svg_width": number,
      "svg_height": number
    }
  ]
}

Color guide:
- VIP / ringside front row: #FFD700 (gold)
- Ringside / premium: #E63946 (red)
- Tables: #FF8C00 (orange)
- General admission: #4A90D9 (blue)
- Standing room: #6B6B6B (gray)
- Other: #7B2D8B (purple)

Identify every distinct section you see. Use the spatial positions from the image to set svg_x, svg_y, svg_width, svg_height values that recreate the approximate layout on a 1000x800 canvas.`,
            },
          ],
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Strip any markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const layout = JSON.parse(cleaned)

    return NextResponse.json({ layout })
  } catch (error) {
    console.error('Seating chart analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze seating chart' },
      { status: 500 }
    )
  }
}
