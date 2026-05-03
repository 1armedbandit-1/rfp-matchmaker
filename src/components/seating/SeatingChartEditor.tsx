'use client'

import { useState, useRef } from 'react'
import { Upload, Loader2, Plus, Trash2, RefreshCw } from 'lucide-react'

export interface SeatSection {
  id: string
  name: string
  type: 'general' | 'ringside' | 'vip' | 'table' | 'standing' | 'other'
  color: string
  estimated_seats: number
  rows: number | null
  seats_per_row: number | null
  description: string
  svg_x: number
  svg_y: number
  svg_width: number
  svg_height: number
  price_cents: number
}

export interface SeatingLayout {
  venue_name: string | null
  estimated_capacity: number
  sections: SeatSection[]
}

interface SeatingChartEditorProps {
  value: SeatingLayout | null
  onChange: (layout: SeatingLayout) => void
}

const SECTION_TYPES = ['general', 'ringside', 'vip', 'table', 'standing', 'other'] as const
const DEFAULT_COLORS: Record<string, string> = {
  vip: '#FFD700',
  ringside: '#E63946',
  table: '#FF8C00',
  general: '#4A90D9',
  standing: '#6B6B6B',
  other: '#7B2D8B',
}

export default function SeatingChartEditor({ value, onChange }: SeatingChartEditorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPreviewUrl(URL.createObjectURL(file))
    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/admin/analyze-seating', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Analysis failed')
      const { layout } = await res.json()

      // Add IDs and default prices to sections
      const sections = layout.sections.map((s: SeatSection, i: number) => ({
        ...s,
        id: `section-${i}-${Date.now()}`,
        price_cents: s.price_cents ?? 0,
        color: s.color || DEFAULT_COLORS[s.type] || '#4A90D9',
      }))

      onChange({ ...layout, sections })
    } catch (err) {
      setError('Could not analyze the image. Please try again or add sections manually.')
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const addSection = () => {
    const newSection: SeatSection = {
      id: `section-new-${Date.now()}`,
      name: 'New Section',
      type: 'general',
      color: '#4A90D9',
      estimated_seats: 50,
      rows: 5,
      seats_per_row: 10,
      description: '',
      svg_x: 100,
      svg_y: 100,
      svg_width: 200,
      svg_height: 80,
      price_cents: 0,
    }
    const current = value || { venue_name: null, estimated_capacity: 0, sections: [] }
    onChange({ ...current, sections: [...current.sections, newSection] })
    setSelectedSection(newSection.id)
  }

  const updateSection = (id: string, updates: Partial<SeatSection>) => {
    if (!value) return
    onChange({
      ...value,
      sections: value.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })
  }

  const deleteSection = (id: string) => {
    if (!value) return
    onChange({ ...value, sections: value.sections.filter((s) => s.id !== id) })
    if (selectedSection === id) setSelectedSection(null)
  }

  const selected = value?.sections.find((s) => s.id === selectedSection)

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#EAEAEA] rounded-xl p-6 text-center cursor-pointer hover:border-[#E63946] transition-colors bg-[#FAFAF7]"
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={32} className="animate-spin text-[#E63946]" />
            <p className="text-sm font-medium text-[#1A1A1A]">AI is analyzing your seating chart…</p>
            <p className="text-xs text-[#6B6B6B]">This takes about 10–15 seconds</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={28} className="text-[#6B6B6B]" />
            <p className="text-sm font-semibold text-[#1A1A1A]">Upload existing seating chart</p>
            <p className="text-xs text-[#6B6B6B]">AI will automatically recreate the layout • PNG, JPG, screenshot</p>
          </div>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</div>
      )}

      {/* SVG Preview */}
      {value && value.sections.length > 0 && (
        <div className="rounded-xl border border-[#EAEAEA] overflow-hidden bg-[#111]">
          <div className="px-4 py-2 bg-[#1A1A1A] flex items-center justify-between">
            <span className="text-xs text-white font-medium uppercase tracking-wider">Chart Preview</span>
            <span className="text-xs text-[#6B6B6B]">~{value.estimated_capacity} total seats</span>
          </div>
          <svg viewBox="0 0 1000 600" className="w-full" style={{ background: '#111' }}>
            {/* Ring/stage indicator */}
            <ellipse cx="500" cy="300" rx="90" ry="70" fill="#2a2a2a" stroke="#444" strokeWidth="2" />
            <text x="500" y="305" textAnchor="middle" fill="#666" fontSize="12" fontWeight="bold">RING</text>

            {value.sections.map((section) => (
              <g
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={section.svg_x}
                  y={section.svg_y}
                  width={section.svg_width}
                  height={section.svg_height}
                  rx="6"
                  fill={section.color}
                  fillOpacity={selectedSection === section.id ? 0.9 : 0.7}
                  stroke={selectedSection === section.id ? '#fff' : section.color}
                  strokeWidth={selectedSection === section.id ? 2 : 0}
                />
                <text
                  x={section.svg_x + section.svg_width / 2}
                  y={section.svg_y + section.svg_height / 2 - 4}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {section.name}
                </text>
                <text
                  x={section.svg_x + section.svg_width / 2}
                  y={section.svg_y + section.svg_height / 2 + 10}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="9"
                  opacity={0.8}
                >
                  {section.estimated_seats} seats
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Section List + Editor */}
      {value && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Section list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-[#1A1A1A]">Sections</span>
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-1 text-xs text-[#E63946] hover:underline font-medium"
              >
                <Plus size={14} /> Add Section
              </button>
            </div>
            {value.sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer border transition-colors ${
                  selectedSection === section.id
                    ? 'border-[#E63946] bg-red-50'
                    : 'border-[#EAEAEA] bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: section.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] truncate">{section.name}</p>
                  <p className="text-xs text-[#6B6B6B]">
                    {section.estimated_seats} seats ·{' '}
                    {section.price_cents > 0 ? `$${(section.price_cents / 100).toFixed(0)}` : 'Price TBD'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); deleteSection(section.id) }}
                  className="text-[#6B6B6B] hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Section editor */}
          {selected && (
            <div className="border border-[#EAEAEA] rounded-xl p-4 bg-white space-y-3">
              <p className="text-sm font-semibold text-[#1A1A1A]">Edit: {selected.name}</p>

              <div>
                <label className="text-xs text-[#6B6B6B] font-medium">Section Name</label>
                <input
                  value={selected.name}
                  onChange={(e) => updateSection(selected.id, { name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#EAEAEA] px-3 py-1.5 text-sm focus:border-[#E63946] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#6B6B6B] font-medium">Type</label>
                  <select
                    value={selected.type}
                    onChange={(e) => {
                      const type = e.target.value as SeatSection['type']
                      updateSection(selected.id, { type, color: DEFAULT_COLORS[type] || selected.color })
                    }}
                    className="mt-1 w-full rounded-lg border border-[#EAEAEA] px-3 py-1.5 text-sm focus:border-[#E63946] focus:outline-none"
                  >
                    {SECTION_TYPES.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#6B6B6B] font-medium">Color</label>
                  <input
                    type="color"
                    value={selected.color}
                    onChange={(e) => updateSection(selected.id, { color: e.target.value })}
                    className="mt-1 w-full h-9 rounded-lg border border-[#EAEAEA] cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#6B6B6B] font-medium">Seats</label>
                  <input
                    type="number"
                    value={selected.estimated_seats}
                    onChange={(e) => updateSection(selected.id, { estimated_seats: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-[#EAEAEA] px-3 py-1.5 text-sm focus:border-[#E63946] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#6B6B6B] font-medium">Price ($)</label>
                  <input
                    type="number"
                    value={selected.price_cents / 100}
                    onChange={(e) => updateSection(selected.id, { price_cents: Math.round(Number(e.target.value) * 100) })}
                    className="mt-1 w-full rounded-lg border border-[#EAEAEA] px-3 py-1.5 text-sm focus:border-[#E63946] focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#6B6B6B] font-medium">Description</label>
                <input
                  value={selected.description}
                  onChange={(e) => updateSection(selected.id, { description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#EAEAEA] px-3 py-1.5 text-sm focus:border-[#E63946] focus:outline-none"
                  placeholder="e.g. Front row next to ring"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Re-analyze */}
      {previewUrl && value && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 text-xs text-[#6B6B6B] hover:text-[#E63946] transition-colors"
        >
          <RefreshCw size={13} /> Re-analyze with different image
        </button>
      )}
    </div>
  )
}
