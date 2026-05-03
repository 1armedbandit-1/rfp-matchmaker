'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SeatingChartEditor, { SeatingLayout } from '@/components/seating/SeatingChartEditor'
import { Calendar, MapPin, FileText, Save, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [layout, setLayout] = useState<SeatingLayout | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    event_date: '',
    event_time: '18:00',
    doors_open_time: '17:00',
    venue_name: '',
    venue_address: '',
    venue_city: '',
    venue_state: 'WV',
  })

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setForm((f) => ({ ...f, title, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.event_date) {
      setError('Title and event date are required.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const eventDatetime = `${form.event_date}T${form.event_time}:00`
      const doorsDatetime = `${form.event_date}T${form.doors_open_time}:00`

      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          event_date: eventDatetime,
          doors_open: doorsDatetime,
          seating_chart: layout,
          sections: layout?.sections || [],
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create event')
      }

      const { event } = await res.json()
      router.push(`/admin/events/${event.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSeats = layout?.sections.reduce((sum, s) => sum + s.estimated_seats, 0) ?? 0
  const totalRevenue = layout?.sections.reduce((sum, s) => sum + s.estimated_seats * s.price_cents, 0) ?? 0

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/events" className="flex items-center gap-1 text-sm text-[#6B6B6B] hover:text-[#E63946] mb-3">
          <ChevronLeft size={16} /> Back to Events
        </Link>
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Create New Event</h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Upload your existing seating chart — AI will recreate it automatically.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details */}
        <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-[#E63946]" />
            <h2 className="font-semibold text-[#1A1A1A]">Event Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[#1A1A1A]">Event Title *</label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Real Fight Night 12"
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A1A1A]">URL Slug</label>
              <div className="mt-1 flex rounded-xl border border-[#EAEAEA] overflow-hidden">
                <span className="px-3 py-2.5 bg-[#FAFAF7] text-xs text-[#6B6B6B] border-r border-[#EAEAEA]">realpromo.io/events/</span>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                  placeholder="real-fight-night-12"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A1A1A]">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Main card details, fighters, sanctioning body…"
                className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-[#1A1A1A]">Event Date *</label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1A1A1A]">Start Time</label>
                <input
                  type="time"
                  value={form.event_time}
                  onChange={(e) => setForm((f) => ({ ...f, event_time: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1A1A1A]">Doors Open</label>
                <input
                  type="time"
                  value={form.doors_open_time}
                  onChange={(e) => setForm((f) => ({ ...f, doors_open_time: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Venue */}
        <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-[#E63946]" />
            <h2 className="font-semibold text-[#1A1A1A]">Venue</h2>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-[#1A1A1A]">Venue Name</label>
                <input
                  value={form.venue_name}
                  onChange={(e) => setForm((f) => ({ ...f, venue_name: e.target.value }))}
                  placeholder="Morgantown Marriott"
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1A1A1A]">Address</label>
                <input
                  value={form.venue_address}
                  onChange={(e) => setForm((f) => ({ ...f, venue_address: e.target.value }))}
                  placeholder="1 Waterfront Place"
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="col-span-2 sm:col-span-2">
                <label className="text-sm font-medium text-[#1A1A1A]">City</label>
                <input
                  value={form.venue_city}
                  onChange={(e) => setForm((f) => ({ ...f, venue_city: e.target.value }))}
                  placeholder="Morgantown"
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1A1A1A]">State</label>
                <input
                  value={form.venue_state}
                  onChange={(e) => setForm((f) => ({ ...f, venue_state: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[#EAEAEA] px-4 py-2.5 text-sm focus:border-[#E63946] focus:outline-none focus:ring-1 focus:ring-[#E63946]"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seating Chart */}
        <div className="rounded-2xl bg-white border border-[#EAEAEA] p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={18} className="text-[#E63946]" />
            <h2 className="font-semibold text-[#1A1A1A]">Seating Chart</h2>
          </div>
          <p className="text-xs text-[#6B6B6B] mb-4">
            Upload a screenshot or photo of your existing seating chart. AI reads it and recreates the layout automatically.
            You can then edit section names, prices, and seat counts.
          </p>

          <SeatingChartEditor value={layout} onChange={setLayout} />

          {/* Pricing Summary */}
          {layout && layout.sections.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#FAFAF7] border border-[#EAEAEA]">
              <div className="text-center">
                <p className="text-xl font-bold text-[#1A1A1A]">{totalSeats}</p>
                <p className="text-xs text-[#6B6B6B]">Total Seats</p>
              </div>
              <div className="text-center border-x border-[#EAEAEA]">
                <p className="text-xl font-bold text-[#1A1A1A]">{layout.sections.length}</p>
                <p className="text-xs text-[#6B6B6B]">Sections</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#E63946]">
                  {totalRevenue > 0 ? `$${(totalRevenue / 100).toLocaleString()}` : '—'}
                </p>
                <p className="text-xs text-[#6B6B6B]">Max Revenue</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/events"
            className="px-5 py-2.5 text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#E63946] hover:bg-[#c72d3a] disabled:opacity-50 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
          >
            <Save size={16} />
            {isSubmitting ? 'Creating Event…' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  )
}
