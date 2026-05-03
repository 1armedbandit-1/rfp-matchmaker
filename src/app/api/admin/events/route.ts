import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title, slug, description, event_date, doors_open,
      venue_name, venue_address, venue_city, venue_state,
      seating_chart, sections = [],
    } = body

    if (!title || !event_date) {
      return NextResponse.json({ error: 'Title and event_date are required' }, { status: 400 })
    }

    // 1. Upsert venue if provided
    let venue_id: string | null = null
    if (venue_name) {
      const { data: venue, error: venueErr } = await supabase
        .from('venues')
        .insert({ name: venue_name, address: venue_address, city: venue_city, state: venue_state, created_by: session.user.id })
        .select('id')
        .single()

      if (venueErr) throw venueErr
      venue_id = venue.id
    }

    // 2. Create event
    const { data: event, error: eventErr } = await supabase
      .from('events')
      .insert({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        event_date,
        doors_open,
        venue_id,
        promoter_id: session.user.id,
        seating_chart,
        is_published: false,
      })
      .select('id, slug')
      .single()

    if (eventErr) throw eventErr

    // 3. Insert sections
    if (sections.length > 0) {
      const sectionRows = sections.map((s: {
        name: string
        type: string
        color: string
        estimated_seats: number
        price_cents: number
        description: string
        svg_x: number
        svg_y: number
        svg_width: number
        svg_height: number
      }, i: number) => ({
        event_id: event.id,
        name: s.name,
        section_type: s.type,
        color: s.color,
        capacity: s.estimated_seats,
        price_cents: s.price_cents || 0,
        sort_order: i,
        svg_x: s.svg_x,
        svg_y: s.svg_y,
        svg_width: s.svg_width,
        svg_height: s.svg_height,
      }))

      const { error: sectionsErr } = await supabase
        .from('venue_sections')
        .insert(sectionRows)

      if (sectionsErr) throw sectionsErr
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: events, error } = await supabase
      .from('events')
      .select(`
        id, title, slug, event_date, is_published, created_at,
        venues (name, city, state)
      `)
      .eq('promoter_id', session.user.id)
      .order('event_date', { ascending: false })

    if (error) throw error

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Fetch events error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}
