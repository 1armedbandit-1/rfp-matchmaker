'use client'

import { useState } from 'react'
import { ShoppingCart, X, Ticket, Lock } from 'lucide-react'

interface Section {
  id: string
  name: string
  section_type: string
  color: string
  capacity: number
  price_cents: number
  sort_order: number
  svg_x: number
  svg_y: number
  svg_width: number
  svg_height: number
}

interface CartItem {
  section: Section
  quantity: number
}

interface SeatSelectorProps {
  event: { id: string; title: string; slug: string }
  sections: Section[]
  seatCounts: Record<string, number>
  currentUserId: string | null
  userEmail: string
}

export default function SeatSelector({
  event,
  sections,
  seatCounts,
  currentUserId,
  userEmail,
}: SeatSelectorProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [buyerEmail, setBuyerEmail] = useState(userEmail)
  const [buyerName, setBuyerName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')

  const addToCart = (section: Section, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.section.id === section.id)
      if (existing) {
        return prev.map((i) =>
          i.section.id === section.id ? { ...i, quantity: i.quantity + qty } : i
        )
      }
      return [...prev, { section, quantity: qty }]
    })
    setSelectedSection(null)
  }

  const removeFromCart = (sectionId: string) => {
    setCart((prev) => prev.filter((i) => i.section.id !== sectionId))
  }

  const cartTotal = cart.reduce((sum, i) => sum + i.section.price_cents * i.quantity, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0)

  const sortedSections = [...sections].sort((a, b) => a.sort_order - b.sort_order)

  const handleCheckout = async () => {
    if (!buyerEmail || !buyerName) return
    setIsCheckingOut(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          buyer_email: buyerEmail,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          items: cart.map((i) => ({
            section_id: i.section.id,
            section_name: i.section.name,
            quantity: i.quantity,
            price_cents: i.section.price_cents,
          })),
        }),
      })

      if (!res.ok) throw new Error('Checkout failed')
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      console.error(err)
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Left: Seating Map */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">Select Seats</h2>

        {/* Interactive SVG Map */}
        {sections.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-[#222] mb-6">
            <svg viewBox="0 0 1000 600" className="w-full" style={{ background: '#111' }}>
              {/* Ring */}
              <ellipse cx="500" cy="300" rx="90" ry="70" fill="#1a1a1a" stroke="#333" strokeWidth="2" />
              <text x="500" y="305" textAnchor="middle" fill="#555" fontSize="13" fontWeight="bold">RING</text>

              {sections.map((section) => {
                const available = seatCounts[section.id] ?? section.capacity
                const isSoldOut = available === 0
                const inCart = cart.find((i) => i.section.id === section.id)
                const isSelected = selectedSection?.id === section.id

                return (
                  <g
                    key={section.id}
                    onClick={() => !isSoldOut && setSelectedSection(isSelected ? null : section)}
                    style={{ cursor: isSoldOut ? 'not-allowed' : 'pointer' }}
                  >
                    <rect
                      x={section.svg_x}
                      y={section.svg_y}
                      width={section.svg_width}
                      height={section.svg_height}
                      rx="6"
                      fill={isSoldOut ? '#333' : section.color}
                      fillOpacity={isSoldOut ? 0.4 : isSelected ? 1 : inCart ? 0.95 : 0.7}
                      stroke={isSelected ? '#fff' : inCart ? '#fff' : 'transparent'}
                      strokeWidth={2}
                    />
                    <text
                      x={section.svg_x + section.svg_width / 2}
                      y={section.svg_y + section.svg_height / 2 - 6}
                      textAnchor="middle"
                      fill={isSoldOut ? '#555' : '#fff'}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {section.name}
                    </text>
                    <text
                      x={section.svg_x + section.svg_width / 2}
                      y={section.svg_y + section.svg_height / 2 + 7}
                      textAnchor="middle"
                      fill={isSoldOut ? '#444' : '#fff'}
                      fontSize="9"
                    >
                      {isSoldOut ? 'SOLD OUT' : section.price_cents > 0 ? `$${section.price_cents / 100}` : 'Free'}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        )}

        {/* Section Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sortedSections.map((section) => {
            const available = seatCounts[section.id] ?? section.capacity
            const isSoldOut = available === 0
            const inCart = cart.find((i) => i.section.id === section.id)

            return (
              <div
                key={section.id}
                onClick={() => !isSoldOut && setSelectedSection(section)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  isSoldOut
                    ? 'border-[#222] bg-[#111] opacity-50 cursor-not-allowed'
                    : selectedSection?.id === section.id
                    ? 'border-white bg-[#1a1a1a]'
                    : inCart
                    ? 'border-[#E63946] bg-[#1a0000]'
                    : 'border-[#222] bg-[#111] hover:border-[#444]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: section.color }} />
                    <span className="text-white font-semibold text-sm">{section.name}</span>
                  </div>
                  {isSoldOut ? (
                    <span className="text-xs text-[#555] font-medium flex items-center gap-1">
                      <Lock size={11} /> SOLD OUT
                    </span>
                  ) : (
                    <span className="text-[#E63946] font-bold text-sm">
                      {section.price_cents > 0 ? `$${(section.price_cents / 100).toFixed(0)}` : 'Free'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 capitalize">{section.section_type}</p>
                {!isSoldOut && (
                  <p className="text-xs text-gray-600 mt-1">{available} available</p>
                )}
                {inCart && (
                  <p className="text-xs text-[#E63946] mt-1 font-medium">{inCart.quantity} in cart</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Quantity picker popup */}
        {selectedSection && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-2xl p-6 w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold">{selectedSection.name}</h3>
                  <p className="text-[#E63946] font-semibold">
                    ${(selectedSection.price_cents / 100).toFixed(0)} per ticket
                  </p>
                </div>
                <button onClick={() => setSelectedSection(null)} className="text-gray-500 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                {seatCounts[selectedSection.id] ?? selectedSection.capacity} seats available
              </p>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[1, 2, 3, 4].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => addToCart(selectedSection, qty)}
                    className="bg-[#E63946] hover:bg-[#c72d3a] text-white rounded-xl py-3 font-bold text-sm transition-colors"
                  >
                    {qty}
                  </button>
                ))}
              </div>

              <p className="text-xs text-gray-600 text-center">Select quantity to add to cart</p>
            </div>
          </div>
        )}
      </div>

      {/* Right: Cart + Checkout */}
      <div className="space-y-4">
        <div className="rounded-xl bg-[#111] border border-[#222] p-5 sticky top-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart size={18} className="text-[#E63946]" />
            <h3 className="text-white font-bold">Your Order</h3>
            {cartCount > 0 && (
              <span className="ml-auto bg-[#E63946] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-6">Click a section to add tickets</p>
          ) : (
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.section.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.section.color }} />
                    <div>
                      <p className="text-white text-sm font-medium">{item.section.name}</p>
                      <p className="text-gray-600 text-xs">{item.quantity} × ${(item.section.price_cents / 100).toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">
                      ${((item.section.price_cents * item.quantity) / 100).toFixed(0)}
                    </span>
                    <button onClick={() => removeFromCart(item.section.id)} className="text-gray-600 hover:text-red-400">
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="border-t border-[#333] pt-3 flex justify-between">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-white font-bold">${(cartTotal / 100).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Buyer Info */}
          {cart.length > 0 && (
            <div className="space-y-2 mb-4">
              <input
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Full name *"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E63946] focus:outline-none"
              />
              <input
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="Email address *"
                type="email"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E63946] focus:outline-none"
              />
              <input
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                placeholder="Phone (optional)"
                type="tel"
                className="w-full rounded-lg bg-[#0a0a0a] border border-[#333] px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-[#E63946] focus:outline-none"
              />
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || !buyerEmail || !buyerName || isCheckingOut}
            className="w-full flex items-center justify-center gap-2 bg-[#E63946] hover:bg-[#c72d3a] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-3 font-bold text-sm transition-colors"
          >
            <Ticket size={16} />
            {isCheckingOut ? 'Redirecting…' : `Buy Tickets · $${(cartTotal / 100).toFixed(2)}`}
          </button>

          <p className="text-xs text-gray-600 text-center mt-2">Powered by Stripe · Tickets sent by email</p>
        </div>
      </div>
    </div>
  )
}
