import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SeatSelector from '@/components/seating/SeatSelector'
import { Calendar, MapPin, Clock } from 'lucide-react'

interface PageProps {
  params: { slug: string }
}

export default async function EventPage({ params }: PageProps) {
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      venues (name, address, city, state),
      venue_sections (
        id, name, section_type, color, capacity, price_cents, sort_order,
        svg_x, svg_y, svg_width, svg_height
      )
    `)
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()

  if (!event) notFound()

  const { data: { session } } = await supabase.auth.getSession()

  // Count available seats per section
  const sectionIds = event.venue_sections?.map((s: { id: string }) => s.id) || []
  const seatCounts: Record<string, number> = {}
  if (sectionIds.length > 0) {
    const { data: counts } = await supabase
      .from('seats')
      .select('section_id')
      .in('section_id', sectionIds)
      .eq('status', 'available')

    counts?.forEach((row: { section_id: string }) => {
      seatCounts[row.section_id] = (seatCounts[row.section_id] || 0) + 1
    })
  }

  const eventDate = new Date(event.event_date)
  const doorsOpen = event.doors_open ? new Date(event.doors_open) : null

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Event Hero */}
      <div className="bg-gradient-to-b from-[#1a0000] to-[#0a0a0a] px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-[#E63946] text-xs font-bold uppercase tracking-widest mb-2">
            {event.venues?.city}, {event.venues?.state}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">{event.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#E63946]" />
              {eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-[#E63946]" />
              {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              {doorsOpen && ` · Doors ${doorsOpen.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
            </div>
            {event.venues?.name && (
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#E63946]" />
                {event.venues.name}
                {event.venues.address && ` · ${event.venues.address}`}
              </div>
            )}
          </div>

          {event.description && (
            <p className="mt-4 text-gray-400 text-sm max-w-2xl">{event.description}</p>
          )}
        </div>
      </div>

      {/* Seat Selector */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <SeatSelector
          event={event}
          sections={event.venue_sections || []}
          seatCounts={seatCounts}
          currentUserId={session?.user?.id || null}
          userEmail={session?.user?.email || ''}
        />
      </div>
    </div>
  )
}
